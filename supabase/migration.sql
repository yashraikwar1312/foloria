create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.magazines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled Magazine',
  slug text unique,
  subtitle text,
  author text,
  description text,
  cover_image text,
  category text,
  visibility text not null default 'public' check (visibility in ('public', 'unlisted', 'private')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  page_count integer not null default 1 check (page_count between 1 and 45),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.magazine_pages (
  id uuid primary key default gen_random_uuid(),
  magazine_id uuid not null references public.magazines(id) on delete cascade,
  page_number integer not null,
  page_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (magazine_id, page_number)
);

create table if not exists public.magazine_assets (
  id uuid primary key default gen_random_uuid(),
  magazine_id uuid references public.magazines(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  asset_url text not null,
  asset_type text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.magazines enable row level security;
alter table public.magazine_pages enable row level security;
alter table public.magazine_assets enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.magazines, public.magazine_pages to anon;
grant select, insert, update, delete on public.profiles, public.magazines, public.magazine_pages, public.magazine_assets to authenticated;

drop policy if exists "public can read public magazines" on public.magazines;
create policy "public can read public magazines" on public.magazines
  for select to anon, authenticated
  using (status = 'published' and visibility = 'public');

drop policy if exists "owners manage magazines" on public.magazines;
create policy "owners manage magazines" on public.magazines
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "public can read published pages" on public.magazine_pages;
create policy "public can read published pages" on public.magazine_pages
  for select to anon, authenticated
  using (exists (
    select 1 from public.magazines
    where magazines.id = magazine_pages.magazine_id
      and magazines.status = 'published'
      and magazines.visibility = 'public'
  ));

drop policy if exists "owners manage pages" on public.magazine_pages;
create policy "owners manage pages" on public.magazine_pages
  for all to authenticated
  using (exists (
    select 1 from public.magazines
    where magazines.id = magazine_pages.magazine_id
      and magazines.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.magazines
    where magazines.id = magazine_pages.magazine_id
      and magazines.user_id = auth.uid()
  ));

drop policy if exists "owners manage profiles" on public.profiles;
create policy "owners manage profiles" on public.profiles
  for all to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "owners manage assets" on public.magazine_assets;
create policy "owners manage assets" on public.magazine_assets
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('magazine-assets', 'magazine-assets', false)
on conflict (id) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
