-- 1) Add canonical storage mapping fields
alter table public.tracks add column if not exists storage_bucket text;
alter table public.tracks add column if not exists storage_key text;

-- 2) Backfill storage_key from any legacy column
update public.tracks
set storage_key = coalesce(storage_key, file_name, file_path)
where storage_key is null;

-- 3) Set default bucket for existing tracks
update public.tracks 
set storage_bucket = 'neuralpositivemusic'
where storage_bucket is null and storage_key is not null;

-- 4) Create unique index to prevent future duplicates
create unique index if not exists uniq_track_storage
on public.tracks (lower(coalesce(storage_bucket,'')), lower(storage_key))
where storage_key is not null;

-- 5) Add helpful function to find broken tracks
create or replace function public.find_broken_tracks()
returns table (
  id uuid,
  title text,
  goal text,
  storage_bucket text,
  storage_key text,
  issue text
)
language sql
as $$
  select 
    t.id,
    t.title,
    t.goal,
    t.storage_bucket,
    t.storage_key,
    case 
      when t.storage_key is null or t.storage_key = '' then 'missing_storage_key'
      when t.storage_bucket is null then 'missing_bucket'
      else 'unknown'
    end as issue
  from public.tracks t
  where t.storage_key is null 
     or t.storage_key = ''
     or t.storage_bucket is null;
$$;