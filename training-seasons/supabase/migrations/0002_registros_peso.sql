-- Training Seasons · Migração 0002: dados do perfil e registros semanais de peso
-- Como usar: Supabase > SQL Editor > New query > cole tudo > Run.
-- Pode rodar mais de uma vez sem problema (usa "if not exists" / "drop ... if exists").

-- 1) Novos campos na ficha do perfil. Limites evitam dados absurdos.
alter table public.perfis
  add column if not exists altura_cm smallint
    check (altura_cm between 100 and 250),
  add column if not exists peso_inicial_kg numeric(5, 1)
    check (peso_inicial_kg between 20 and 500),
  add column if not exists meta_peso_kg numeric(5, 1)
    check (meta_peso_kg between 20 and 500),
  add column if not exists meta_prazo date;

-- 2) Um registro de peso por pessoa por semana.
--    "semana" guarda sempre a SEGUNDA-FEIRA da semana (isodow = 1).
--    unique (user_id, semana) impede duas pesagens na mesma semana.
--    default auth.uid(): o dono do registro é sempre quem está logado.
create table if not exists public.registros_peso (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  semana date not null check (extract(isodow from semana) = 1),
  peso_kg numeric(5, 1) not null check (peso_kg between 20 and 500),
  observacao text check (observacao is null or char_length(observacao) <= 280),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (user_id, semana)
);

-- 3) Liga as "gavetas trancadas" (RLS): cada pessoa só mexe nos próprios registros.
alter table public.registros_peso enable row level security;

drop policy if exists "ver os proprios registros" on public.registros_peso;
create policy "ver os proprios registros"
  on public.registros_peso for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "criar os proprios registros" on public.registros_peso;
create policy "criar os proprios registros"
  on public.registros_peso for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "editar os proprios registros" on public.registros_peso;
create policy "editar os proprios registros"
  on public.registros_peso for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "apagar os proprios registros" on public.registros_peso;
create policy "apagar os proprios registros"
  on public.registros_peso for delete
  to authenticated
  using ((select auth.uid()) = user_id);
