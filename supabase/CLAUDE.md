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

**Comandos:**
- `npx supabase init` — rodado (gerou `config.toml`)
- A validar com os projetos criados: `npx supabase login`, `npx supabase link --project-ref <ref-dev>`, `npx supabase db push`
- Ambiente local (`npx supabase start`) precisa de Docker; não rodou aqui.
