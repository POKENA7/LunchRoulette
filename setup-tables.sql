-- 拡張機能を有効化
create extension if not exists "uuid-ossp";

-- shops テーブル
create table if not exists public.shops (
  id uuid default uuid_generate_v4() primary key,
  name varchar(255) not null,
  memo text,
  is_blocked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- tags テーブル
create table if not exists public.tags (
  id uuid default uuid_generate_v4() primary key,
  name varchar(100) not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- shop_tags テーブル（多対多の関連テーブル）
create table if not exists public.shop_tags (
  id uuid default uuid_generate_v4() primary key,
  shop_id uuid references public.shops(id) on delete cascade not null,
  tag_id uuid references public.tags(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(shop_id, tag_id)
);

-- RLS (Row Level Security) を有効化
alter table public.shops enable row level security;
alter table public.tags enable row level security;
alter table public.shop_tags enable row level security;

-- パブリックアクセスを許可するポリシー
create policy "Anyone can view shops" on public.shops for select using (true);
create policy "Anyone can insert shops" on public.shops for insert with check (true);
create policy "Anyone can update shops" on public.shops for update using (true);
create policy "Anyone can delete shops" on public.shops for delete using (true);

create policy "Anyone can view tags" on public.tags for select using (true);
create policy "Anyone can insert tags" on public.tags for insert with check (true);
create policy "Anyone can update tags" on public.tags for update using (true);
create policy "Anyone can delete tags" on public.tags for delete using (true);

create policy "Anyone can view shop_tags" on public.shop_tags for select using (true);
create policy "Anyone can insert shop_tags" on public.shop_tags for insert with check (true);
create policy "Anyone can update shop_tags" on public.shop_tags for update using (true);
create policy "Anyone can delete shop_tags" on public.shop_tags for delete using (true);