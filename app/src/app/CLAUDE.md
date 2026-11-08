# Camada App (telas e navegação)

**Faz:** rotas do Expo Router, montagem das telas, estado de tela (formulário aberto, seleção, carregando), navegação por papel. Mostra o que o protótipo especifica.

**Não faz:**

- Regra de negócio (uma gira ativa, uma entrada por consulente, lote do fogo, permissão): é do Domínio. A tela pergunta, não decide.
- Acesso a rede ou banco: nada de Supabase, PowerSync ou `@/data/datasources/*` aqui (o lint bloqueia).
- Cálculo de posição da fila: a tela mostra 1, 2, 3 a partir da ordem que o repositório devolve.

**Conversa com:** repositórios e casos de uso expostos por `@/data` e tipos de `@/domain`. Dados reativos chegam por hooks da camada de Dados.

**Padrões:**

- Todo arquivo `.tsx` aqui é rota; componente reutilizável vai para `src/ui/`.
- Nome de arquivo de rota em kebab-case português do domínio (ex.: `gira-ativa.tsx`).
- Teste de tela fica em `src/ui/__tests__/`, nunca dentro de `src/app/` (o Router trataria o arquivo como rota).
- Lista de Proibições do `CLAUDE.md` raiz vale em toda tela.
