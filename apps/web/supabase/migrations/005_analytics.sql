create table public.sona_events (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete set null,
  event text not null check (char_length(event) <= 60),
  props jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index sona_events_created_idx on public.sona_events (created_at desc);
create index sona_events_user_idx on public.sona_events (user_id, created_at desc);
create index sona_events_event_idx on public.sona_events (event, created_at desc);

alter table public.sona_events enable row level security;

-- Insert-only: no public read (analytics pulled via service role only)
create policy "sona_events_insert_any"
  on public.sona_events for insert
  with check (true);

-- Daily active users view
create or replace view public.sona_dau as
  select date_trunc('day', created_at) as day,
         count(distinct user_id) as dau
  from public.sona_events
  where user_id is not null
  group by 1
  order by 1 desc;

notify pgrst, 'reload schema';
