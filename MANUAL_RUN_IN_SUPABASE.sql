-- ============================================================
-- RUN THIS FILE IN SUPABASE SQL EDITOR
-- Project: sona-prod
-- URL: https://supabase.com/dashboard/project/kkbnfpqhhnyuszkknmuj/sql
-- Paste everything below and click Run.
-- ============================================================

-- ============ 001_notifications.sql ============
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
drop trigger if exists sona_reactions_notify on public.sona_reactions;
create trigger sona_reactions_notify after insert on public.sona_reactions
  for each row execute function public.sona_notify_like();
create or replace function public.sona_notify_follow()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.sona_notifications (user_id, actor_id, kind)
  values (new.following_id, new.follower_id, 'follow');
  return new;
end; $$;
drop trigger if exists sona_follows_notify on public.sona_follows;
create trigger sona_follows_notify after insert on public.sona_follows
  for each row execute function public.sona_notify_follow();
notify pgrst, 'reload schema';

-- ============ 002_comments.sql ============
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
create policy "sona_comments_select_all" on public.sona_comments for select using (true);
create policy "sona_comments_insert_own" on public.sona_comments for insert to authenticated with check (auth.uid() = user_id);
create policy "sona_comments_update_own" on public.sona_comments for update to authenticated using (auth.uid() = user_id);
create policy "sona_comments_delete_own" on public.sona_comments for delete to authenticated using (auth.uid() = user_id);
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
drop trigger if exists sona_comments_notify on public.sona_comments;
create trigger sona_comments_notify after insert on public.sona_comments
-- ============ 003_search.sql ============
create extension if not exists pg_trgm;
create index if not exists sona_profiles_username_trgm on public.sona_profiles using gin (username gin_trgm_ops);
create index if not exists sona_profiles_display_name_trgm on public.sona_profiles using gin (display_name gin_trgm_ops);
create index if not exists sona_posts_content_trgm on public.sona_posts using gin (content gin_trgm_ops);
create or replace function public.sona_search_users(q text, lim int default 20)
returns table (id uuid, username text, display_name text, rank real)
language sql stable as $$
  select p.id, p.username, p.display_name,
    greatest(similarity(p.username, q), similarity(p.display_name, q)) as rank
  from public.sona_profiles p
  where p.username ilike '%' || q || '%'
     or p.display_name ilike '%' || q || '%'
  order by rank desc, p.username asc limit lim;
$$;
create or replace function public.sona_search_posts(q text, lim int default 20)
returns table (id uuid, content text, created_at timestamptz, user_id uuid, likes_count int, boost_flag boolean, rank real)
language sql stable as $$
  select p.id, p.content, p.created_at, p.user_id, p.likes_count, p.boost_flag,
    similarity(p.content, q) as rank
  from public.sona_posts p
  where p.content ilike '%' || q || '%'
  order by rank desc, p.created_at desc limit lim;
$$;
notify pgrst, 'reload schema';

-- ============ 004_presence.sql ============
create table public.sona_presence (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_seen timestamptz not null default now(),
  status text not null default 'online' check (status in ('online','away','offline'))
);
create index sona_presence_last_seen_idx on public.sona_presence (last_seen desc);
alter table public.sona_presence enable row level security;
create policy "sona_presence_select_all" on public.sona_presence for select using (true);
create policy "sona_presence_upsert_own" on public.sona_presence for insert to authenticated with check (auth.uid() = user_id);
create policy "sona_presence_update_own" on public.sona_presence for update to authenticated using (auth.uid() = user_id);
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
  for each row execute function public.sona_notify_comment();
notify pgrst, 'reload schema';
-- ============ 005_analytics.sql ============
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
create policy "sona_events_insert_any" on public.sona_events for insert with check (true);
create or replace view public.sona_dau as
  select date_trunc('day', created_at) as day, count(distinct user_id) as dau
  from public.sona_events where user_id is not null group by 1 order by 1 desc;
notify pgrst, 'reload schema';

-- ============ 006_safety.sql ============
create table public.sona_blocks (
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id), check (blocker_id <> blocked_id)
);
create index sona_blocks_blocker_idx on public.sona_blocks (blocker_id);
create index sona_blocks_blocked_idx on public.sona_blocks (blocked_id);
alter table public.sona_blocks enable row level security;
create policy "sona_blocks_select_own" on public.sona_blocks for select to authenticated using (auth.uid() = blocker_id);
create policy "sona_blocks_insert_own" on public.sona_blocks for insert to authenticated with check (auth.uid() = blocker_id);
create policy "sona_blocks_delete_own" on public.sona_blocks for delete to authenticated using (auth.uid() = blocker_id);
create table public.sona_mutes (
  muter_id uuid not null references auth.users(id) on delete cascade,
  muted_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (muter_id, muted_id), check (muter_id <> muted_id)
);
create index sona_mutes_muter_idx on public.sona_mutes (muter_id);
alter table public.sona_mutes enable row level security;
create policy "sona_mutes_select_own" on public.sona_mutes for select to authenticated using (auth.uid() = muter_id);
create policy "sona_mutes_insert_own" on public.sona_mutes for insert to authenticated with check (auth.uid() = muter_id);
create policy "sona_mutes_delete_own" on public.sona_mutes for delete to authenticated using (auth.uid() = muter_id);
create table public.sona_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  target_kind text not null check (target_kind in ('post','comment','profile')),
  target_id uuid not null,
  reason text not null check (reason in ('spam','harassment','hate','misinfo','nudity','violence','self_harm','other')),
  details text check (char_length(details) <= 500),
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);
create index sona_reports_status_idx on public.sona_reports (status, created_at desc);
create index sona_reports_target_idx on public.sona_reports (target_kind, target_id);
alter table public.sona_reports enable row level security;
create policy "sona_reports_insert_any" on public.sona_reports for insert to authenticated with check (auth.uid() = reporter_id);
create policy "sona_reports_select_own" on public.sona_reports for select to authenticated using (auth.uid() = reporter_id);
create or replace function public.sona_is_blocked(a uuid, b uuid)
returns boolean language sql stable as $$
  select exists (select 1 from public.sona_blocks
    where (blocker_id = a and blocked_id = b) or (blocker_id = b and blocked_id = a));
$$;
create or replace function public.sona_is_muted(a uuid, b uuid)
returns boolean language sql stable as $$
  select exists (select 1 from public.sona_mutes where muter_id = a and muted_id = b);
$$;
create or replace function public.sona_visible_user_ids(viewer uuid)
returns table (user_id uuid) language sql stable as $$
  select p.id from public.sona_profiles p
  where not public.sona_is_blocked(viewer, p.id);
$$;
notify pgrst, 'reload schema';