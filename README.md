# CEUAI App

App Android para a gestão da gira do terreiro: presença de médiuns e consulentes, consultas por entidade, filas e atendimentos. Funciona **sem internet** durante a gira e sincroniza quando a conexão volta.

Briefing, histórias, protótipo e decisões de arquitetura ficam no [Notion do projeto](https://app.notion.com/p/3de729d9862c81d8af52f0774ab30444).

## Stack

- [Expo](https://expo.dev) SDK 58 + React Native + TypeScript, navegação com Expo Router
- [PowerSync](https://powersync.com): banco SQLite no aparelho, sincronizado com o servidor
- [Supabase](https://supabase.com): Postgres, Auth, Row Level Security e Edge Functions
- Jest + Testing Library, ESLint, Prettier, CI no GitHub Actions

## Estrutura

```
app/                  App Expo
  src/app/            telas e navegação (Expo Router)
  src/ui/             componentes visuais
  src/domain/         regras de negócio em TypeScript puro
  src/data/           repositórios e fontes de dados
    datasources/local/   SQLite via PowerSync (offline)
    datasources/remote/  Supabase (futuramente API em C#)
  src/config/         variáveis de ambiente
supabase/             migrations (Postgres + RLS), regras de sync do PowerSync e Edge Functions
```

Cada camada tem um `CLAUDE.md` explicando o que ela faz e o que não faz. As fronteiras são verificadas pelo lint.

## Pré-requisitos

- Node.js 22
- Android Studio (SDK e emulador) ou um aparelho Android com depuração USB
- Contas no Supabase e no PowerSync (plano gratuito), com os ambientes `ceuai-dev` e `ceuai-prod`

O app usa módulo nativo (SQLite do PowerSync), então **não roda no Expo Go**: precisa de development build.

## Configuração

1. Instale as dependências:
   ```bash
   cd app
   npm ci
   ```
2. Crie os arquivos de ambiente a partir do `app/.env.example`:
   - `app/.env.local` para dev
   - `app/.env.prod` para prod

   Os dois ficam fora do git. Só valores públicos vão neles (URL do Supabase, publishable key e URL do PowerSync); a secret key nunca entra no app.

## Rodando

De dentro de `app/`:

| Comando | O que faz |
| --- | --- |
| `npm run android` | Development build no Android apontando para **dev** |
| `npm run android:prod` | O mesmo, apontando para **prod** |
| `npm start` | Só o servidor do Metro (com o development build já instalado) |

## Qualidade

De dentro de `app/`, os mesmos passos que o CI roda em todo PR:

```bash
npm test               # testes
npm run lint           # ESLint, incluindo as fronteiras das camadas
npm run typecheck      # TypeScript
npm run format:check   # Prettier (npm run format corrige)
```

## Builds (APK)

Perfis em `app/eas.json`, todos gerando APK:

```bash
npx eas-cli@latest build --profile preview      # para testar, aponta para dev
npx eas-cli@latest build --profile production   # para o terreiro, aponta para prod
```

As variáveis de prod vão para o EAS uma vez (e sempre que mudarem):

```bash
npx eas-cli@latest env:push --environment production --path .env.prod
```

## Fluxo de trabalho

- Um card do backlog por vez, na ordem da view "Fila de dev" no Notion.
- Branch por card (`card/<ordem>-<slug>`), PR para `main`, merge após aprovação.
- Commits em português: `tipo(escopo): descrição`.
- Migration do banco roda primeiro em dev e só vai para prod depois de aprovada.

## Dados pessoais

O app guarda nome, telefone e e-mail ligados a prática religiosa (LGPD). Este repositório é público: nunca versione arquivos `.env`, chaves ou dados reais.
