create table capsules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  message text not null,
  unlock_date date not null,
  created_at timestamptz default now()
);

alter table capsules enable row level security;

create policy "Users can view their own capsules"
on capsules for select
using (auth.uid() = user_id);

create policy "Users can insert their own capsules"
on capsules for insert
with check (auth.uid() = user_id);

create policy "Users can delete their own capsules"
on capsules for delete
using (auth.uid() = user_id);

grant select, insert, delete on public.capsules to anon, authenticated;
alter table capsules add column notified boolean default false;
grant select, insert, update, delete on public.capsules to service_role;

-- A profile row per user, separate from auth.users (which you can't freely edit)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email_notifications boolean not null default true,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
on profiles for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on profiles for update
using (auth.uid() = id);

grant select, update on public.profiles to authenticated;
grant select, insert, update on public.profiles to service_role;

-- Auto-create a profile row whenever someone signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email_notifications)
  values (new.id, split_part(new.email, '@', 1), true);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Notify a user by email when their capsule is sealed (fires the
-- notify-sealed Edge Function). Used instead of Supabase's Database
-- Webhooks UI, which failed on this project with
-- `schema "supabase_functions" does not exist` — this trigger achieves
-- the same effect directly via pg_net, without depending on that UI.
create extension if not exists pg_net;

create or replace function public.trigger_notify_sealed()
returns trigger
language plpgsql
security definer
as $$
begin
  perform net.http_post(
    url := 'https://qwrdwikyrpralgryxvwn.supabase.co/functions/v1/notify-sealed',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  );
  return NEW;
end;
$$;

create trigger on_capsule_sealed
  after insert on public.capsules
  for each row execute procedure public.trigger_notify_sealed();

-- capsules.user_id originally had no ON DELETE rule, so deleting a user
-- left their capsules orphaned (pointing at a user_id that no longer
-- exists). Re-add the constraint with CASCADE so a deleted user's
-- capsules are removed along with them, matching profiles' behavior.
delete from capsules
where user_id not in (select id from auth.users);

alter table capsules drop constraint capsules_user_id_fkey;
alter table capsules add constraint capsules_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;