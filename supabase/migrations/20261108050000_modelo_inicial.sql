-- Modelo inicial do CEUAI (start-3). Fonte: seção Modelagem no Notion e app/src/domain/types.ts.
-- Toda tabela tem terreiro_id (Restrições do briefing). Ids são UUID gerados no aparelho.
-- RLS: leitura restrita ao terreiro do usuário; escrita por papel (app/src/domain/permissoes.ts).

drop table if exists public.setup_placeholder; -- tabela provisória do assistente do PowerSync, se existir

create table public.terreiros (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (length(trim(nome)) > 0)
);

-- Conta de acesso (5, 10). Senha só no Supabase Auth.
create table public.usuarios (
  id uuid primary key references auth.users (id) on delete cascade,
  terreiro_id uuid not null references public.terreiros (id),
  email text not null unique,
  papel text not null check (papel in ('manager', 'controlador', 'contador'))
);

-- Listas de Obrigação e Missão (50).
create table public.opcoes_lista (
  id uuid primary key,
  terreiro_id uuid not null references public.terreiros (id),
  tipo text not null check (tipo in ('obrigacao', 'missao')),
  nome text not null check (length(trim(nome)) > 0)
);
create unique index opcoes_lista_nome_unico on public.opcoes_lista (terreiro_id, tipo, lower(nome));

-- Médium é a pessoa (60).
create table public.mediuns (
  id uuid primary key,
  terreiro_id uuid not null references public.terreiros (id),
  nome text not null check (length(trim(nome)) > 0),
  telefone text,
  email text,
  obrigacao_id uuid references public.opcoes_lista (id) on delete set null,
  missao_id uuid references public.opcoes_lista (id) on delete set null
);

-- Entidade incorporada por um médium (65).
create table public.entidades (
  id uuid primary key,
  terreiro_id uuid not null references public.terreiros (id),
  nome text not null check (length(trim(nome)) > 0),
  medium_id uuid not null references public.mediuns (id)
);

-- Consulente (70).
create table public.consulentes (
  id uuid primary key,
  terreiro_id uuid not null references public.terreiros (id),
  nome text not null check (length(trim(nome)) > 0),
  telefone text,
  email text
);

-- Gira (80, 90, 170). "Uma ativa por vez" é garantida no domínio: no banco vale a
-- última escrita (briefing), então não há índice único que travaria a sincronização.
create table public.giras (
  id uuid primary key,
  terreiro_id uuid not null references public.terreiros (id),
  tipo text not null check (tipo in ('normal', 'fogo')),
  data_hora timestamptz,
  status text not null default 'agendada'
    check (status in ('agendada', 'ativa', 'finalizada', 'cancelada'))
);

-- Presenças por gira (100, 110). Uma linha por pessoa por gira; o upload faz upsert por esta chave.
create table public.presencas_mediuns (
  id uuid primary key,
  terreiro_id uuid not null references public.terreiros (id),
  gira_id uuid not null references public.giras (id),
  medium_id uuid not null references public.mediuns (id),
  presente boolean not null,
  unique (gira_id, medium_id)
);

create table public.presencas_consulentes (
  id uuid primary key,
  terreiro_id uuid not null references public.terreiros (id),
  gira_id uuid not null references public.giras (id),
  consulente_id uuid not null references public.consulentes (id),
  presente boolean not null,
  unique (gira_id, consulente_id)
);

-- Entidade em consulta na gira, dona de uma fila (120).
create table public.consultas (
  id uuid primary key,
  terreiro_id uuid not null references public.terreiros (id),
  gira_id uuid not null references public.giras (id),
  entidade_id uuid not null references public.entidades (id),
  status text not null default 'em_consulta'
    check (status in ('em_consulta', 'congelada', 'encerrada'))
);

-- Fila (130, 150). posicao é espaçada e interna; a tela mostra 1, 2, 3.
create table public.entradas_fila (
  id uuid primary key,
  terreiro_id uuid not null references public.terreiros (id),
  consulta_id uuid not null references public.consultas (id),
  consulente_id uuid not null references public.consulentes (id),
  posicao bigint not null,
  status text not null default 'aguardando'
    check (status in ('aguardando', 'em_atendimento', 'atendido', 'removido', 'encerrado')),
  chegada_em timestamptz not null
);

-- Lote do trabalho de fogo (160).
create table public.lotes (
  id uuid primary key,
  terreiro_id uuid not null references public.terreiros (id),
  gira_id uuid not null references public.giras (id),
  inicio timestamptz not null,
  fim timestamptz,
  check (fim is null or fim >= inicio)
);

-- Atendimento: consulente, entidade, início e fim (140, 160).
create table public.atendimentos (
  id uuid primary key,
  terreiro_id uuid not null references public.terreiros (id),
  gira_id uuid not null references public.giras (id),
  consulente_id uuid not null references public.consulentes (id),
  entidade_id uuid references public.entidades (id),
  entrada_fila_id uuid references public.entradas_fila (id),
  lote_id uuid references public.lotes (id),
  inicio timestamptz not null,
  fim timestamptz,
  check (fim is null or fim >= inicio)
);

-- Índices de leitura frequente.
create index on public.entidades (medium_id);
create index on public.consulentes (terreiro_id, lower(nome));
create index on public.consultas (gira_id);
create index on public.entradas_fila (consulta_id, posicao);
create index on public.atendimentos (gira_id);

-- ===== Autorização =====

create function public.terreiro_atual() returns uuid
language sql stable security definer set search_path = '' as $$
  select terreiro_id from public.usuarios where id = auth.uid()
$$;

create function public.papel_atual() returns text
language sql stable security definer set search_path = '' as $$
  select papel from public.usuarios where id = auth.uid()
$$;

do $$
declare
  t text;
  escrita jsonb := jsonb_build_object(
    'opcoes_lista', '{manager}',
    'mediuns', '{manager}',
    'entidades', '{manager}',
    'consulentes', '{manager,controlador}',
    'giras', '{manager}',
    'presencas_mediuns', '{manager,contador}',
    'presencas_consulentes', '{manager,controlador,contador}',
    'consultas', '{manager,controlador}',
    'entradas_fila', '{manager,controlador}',
    'lotes', '{manager,controlador}',
    'atendimentos', '{manager,controlador}'
  );
begin
  foreach t in array array['terreiros', 'usuarios', 'opcoes_lista', 'mediuns', 'entidades',
    'consulentes', 'giras', 'presencas_mediuns', 'presencas_consulentes', 'consultas',
    'entradas_fila', 'lotes', 'atendimentos']
  loop
    execute format('alter table public.%I enable row level security', t);
    if t = 'terreiros' then
      execute 'create policy leitura on public.terreiros for select to authenticated
        using (id = public.terreiro_atual())';
    else
      execute format('create policy leitura on public.%I for select to authenticated
        using (terreiro_id = public.terreiro_atual())', t);
    end if;
    -- usuarios e terreiros só são escritos pela Edge Function de contas (service role).
    if escrita ? t then
      execute format('create policy escrita on public.%I for all to authenticated
        using (terreiro_id = public.terreiro_atual() and public.papel_atual() = any (%L::text[]))
        with check (terreiro_id = public.terreiro_atual() and public.papel_atual() = any (%L::text[]))',
        t, escrita ->> t, escrita ->> t);
    end if;
  end loop;
end $$;

-- O PowerSync lê com powersync_role (BYPASSRLS); garante leitura nas tabelas novas.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'powersync_role') then
    grant select on all tables in schema public to powersync_role;
  end if;
end $$;
