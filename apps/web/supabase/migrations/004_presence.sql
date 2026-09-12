create table public.sona_presence (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_seen timestamptz not null default now(),
  status text not null default 'online' check (status in ('online','away','offline'))
);

create index sona_presence_last_seen_idx on public.sona_presence (last_seen desc);

alter table public.sona_presence enable row level security;

create policy "sona_presence_select_all"
  on public.sona_presence for select using (true);

create policy "sona_presence_upsert_own"
  on public.sona_presence for insert
  to authenticated with check (auth.uid() = user_id);

create policy "sona_presence_update_own"
  on public.sona_presence for update
  to authenticated using (auth.uid() = user_id);

-- Helper: 6-tier presence label
create or replace function public.sona_presence_label(last_seen timestamptz)
returns text language sql immutable as $$
  select case
    when now() - last_seen < interval '2 minutes' then 'online'
    when now() - last_seen < interval '10 minutes' then 'just_left'
    when now() - last_seen < interval '1 hour' then 'minutes_ago'
    when now() - last_seen < interval '24 hours' then 'hours_ago'
    when now() - last_seen < interval '7 days' then 'days_ago'
    else 'never'
  end;
$$;

notify pgrst, 'reload schema';
