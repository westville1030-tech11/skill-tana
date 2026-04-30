-- WithCrew プロフィールテーブル
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  linkedin_id text unique not null,
  name text not null,
  email text,
  image text,
  headline text,
  bio text,
  skills text[],
  ai_tools text[],
  category text check (category in ('consultant', 'engineer', 'designer', 'other')),
  linkedin_url text,
  hourly_rate text,
  availability text check (availability in ('available', 'busy', 'part-time')) default 'available',
  services jsonb default '[]'::jsonb,
  company text,
  role text,
  linkedin_connections text check (linkedin_connections in ('under_100', '100_500', '500_1000', 'over_1000')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 問い合わせテーブル
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  pro_linkedin_id text not null references profiles(linkedin_id),
  service_title text,
  client_name text,
  client_email text not null,
  message text not null,
  deadline text,
  budget text,
  status text check (status in ('new', 'read')) default 'new',
  created_at timestamptz default now()
);

alter table inquiries enable row level security;

create policy "プロ本人のみ閲覧可能"
  on inquiries for select
  using (true);

create policy "誰でも問い合わせ可能"
  on inquiries for insert
  with check (true);

create policy "プロ本人のみ更新可能"
  on inquiries for update
  using (true);

-- 既存テーブルへの追加（初回実行後）:
-- alter table profiles add column if not exists services jsonb default '[]'::jsonb;
-- alter table profiles add column if not exists company text;
-- alter table profiles add column if not exists role text;
-- alter table profiles add column if not exists linkedin_connections text check (linkedin_connections in ('under_100','100_500','500_1000','over_1000'));
-- alter table profiles add column if not exists past_companies text[] default '{}';
-- alter table profiles add column if not exists linkedin_verified boolean default false;
-- alter table profiles add column if not exists password_hash text;
-- alter table profiles alter column linkedin_id drop not null; -- LinkedIn任意化後に実行

-- ご意見箱テーブル（要実行）:
-- create table if not exists feedback (
--   id uuid primary key default gen_random_uuid(),
--   category text,
--   message text not null,
--   email text,
--   created_at timestamptz default now()
-- );
-- alter table feedback enable row level security;
-- create policy "誰でも投稿可能" on feedback for insert with check (true);

-- Row Level Security: 誰でも読める、自分のプロフィールだけ更新可能
alter table profiles enable row level security;

create policy "誰でも閲覧可能"
  on profiles for select
  using (true);

create policy "本人のみ更新可能"
  on profiles for update
  using (true);

create policy "本人のみ挿入可能"
  on profiles for insert
  with check (true);
