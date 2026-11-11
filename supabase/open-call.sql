-- ------------------------------------------------------------------
--  The Open Call: applications, spots and settings
--  Run once in your Supabase project: SQL Editor -> New query -> paste -> Run.
--
--  Security model (Row Level Security):
--   - Anyone can SUBMIT an application, but nobody except an admin can READ them.
--   - Anyone can read the five spots and the open/closed setting (they're public on the page).
--   - Only admins (users listed in open_call_admins) can change spots, settings or applications.
-- ------------------------------------------------------------------

create extension if not exists pgcrypto;

-- Who is allowed into the admin panel ---------------------------------
create table if not exists public.open_call_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.open_call_admins enable row level security;

drop policy if exists "admins can see themselves" on public.open_call_admins;
create policy "admins can see themselves" on public.open_call_admins
  for select to authenticated using (user_id = auth.uid());

create or replace function public.is_open_call_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.open_call_admins where user_id = auth.uid());
$$;

-- Applications ---------------------------------------------------------
create table if not exists public.open_call_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  business_name text not null check (char_length(business_name) between 1 and 120),
  contact_name text not null check (char_length(contact_name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text not null check (char_length(phone) between 6 and 30),
  country text not null check (country in ('Nigeria', 'Benin Republic')),
  category text not null check (char_length(category) between 1 and 80),
  about text not null check (char_length(about) between 1 and 1500),
  goal text not null check (char_length(goal) between 1 and 1500),
  has_domain text not null check (has_domain in ('Yes', 'No', 'Not sure')),
  links text check (links is null or char_length(links) <= 500),
  agreed_to_costs boolean not null check (agreed_to_costs = true),
  agreed_to_feature boolean not null default false check (agreed_to_feature = true),
  status text not null default 'New'
    check (status in ('New', 'Reviewing', 'Shortlisted', 'Accepted', 'Declined')),
  admin_note text,
  spot smallint check (spot between 1 and 5)
);
create index if not exists open_call_applications_created_idx on public.open_call_applications (created_at desc);
alter table public.open_call_applications enable row level security;

drop policy if exists "anyone can apply" on public.open_call_applications;
create policy "anyone can apply" on public.open_call_applications
  for insert to anon, authenticated
  with check (status = 'New' and admin_note is null and spot is null);

drop policy if exists "admins read applications" on public.open_call_applications;
create policy "admins read applications" on public.open_call_applications
  for select to authenticated using (public.is_open_call_admin());

drop policy if exists "admins update applications" on public.open_call_applications;
create policy "admins update applications" on public.open_call_applications
  for update to authenticated using (public.is_open_call_admin()) with check (public.is_open_call_admin());

drop policy if exists "admins delete applications" on public.open_call_applications;
create policy "admins delete applications" on public.open_call_applications
  for delete to authenticated using (public.is_open_call_admin());

-- The five spots (public on the page) -----------------------------------
create table if not exists public.open_call_spots (
  number smallint primary key check (number between 1 and 5),
  stage text not null default 'Available' check (stage in (
    'Available', 'Application received', 'Confirmed', 'Discovery', 'Design',
    'Development', 'Review', 'Ready to launch', 'Launched')),
  share_details boolean not null default false,
  business text,
  category text,
  country text,
  note text,
  image text,
  url text,
  updated_at timestamptz not null default now()
);
alter table public.open_call_spots enable row level security;

drop policy if exists "spots are public" on public.open_call_spots;
create policy "spots are public" on public.open_call_spots for select to anon, authenticated using (true);

drop policy if exists "admins update spots" on public.open_call_spots;
create policy "admins update spots" on public.open_call_spots
  for update to authenticated using (public.is_open_call_admin()) with check (public.is_open_call_admin());

insert into public.open_call_spots (number) values (1), (2), (3), (4), (5) on conflict do nothing;

-- Settings: open or close applications ----------------------------------
create table if not exists public.open_call_settings (
  id smallint primary key default 1 check (id = 1),
  applications_open boolean not null default true
);
alter table public.open_call_settings enable row level security;

drop policy if exists "settings are public" on public.open_call_settings;
create policy "settings are public" on public.open_call_settings for select to anon, authenticated using (true);

drop policy if exists "admins update settings" on public.open_call_settings;
create policy "admins update settings" on public.open_call_settings
  for update to authenticated using (public.is_open_call_admin()) with check (public.is_open_call_admin());

insert into public.open_call_settings (id) values (1) on conflict do nothing;

-- Added later: applicants agree to the website being featured in the portfolio
alter table public.open_call_applications add column if not exists agreed_to_feature boolean not null default false;
alter table public.open_call_applications drop constraint if exists open_call_applications_agreed_to_feature_check;
alter table public.open_call_applications add constraint open_call_applications_agreed_to_feature_check check (agreed_to_feature = true) not valid;

-- Table access for the API roles (row level security above still decides what each can do)
grant usage on schema public to anon, authenticated;
grant insert on public.open_call_applications to anon, authenticated;
grant select, update, delete on public.open_call_applications to authenticated;
grant select on public.open_call_spots, public.open_call_settings to anon, authenticated;
grant update on public.open_call_spots, public.open_call_settings to authenticated;
grant select on public.open_call_admins to authenticated;
grant execute on function public.is_open_call_admin() to anon, authenticated;

-- ------------------------------------------------------------------
--  LAST STEP (after creating your admin user in Authentication -> Users):
--  insert into public.open_call_admins (user_id)
--    select id from auth.users where email = 'YOUR-ADMIN-EMAIL';
-- ------------------------------------------------------------------

-- ------------------------------------------------------------------
--  The visitors' book: visitors sign with a name and a short note.
--  Signatures show straight away; admins can hide or delete them.
-- ------------------------------------------------------------------
create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(btrim(name)) between 1 and 40),
  note text check (note is null or (char_length(note) <= 140 and note !~* '(https?://|www\.|\.[a-z]{2,}/)')),
  visitor text not null default 'dreamer' check (visitor in ('sketcher', 'builder', 'dreamer', 'client')),
  hidden boolean not null default false,
  constraint guestbook_name_no_links check (name !~* '(https?://|www\.)')
);
create index if not exists guestbook_created_idx on public.guestbook (created_at desc);
alter table public.guestbook enable row level security;

drop policy if exists "anyone can sign" on public.guestbook;
create policy "anyone can sign" on public.guestbook for insert to anon, authenticated with check (hidden = false);

drop policy if exists "visible signatures are public" on public.guestbook;
create policy "visible signatures are public" on public.guestbook for select to anon, authenticated using (hidden = false or public.is_open_call_admin());

drop policy if exists "admins update signatures" on public.guestbook;
create policy "admins update signatures" on public.guestbook for update to authenticated using (public.is_open_call_admin()) with check (public.is_open_call_admin());

drop policy if exists "admins delete signatures" on public.guestbook;
create policy "admins delete signatures" on public.guestbook for delete to authenticated using (public.is_open_call_admin());

grant insert, select on public.guestbook to anon, authenticated;
grant update, delete on public.guestbook to authenticated;

-- ------------------------------------------------------------------
--  Anti-spam limits: stop anyone flooding the forms with a script.
--  Visitors' book: at most 20 signatures in any 10 minutes, site-wide.
--  Applications: at most 15 in any hour, site-wide.
--  The server clock sets created_at, so it can't be faked.
-- ------------------------------------------------------------------
create or replace function public.guestbook_limit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.created_at := now();
  if (select count(*) from public.guestbook where created_at > now() - interval '10 minutes') >= 20 then
    raise exception 'The visitors'' book is busy. Please try again shortly.';
  end if;
  return new;
end $$;
drop trigger if exists guestbook_limit on public.guestbook;
create trigger guestbook_limit before insert on public.guestbook for each row execute function public.guestbook_limit();

create or replace function public.applications_limit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.created_at := now();
  if (select count(*) from public.open_call_applications where created_at > now() - interval '1 hour') >= 15 then
    raise exception 'Too many applications right now. Please try again later.';
  end if;
  return new;
end $$;
drop trigger if exists applications_limit on public.open_call_applications;
create trigger applications_limit before insert on public.open_call_applications for each row execute function public.applications_limit();
