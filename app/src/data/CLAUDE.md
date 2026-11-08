# Camada Dados

**Faz:** implementa as interfaces de repositório do Domínio combinando duas fontes:

- `datasources/local/` — `LocalDataSource`, implementado por `PowerSyncLocalDataSource` (SQLite via PowerSync). Toda leitura e escrita do dia a dia, offline.
- `datasources/remote/` — `RemoteDataSource`, implementado por `SupabaseRemoteDataSource`. Auth, ações só-online (primeiro acesso, contas, redefinir senha) e envio das alterações pendentes (o `uploadData` do conector PowerSync delega para ela). A futura API em C# é outra implementação desta interface.
- `repositories/` — implementações dos repositórios que o App consome.

**Não faz:**

- Regra de negócio: valida com as funções do Domínio, não reinventa.
- Não exporta datasource para o App: a tela só vê repositórios e hooks.
- Repositório não sabe de onde veio o dado: quem escolhe Local ou Remote é a composição aqui dentro.

**Conversa com:** Domínio (tipos e interfaces), PowerSync e Supabase. É a única camada que importa `@powersync/*` e `@supabase/*`.

**Padrões:**

- IDs gerados no aparelho (UUID). `terreiro_id` em toda gravação.
- Dependências externas injetadas no construtor (ex.: `fetch`) para testar sem rede.
- Teste em `__tests__/` com fontes falsas; nada de rede real em teste.
