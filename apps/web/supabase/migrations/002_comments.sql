create table public.sona_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.sona_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references public.sona_comments(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index sona_comments_post_idx on public.sona_comments (post_id, created_at asc);
create index sona_comments_parent_idx on public.sona_comments (parent_id);

alter table public.sona_comments enable row level security;

create policy "sona_comments_select_all"
  on public.sona_comments for select using (true);

create policy "sona_comments_insert_own"
  on public.sona_comments for insert
  to authenticated with check (auth.uid() = user_id);

create policy "sona_comments_update_own"
  on public.sona_comments for update
  to authenticated using (auth.uid() = user_id);

create policy "sona_comments_delete_own"
  on public.sona_comments for delete
  to authenticated using (auth.uid() = user_id);

-- Reply notification
create or replace function public.sona_notify_comment()
returns trigger language plpgsql security definer set search_path = public as $$
declare post_author uuid;
begin
  select user_id into post_author from public.sona_posts where id = new.post_id;
  if post_author is not null and post_author <> new.user_id then
    insert into public.sona_notifications (user_id, actor_id, kind, post_id)
    values (post_author, new.user_id, 'reply', new.post_id);
  end if;
  return new;
end; $$;

create trigger sona_comments_notify
  after insert on public.sona_comments
  for each row execute function public.sona_notify_comment();

notify pgrst, 'reload schema';
