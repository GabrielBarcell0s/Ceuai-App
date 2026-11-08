# Camada Backend (Supabase)

**Faz:** schema Postgres em `migrations/`, Row Level Security por papel, `terreiro_id` em toda tabela, Supabase Auth, regras de sync do PowerSync (buckets por `terreiro_id`) e Edge Functions em `functions/` para o que exige service role (criar/editar contas: histórias 5 e 10).

**Não faz:**
- Regra de tela ou fluxo de navegação.
- Não confia no app: toda permissão é garantida por RLS, mesmo que o app já esconda o botão.
- Service role nunca sai daqui: só Edge Function usa, nunca o app nem `EXPO_PUBLIC_*`.

**Conversa com:** o app via `SupabaseRemoteDataSource` (Auth, Edge Functions, upload) e via PowerSync (download sincronizado).

**Padrões:**
- Uma migration por mudança, nome `AAAAMMDDHHMMSS_descricao.sql` (gerado por `npx supabase migration new <descricao>`).
- Migration roda primeiro em `ceuai-dev`; só vai para `ceuai-prod` depois de aprovada.
- Tabelas e colunas em snake_case.

**Arquivos:**
- `migrations/20261108050000_modelo_inicial.sql` — tabelas, índices e RLS do modelo inicial (start-3)
- `powersync/sync-config.yaml` — Sync Streams: cada aparelho recebe só o terreiro do usuário. É colado no painel do PowerSync de cada ambiente.

**Decisões de banco:**
- Escrita por papel via policy `escrita`; leitura isolada por terreiro via `terreiro_atual()`.
- `terreiros` e `usuarios` não têm policy de escrita: só a Edge Function de contas (service role) grava.
- "Uma gira ativa" fica no domínio, sem índice único: no status da gira vale a última escrita (briefing).
- Presenças têm chave natural `(gira_id, pessoa)`; o upload do app faz upsert por ela.

**Comandos:**
- `npx supabase init` — rodado (gerou `config.toml`)
- A migration foi validada num Postgres 16 local com stubs de `auth` (RLS testada: isolamento por terreiro e escrita por papel)
- A validar com os projetos criados: `npx supabase login`, `npx supabase link --project-ref <ref-dev>`, `npx supabase db push`
- Ambiente local (`npx supabase start`) precisa de Docker; não rodou aqui.
