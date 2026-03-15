-- CLI Quest V2 - Initial Database Schema

-- Users table (extends Supabase Auth)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  player_level text not null default 'intern'
    check (player_level in ('intern', 'junior', 'mid', 'senior', 'staff', 'principal')),
  total_xp integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active_date date,
  streak_freezes_remaining integer not null default 0,
  created_at timestamptz not null default now()
);

-- User progress (level completions)
create table public.user_progress (
  id bigint generated always as identity primary key,
  user_id uuid references public.users on delete cascade not null,
  level_id text not null,
  completed_at timestamptz not null default now(),
  commands_used integer not null default 0,
  hints_used integer not null default 0,
  par_achieved boolean not null default false,
  time_seconds integer not null default 0,
  unique (user_id, level_id)
);

-- Command mastery tracking
create table public.command_mastery (
  id bigint generated always as identity primary key,
  user_id uuid references public.users on delete cascade not null,
  command_name text not null,
  times_used integer not null default 0,
  mastery_tier text not null default 'learned'
    check (mastery_tier in ('learned', 'practiced', 'mastered')),
  last_used_at timestamptz not null default now(),
  decay_notified boolean not null default false,
  unique (user_id, command_name)
);

-- Daily challenges
create table public.daily_challenges (
  id bigint generated always as identity primary key,
  date date not null,
  tier text not null check (tier in ('quick', 'standard', 'hard')),
  config jsonb not null,
  created_at timestamptz not null default now(),
  unique (date, tier)
);

-- Daily challenge results
create table public.daily_challenge_results (
  id bigint generated always as identity primary key,
  user_id uuid references public.users on delete cascade not null,
  challenge_id bigint references public.daily_challenges on delete cascade not null,
  completed_at timestamptz not null default now(),
  time_seconds integer not null default 0,
  commands_used integer not null default 0,
  unique (user_id, challenge_id)
);

-- Achievements
create table public.achievements (
  id bigint generated always as identity primary key,
  user_id uuid references public.users on delete cascade not null,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

-- Indexes
create index idx_user_progress_user on public.user_progress (user_id);
create index idx_user_progress_level on public.user_progress (level_id);
create index idx_command_mastery_user on public.command_mastery (user_id);
create index idx_command_mastery_decay on public.command_mastery (last_used_at)
  where decay_notified = false;
create index idx_daily_challenges_date on public.daily_challenges (date);
create index idx_daily_challenge_results_challenge on public.daily_challenge_results (challenge_id);
create index idx_achievements_user on public.achievements (user_id);

-- Row Level Security
alter table public.users enable row level security;
alter table public.user_progress enable row level security;
alter table public.command_mastery enable row level security;
alter table public.daily_challenges enable row level security;
alter table public.daily_challenge_results enable row level security;
alter table public.achievements enable row level security;

-- Users: read own, update own, insert own
create policy "Users can read own profile"
  on public.users for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert with check (auth.uid() = id);

-- User progress: read/write own
create policy "Users can read own progress"
  on public.user_progress for select using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert with check (auth.uid() = user_id);

-- Command mastery: read/write own
create policy "Users can read own mastery"
  on public.command_mastery for select using (auth.uid() = user_id);

create policy "Users can upsert own mastery"
  on public.command_mastery for insert with check (auth.uid() = user_id);

create policy "Users can update own mastery"
  on public.command_mastery for update using (auth.uid() = user_id);

-- Daily challenges: publicly readable
create policy "Anyone can read daily challenges"
  on public.daily_challenges for select using (true);

-- Daily challenge results: read all (leaderboard), write own
create policy "Anyone can read challenge results"
  on public.daily_challenge_results for select using (true);

create policy "Users can insert own results"
  on public.daily_challenge_results for insert with check (auth.uid() = user_id);

-- Achievements: read/write own
create policy "Users can read own achievements"
  on public.achievements for select using (auth.uid() = user_id);

create policy "Users can insert own achievements"
  on public.achievements for insert with check (auth.uid() = user_id);

-- Auto-create user profile on auth signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'preferred_username', 'user_' || left(new.id::text, 8)),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Player'),
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Daily leaderboard view
create or replace view public.daily_leaderboard as
select
  dcr.challenge_id,
  dc.date,
  dc.tier,
  u.username,
  u.display_name,
  u.avatar_url,
  dcr.time_seconds,
  dcr.commands_used,
  dcr.completed_at,
  rank() over (partition by dcr.challenge_id order by dcr.time_seconds asc) as rank
from public.daily_challenge_results dcr
join public.daily_challenges dc on dc.id = dcr.challenge_id
join public.users u on u.id = dcr.user_id
where dc.date >= current_date - interval '7 days';

-- Weekly XP leaderboard view
create or replace view public.weekly_xp_leaderboard as
select
  u.id as user_id,
  u.username,
  u.display_name,
  u.avatar_url,
  u.total_xp,
  count(up.id) as levels_this_week,
  rank() over (order by u.total_xp desc) as rank
from public.users u
left join public.user_progress up on up.user_id = u.id
  and up.completed_at >= date_trunc('week', current_date)
group by u.id, u.username, u.display_name, u.avatar_url, u.total_xp;

-- Enable realtime for leaderboard
alter publication supabase_realtime add table public.daily_challenge_results;
