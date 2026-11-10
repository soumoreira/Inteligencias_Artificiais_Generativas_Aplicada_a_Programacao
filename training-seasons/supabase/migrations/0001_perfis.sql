-- Training Seasons · Migração 0001: tabela de perfis com segurança por linha (RLS)
-- Como usar: Supabase > SQL Editor > New query > cole tudo > Run.

-- 1) A "ficha" de cada pessoa. O id é o mesmo da conta de login.
--    on delete cascade: se a conta for excluída, a ficha some junto (direito de exclusão / LGPD).
create table if not exists public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null default '',
  criado_em timestamptz not null default now()
);

-- 2) Liga as "gavetas trancadas": sem uma regra explícita, ninguém acessa nada.
alter table public.perfis enable row level security;

-- 3) Regras: cada pessoa logada só enxerga e só edita a PRÓPRIA ficha.
--    (select auth.uid()) = quem está logado. Não existe regra de inserir/apagar
--    pelo site: a ficha é criada pelo gatilho abaixo e removida junto com a conta.
drop policy if exists "ver o proprio perfil" on public.perfis;
create policy "ver o proprio perfil"
  on public.perfis for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "editar o proprio perfil" on public.perfis;
create policy "editar o proprio perfil"
  on public.perfis for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- 4) Gatilho: quando alguém se cadastra, cria a ficha automaticamente,
--    copiando o nome informado no formulário.
create or replace function public.criar_perfil_no_cadastro()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfis (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nome', ''));
  return new;
end;
$$;

drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil_no_cadastro();
