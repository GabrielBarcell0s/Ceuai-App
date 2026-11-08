# Camada Domínio

**Faz:** entidades (gira, médium, entidade, consulente, presença, fila, atendimento, usuário/papel), invariantes e máquinas de estado (agendada → ativa → finalizada/cancelada), regras da fila (posição espaçada, uma entrada por consulente por fila, congelar ao sair de consulta), lote do fogo e permissões por papel. Declara as **interfaces** dos repositórios.

**Não faz:**

- Nada de React, React Native, Expo, PowerSync ou Supabase (o lint bloqueia).
- Não importa `@/app`, `@/ui` nem `@/data`: as outras camadas dependem dele, nunca o contrário.
- Não persiste nem busca dado: só define o contrato que a camada de Dados implementa.

**Conversa com:** exporta tipos, funções puras e interfaces; Dados implementa as interfaces, App consome os tipos.

**Padrões:**

- TypeScript puro, funções puras sempre que possível; datas recebidas como parâmetro (sem `new Date()` escondido) para poder testar.
- Um teste por invariante, em `__tests__/` ao lado do arquivo. Esta é a camada com mais testes.
- Nome de entidade em inglês no código, com o termo do terreiro quando não houver tradução fiel (`Gira`, `Medium`, `Consulente`, `Entidade`).
