-- ============ BLOCKS ============
create table public.sona_blocks (
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create index sona_blocks_blocker_idx on public.sona_blocks (blocker_id);
create index sona_blocks_blocked_idx on public.sona_blocks (blocked_id);

alter table public.sona_blocks enable row level security;

create policy "sona_blocks_select_own"
  on public.sona_blocks for select
  to authenticated using (auth.uid() = blocker_id);

create policy "sona_blocks_insert_own"
  on public.sona_blocks for insert
  to authenticated with check (auth.uid() = blocker_id);

create policy "sona_blocks_delete_own"
  on public.sona_blocks for delete
  to authenticated using (auth.uid() = blocker_id);

-- ============ MUTES ============
create table public.sona_mutes (
  muter_id uuid not null references auth.users(id) on delete cascade,
  muted_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (muter_id, muted_id),
  check (muter_id <> muted_id)
);

create index sona_mutes_muter_idx on public.sona_mutes (muter_id);

alter table public.sona_mutes enable row level security;

create policy "sona_mutes_select_own"
  on public.sona_mutes for select
  to authenticated using (auth.uid() = muter_id);

create policy "sona_mutes_insert_own"
  on public.sona_mutes for insert
  to authenticated with check (auth.uid() = muter_id);

create policy "sona_mutes_delete_own"
  on public.sona_mutes for delete
  to authenticated using (auth.uid() = muter_id);

-- ============ REPORTS ============
create table public.sona_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  target_kind text not null check (target_kind in ('post','comment','profile')),
  target_id uuid not null,
  reason text not null check (reason in (
    'spam','harassment','hate','misinfo','nudity','violence','self_harm','other'
  )),
  details text check (char_length(details) <= 500),
  status text not null default 'open'
    check (status in ('open','reviewing','resolved','dismissed')),
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index sona_reports_status_idx
  on public.sona_reports (status, created_at desc);

create index sona_reports_target_idx
  on public.sona_reports (target_kind, target_id);

alter table public.sona_reports enable row level security;

-- Reporters can insert and see their own reports
create policy "sona_reports_insert_any"
  on public.sona_reports for insert
  to authenticated with check (auth.uid() = reporter_id);

create policy "sona_reports_select_own"
  on public.sona_reports for select
  to authenticated using (auth.uid() = reporter_id);

-- Mods resolve via service_role only (no user policy for update)

-- ============ HELPER VIEWS ============
-- Is viewer blocked by target, or has viewer blocked target?
create or replace function public.sona_is_blocked(a uuid, b uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.sona_blocks
    where (blocker_id = a and blocked_id = b)
       or (blocker_id = b and blocked_id = a)
  );
$$;

-- Is viewer muting target?
create or replace function public.sona_is_muted(a uuid, b uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.sona_mutes
    where muter_id = a and muted_id = b
  );
$$;

-- Filter helper: exclude posts from users who block or are blocked by viewer
create or replace function public.sona_visible_user_ids(viewer uuid)
returns table (user_id uuid) language sql stable as $$
  select p.id
  from public.sona_profiles p
  where not public.sona_is_blocked(viewer, p.id);
$$;

notify pgrst, 'reload schema';
