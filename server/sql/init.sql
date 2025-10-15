create table if not exists actions(
  id text primary key,
  type text not null,
  actor jsonb not null,
  target text,
  params jsonb,
  timestamp timestamptz not null,
  received_at timestamptz not null default now(),
  hash text not null,
  prev_hash text
);
create index if not exists actions_type_ts on actions(type, timestamp);

create table if not exists evidence(
  id bigserial primary key,
  action_id text not null references actions(id) on delete cascade,
  checks jsonb not null,
  timestamp timestamptz not null,
  received_at timestamptz not null default now(),
  hash text not null,
  prev_hash text
);
create index if not exists evidence_action_ts on evidence(action_id, timestamp);
