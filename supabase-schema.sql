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
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 既存テーブルにservicesカラムを追加する場合（初回実行後）:
-- alter table profiles add column if not exists services jsonb default '[]'::jsonb;

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
