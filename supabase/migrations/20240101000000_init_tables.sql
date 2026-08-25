-- Create tables for Trattoria del Corso

-- Enable UUID extension for unique IDs if needed
create extension if not exists "uuid-ossp";

-- Menu items table
create table if not exists menu_items (
  id text primary key,
  name text not null,
  description text,
  price numeric not null,
  category text not null check (category in ('antipasti', 'primi', 'secondi', 'contorni', 'dolci', 'vini', 'bevande')),
  is_wood_fired boolean default false,
  is_pasta_boiler boolean default false,
  is_local_specialty boolean default false,
  is_daily_special boolean default false,
  allergens text[],
  is_vegetarian boolean default false,
  is_biologico boolean default false,
  is_available boolean default true
);

-- Gallery items table
create table if not exists gallery_items (
  id text primary key,
  src text not null,
  alt text not null,
  title text,
  category text not null check (category in ('piatti', 'ambiente', 'dettagli'))
);

-- Opening hours table
create table if not exists opening_hours (
  day_name text not null,
  day_code integer not null check (day_code >= 0 and day_code <= 6),
  is_closed boolean default false,
  lunch_open time,
  lunch_close time,
  dinner_open time,
  dinner_close time,
  primary key (day_name, day_code)
);

-- Enable Row Level Security (RLS) for public read access
-- Menu items: public read
alter table menu_items enable row level security;
create policy "Public read access" on menu_items for select using (true);
create policy "Service role full access" on menu_items for all using (auth.role() = 'service_role');

-- Gallery items: public read
alter table gallery_items enable row level security;
create policy "Public read access" on gallery_items for select using (true);
create policy "Service role full access" on gallery_items for all using (auth.role() = 'service_role');

-- Opening hours: public read
alter table opening_hours enable row level security;
create policy "Public read access" on opening_hours for select using (true);
create policy "Service role full access" on opening_hours for all using (auth.role() = 'service_role');
