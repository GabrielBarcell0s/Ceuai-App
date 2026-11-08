# CEUAI App — gestão de gira do terreiro

App mobile que substitui o caderno de papel do terreiro: presença de médiuns e consulentes, consultas por entidade, filas e atendimentos, tudo funcionando **sem internet** durante a gira.

Fonte de verdade (briefing, histórias, protótipo, arquitetura): [App Terreiro de Umbanda no Notion](https://app.notion.com/p/3de729d9862c81d8af52f0774ab30444)
Protótipo das telas: https://claude.ai/artifact/Wuw3Xy1rB3M3PP7y8w3jcG (especificação visual; nada do HTML dele entra no app)

## Stack

- Expo SDK estável mais recente, React Native, TypeScript (`strict`)
- Expo Router (navegação)
- PowerSync React Native SDK (SQLite local + sincronização)
- Supabase: Postgres, Auth, Row Level Security, Edge Functions (Deno), Supabase CLI para migrations
- Jest + React Native Testing Library; ESLint + Prettier
- EAS Build com perfis `development`, `preview` (aponta para dev) e `production` (aponta para prod)

## Camadas e fronteiras

Monorepo: `app/` (Expo) e `supabase/` (backend).

- **App** (`app/src/app`, `app/src/ui`): telas, navegação, componentes, estado de tela. Nunca fala com rede nem banco: chama repositórios/casos de uso.
- **Domínio** (`app/src/domain`): TypeScript puro. Entidades, estados da gira, fila, atendimento, lote do fogo, permissões por papel e as interfaces dos repositórios. Não importa React Native, PowerSync nem Supabase.
- **Dados** (`app/src/data`): implementa os repositórios do Domínio sobre duas fontes:
  - `datasources/local` → `LocalDataSource` (SQLite via PowerSync): toda leitura e escrita do dia a dia, offline.
  - `datasources/remote` → interface `RemoteDataSource`, hoje `SupabaseRemoteDataSource`: auth, ações só-online (primeiro acesso, contas, redefinir senha) e envio das alterações pendentes (`uploadData` do PowerSync delega para ela). A troca futura para API em C# é uma nova implementação desta interface, e nada mais muda.
  - Só esta camada conhece PowerSync e Supabase. Repositório não sabe de onde veio o dado.
- **Backend** (`supabase/`): migrations, RLS por papel, `terreiro_id` em toda tabela, regras de sync do PowerSync por `terreiro_id`, Edge Function de criação de contas. Sem regra de tela.

## Regras de dados offline (do briefing)

- IDs gerados no aparelho (UUID).
- Posição na fila com numeração espaçada (1000, 2000...) é dado interno, só para ordenar sem reescrever a fila. Na tela o consulente aparece numerado em sequência (1, 2, 3...), calculado pela ordem atual.
- Status da gira: última escrita vence.
- Toda história que registra dado tem "funciona sem internet e sincroniza depois" como critério de aceite.
- Dado sensível (LGPD): nome/telefone/e-mail ligados a prática religiosa. RLS sempre ligado; nunca logar dado pessoal.

## Ambientes

- Supabase `ceuai-dev` e `ceuai-prod`, cada um com sua instância PowerSync.
- Migration nasce e é testada em dev; só vai para prod depois de aprovada.
- Variáveis em `.env.local` (dev) e `.env.prod` (prod), ambos no `.gitignore`. Só `.env.example` é versionado. Os arquivos preenchidos são entregues ao Barcellos, que os guarda.
- **Repositório público:** nunca versionar `.env*` (exceto `.env.example`), chaves, service role ou dado real.
- **Só Android.** Nada de configuração, build ou teste para iOS.

## Convenções

- Código em inglês (nomes de variáveis, funções, arquivos); termos do domínio mantêm o nome do terreiro quando não há tradução fiel (`gira`, `medium`, `consulente`, `entidade`).
- Textos de tela em português.
- Commits em português: `tipo(escopo): descrição` com tipo em feat, fix, test, refactor, chore, docs.
- Branch por card: `card/<ordem>-<slug>` (ex.: `card/120-entidade-em-consulta`), PR para `main`, merge só após aprovação do Barcellos. `main` sempre roda.

## Comandos

Rodar de dentro de `app/` (detalhes e comandos que dependem do aparelho em `app/CLAUDE.md`):

- `npm ci` · `npm test` · `npm run lint` · `npm run typecheck` · `npm run format:check`

O CI (`.github/workflows/ci.yml`) roda esses mesmos passos em todo PR. Backend: ver `supabase/CLAUDE.md`.

## Lista de Proibições (vale no app real, não só no protótipo)

Só pedido explícito do Barcellos libera um item, e a liberação é registrada aqui.

Cor e fundo, nunca: gradientes agressivos; fundo branco puro `#FFF`; cores de arco-íris; roxo com preto; neon; pastel básico; orbes radiais; "liquid glass"/blur decorativo.
Superfície e ornamento, nunca: sombras (drop shadow); cantos arredondados de template (raio é decisão do design: 16/20/24 do protótipo); dot grids; faixa colorida na lateral esquerda; bento grids; três cards de funcionalidade em fileira; janela de terminal decorativa.
Ícones, tipos e símbolos, nunca: ícones do Lucide; sparkles; emoji na interface; Inter, Geist ou Space Grotesk (o protótipo usa Bricolage Grotesque + Archivo); marcadores de lista com checkmark.
Movimento, nunca: animação de hover (feedback de toque é estado pressed); setas animadas.
Copy, nunca: travessão (em dash) nos textos de tela; construção "não é x, é y"; depoimentos falsos; três planos de preço.
Sempre incluir: dados reais do domínio nas telas; skeleton no carregamento (nunca spinner genérico ou tela em branco); Termos de Uso e Política de Privacidade acessíveis em Configurações.

## O que não fazer neste projeto

- Não criar API própria (C# inclusive) no MVP; não usar Redux/Zustand; não abrir canal realtime separado; sem push, versão web, analytics, microserviços, filas de mensagem ou event sourcing.
- Não adicionar biblioteca de arrastar para reordenar: a fila é por controles (subir, descer, ao topo).
- Fora do MVP: relatórios de frequência, histórico de puxadas, financeiro, onboarding de novo terreiro, permissões configuráveis, multi-tenant, presença por quiosque, desativar/excluir conta.

## Como o trabalho anda

Um card por vez, na ordem da view "Fila de dev" do Backlog do MVP no Notion.
1. `spec-card` escreve a seção Spec no próprio card (Status "Em spec") e espera aprovação.
2. `dev-card` implementa o spec aprovado (Status "Em dev"), fecha os testes, mostra rodando (Status "Em revisão") e, aprovado, abre/mergeia o PR e preenche `Commit` (Status "Concluída").
3. Mudança de comportamento descoberta no caminho volta para a `mvp-4`, nunca é resolvida só no código.
