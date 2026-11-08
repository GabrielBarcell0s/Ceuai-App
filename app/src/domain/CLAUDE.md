# Camada Domínio

**Faz:** o modelo canônico do CEUAI, as invariantes, as máquinas de estado e as permissões por papel. Declara o contrato que a camada de Dados implementa (`repositories.ts`).

**Não faz:**

- Nada de React, React Native, Expo, PowerSync ou Supabase (o lint bloqueia).
- Não importa `@/app`, `@/ui` nem `@/data`: as outras camadas dependem dele, nunca o contrário.
- Não persiste nem busca dado, não gera id nem lê relógio: recebe tudo por parâmetro.

## Mapa

| Arquivo           | O que tem                                                                               | Histórias                 |
| ----------------- | --------------------------------------------------------------------------------------- | ------------------------- |
| `types.ts`        | Entidades e valores do modelo                                                           | todas                     |
| `errors.ts`       | `DomainError` com códigos nomeados (um por caso de borda)                               | todas                     |
| `permissoes.ts`   | `Acao`, `pode()`, `exigirPermissao()`                                                   | 10–180                    |
| `cadastros.ts`    | Nome obrigatório, e-mail, primeiro acesso, tipo de gira, opção duplicada, nome parecido | 5, 10, 50, 60, 65, 70, 80 |
| `gira.ts`         | Estados agendada → ativa → finalizada / cancelada, uma ativa por vez                    | 80, 90, 170               |
| `presenca.ts`     | Entrar na fila marca presença                                                           | 100, 110, 130             |
| `consulta.ts`     | Entidade em consulta, congelar e encerrar a fila                                        | 120, 140                  |
| `fila.ts`         | Posição espaçada, mover (subir, descer, topo), numeração exibida                        | 130, 150                  |
| `atendimento.ts`  | Iniciar, finalizar, desfazer, remover, encerrar abertos                                 | 90, 130, 140              |
| `fogo.ts`         | Lote e atendimento individual                                                           | 160                       |
| `repositories.ts` | Contrato App ↔ Dados                                                                    | todas                     |

O mesmo modelo está em `supabase/migrations` (Postgres) e `src/data/datasources/local/schema.ts` (SQLite). Mudou aqui, muda nos três.

## Regra de rastreabilidade

Entidade, campo, estado ou erro que não aponta para uma história é invenção e não entra. Todo tipo novo leva o número da história de origem no comentário. Estender o modelo é coisa da `spec-card`, que também acrescenta na seção Modelagem do Notion.

## Padrões

- Funções puras: recebem o estado, devolvem o novo estado ou lançam `DomainError`.
- Um teste por invariante e por transição em `__tests__/`; fábricas de teste em `__fixtures__/`.
- Nomes no vocabulário do terreiro (`gira`, `medium`, `consulente`, `entidade`, `fila`, `lote`).
