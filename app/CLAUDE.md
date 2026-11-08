# app/ — pacote Expo (camadas App, Domínio e Dados)

Expo SDK 58, React Native 0.88, TypeScript strict, Expo Router (rotas em `src/app/`). Só Android.

## Estrutura

- `src/app/` — camada App: rotas/telas (ver `src/app/CLAUDE.md`)
- `src/ui/` — camada App: componentes visuais reutilizáveis (start-4)
- `src/domain/` — camada Domínio (ver `src/domain/CLAUDE.md`)
- `src/data/` — camada Dados (ver `src/data/CLAUDE.md`)
- `src/config/env.ts` — leitura das variáveis `EXPO_PUBLIC_*`

As fronteiras são verificadas pelo ESLint (`no-restricted-imports` em `eslint.config.js`): Domínio não importa RN/Expo/infra; App não importa Supabase, PowerSync nem `@/data/datasources/*`.

## Comandos (rodados e passando)

- `npm ci` — instala as dependências
- `npm test` — Jest (preset `jest-expo`)
- `npm run lint` — ESLint (`expo lint`)
- `npm run typecheck` — `tsc --noEmit`
- `npm run format:check` / `npm run format` — Prettier
- `EXPO_OFFLINE=1 npx expo export --platform android` — gera o bundle Android (prova de que o app compila)

A validar no seu aparelho (precisam de Android/emulador, não rodaram aqui):

- `npm run android` — development build com `.env.local` (dev)
- `npm run android:prod` — o mesmo com `.env.prod`
- `npx eas-cli@latest build --profile preview` — APK apontando para dev; `--profile production` para prod

## Regras do pacote

- Instalar dependência com `npx expo install <pacote>` (resolve a versão do SDK). Se a API do Expo estiver inacessível, use `npm install` com a faixa `~58`.
- PowerSync usa módulo nativo (op-sqlite): o app **não roda no Expo Go**, só em development build.
- `android/` e `ios/` são gerados (CNG): nunca editar à mão, configurar em `app.json`.
- Teste fica em `__tests__/` ao lado do código testado, nome `*.test.ts(x)`.
- Ambientes: `.env.local` (dev, carregado automaticamente pelo Expo) e `.env.prod` (via `dotenv-cli` nos scripts `:prod`). Para builds EAS, os valores vão para o EAS: `npx eas-cli@latest env:push --environment production --path .env.prod`.
