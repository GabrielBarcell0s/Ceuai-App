# Camada Dados

**Faz:** implementa as interfaces de repositório do Domínio combinando duas fontes:

- `datasources/local/` — `LocalDataSource`, implementado por `PowerSyncLocalDataSource` (SQLite via PowerSync). Toda leitura e escrita do dia a dia, offline.
- `datasources/remote/` — `RemoteDataSource`, implementado por `SupabaseRemoteDataSource`. Auth, ações só-online (primeiro acesso, contas, redefinir senha) e envio das alterações pendentes (o `uploadData` do conector PowerSync delega para ela). A futura API em C# é outra implementação desta interface.
- `repositories/` — implementações dos repositórios que o App consome. `repositories/index.ts` (`criarRepositorios`) é a raiz de composição: cada card acrescenta ali o repositório que implementa.
- `datasources/local/observar.ts` — transforma uma consulta SQL local em `Observavel` (o PowerSync reemite quando as tabelas mudam). Base de toda leitura.
- `react/` — o que a tela usa: `RepositoriosProvider`, `useRepositorio(nome)` (falha alto se o card ainda não existe), `useObservavel` (carregando, pronto, erro), `useAcao` (escrita com enviando e erro), `SessaoProvider`/`useSessao`/`usePode`, `useContextoDaGira`.

**Não faz:**

- Regra de negócio: valida com as funções do Domínio, não reinventa.
- Não exporta datasource para o App: a tela só vê repositórios e hooks.
- Repositório não sabe de onde veio o dado: quem escolhe Local ou Remote é a composição aqui dentro.

**Conversa com:** Domínio (tipos e interfaces), PowerSync e Supabase. É a única camada que importa `@powersync/*` e `@supabase/*`.

**Padrões:**

- IDs gerados no aparelho (UUID). `terreiro_id` em toda gravação.
- Dependências externas injetadas no construtor (ex.: `fetch`) para testar sem rede.
- Teste em `__tests__/` com fontes falsas; nada de rede real em teste.
