create extension if not exists pg_trgm;

create index if not exists sona_profiles_username_trgm
  on public.sona_profiles using gin (username gin_trgm_ops);

create index if not exists sona_profiles_display_name_trgm
  on public.sona_profiles using gin (display_name gin_trgm_ops);

create index if not exists sona_posts_content_trgm
  on public.sona_posts using gin (content gin_trgm_ops);

-- Search users by username or display_name
create or replace function public.sona_search_users(q text, lim int default 20)
returns table (id uuid, username text, display_name text, rank real)
language sql stable as $$
  select p.id, p.username, p.display_name,
    greatest(
      similarity(p.username, q),
      similarity(p.display_name, q)
    ) as rank
  from public.sona_profiles p
  where p.username ilike '%' || q || '%'
     or p.display_name ilike '%' || q || '%'
  order by rank desc, p.username asc
  limit lim;
$$;

-- Search posts by content
create or replace function public.sona_search_posts(q text, lim int default 20)
returns table (
  id uuid, content text, created_at timestamptz, user_id uuid,
  likes_count int, boost_flag boolean, rank real
)
language sql stable as $$
  select p.id, p.content, p.created_at, p.user_id,
    p.likes_count, p.boost_flag,
    similarity(p.content, q) as rank
  from public.sona_posts p
  where p.content ilike '%' || q || '%'
  order by rank desc, p.created_at desc
  limit lim;
$$;

notify pgrst, 'reload schema';
