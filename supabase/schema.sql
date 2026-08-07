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
