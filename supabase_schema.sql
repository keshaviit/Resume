-- 1. Create the resumes table
create table resumes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text default '',
  role text default '',
  summary text default '',
  skills jsonb default '[]'::jsonb,
  experience jsonb default '[]'::jsonb,
  education jsonb default '[]'::jsonb,
  projects jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Turn on Row Level Security (RLS) for privacy
alter table resumes enable row level security;

-- 3. Create a policy allowing a user to SELECT only their own resume
create policy "Users can view own resume." on resumes
  for select using (auth.uid() = user_id);

-- 4. Create a policy allowing a user to INSERT only their own resume
create policy "Users can insert own resume." on resumes
  for insert with check (auth.uid() = user_id);

-- 5. Create a policy allowing a user to UPDATE only their own resume
create policy "Users can update own resume." on resumes
  for update using (auth.uid() = user_id);
