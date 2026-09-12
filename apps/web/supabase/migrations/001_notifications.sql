create table public.sona_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  kind text not null check (kind in ('like','follow','reply','mention')),
  post_id uuid references public.sona_posts(id) on delete cascade,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index sona_notifications_user_unread_idx
  on public.sona_notifications (user_id, read, created_at desc);

alter table public.sona_notifications enable row level security;

create policy "sona_notifications_select_own"
  on public.sona_notifications for select
  to authenticated using (auth.uid() = user_id);

create policy "sona_notifications_update_own"
  on public.sona_notifications for update
  to authenticated using (auth.uid() = user_id);

-- Trigger: like creates notification
create or replace function public.sona_notify_like()
returns trigger language plpgsql security definer set search_path = public as $$
declare post_author uuid;
begin
  select user_id into post_author from public.sona_posts where id = new.post_id;
  if post_author is not null and post_author <> new.user_id then
    insert into public.sona_notifications (user_id, actor_id, kind, post_id)
    values (post_author, new.user_id, 'like', new.post_id);
  end if;
  return new;
end; $$;

create trigger sona_reactions_notify
  after insert on public.sona_reactions
  for each row execute function public.sona_notify_like();

-- Trigger: follow creates notification
create or replace function public.sona_notify_follow()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.sona_notifications (user_id, actor_id, kind)
  values (new.following_id, new.follower_id, 'follow');
  return new;
end; $$;

create trigger sona_follows_notify
  after insert on public.sona_follows
  for each row execute function public.sona_notify_follow();

notify pgrst, 'reload schema';
