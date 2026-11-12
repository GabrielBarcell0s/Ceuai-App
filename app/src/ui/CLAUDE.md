# Camada UI (componentes e tokens)

**Faz:** os tokens e os componentes que mais de uma tela do protótipo usa, os estados comuns (vazio, erro, carregando, sem permissão, sem gira), o mapa de rotas por papel e o texto de cada erro nomeado.

**Não faz:** regra de negócio, acesso a rede ou banco, dado de negócio dentro de componente (tudo chega por props).

## Antes de criar componente

Consulte o inventário abaixo. Duplicar componente é o defeito mais comum a partir do terceiro card. Regra: componente que não aparece em nenhuma tela do protótipo é invenção; o que aparece numa tela só fica no arquivo da rota (ex.: `Atalho` em `(app)/index.tsx`), até a segunda tela pedir.

## Tokens (`tokens.ts`)

Nomeados pelo papel, nunca pela cor. Nada de cor ou medida solta numa tela.

- `cor`: `fundo`, `tela`, `superficie`, `superficiePressionada` (feedback de toque), `borda`, `texto`, `textoSecundario`, `acento`, `acentoBorda`, `textoSobreAcento`, `aviso`, `positivo`, `negativo`, `veu`
- `raio`: `pequeno` 8, `pill` 9, `controle` 12, `cartao` 16, `destaque` 20, `tela` 24 (decisão de identidade)
- `espaco`: `xxs` 4 a `xl` 24
- `toque`: `minimo` 44, `linha` 56, `campo` 52, `pill` 40
- `fonte` e `texto`: Bricolage Grotesque 700 (títulos, números de destaque) e Archivo 400/500/600/700, carregadas por `@expo-google-fonts` no `_layout` raiz, com a splash cobrindo a carga

## Componentes (`componentes/`)

| Componente                                                              | Resolve                                                                                   | Telas                                              |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `Tela`                                                                  | Casca: cabeçalho, contexto, conteúdo rolável, rodapé, sobreposição                        | todas                                              |
| `Cabecalho`, `Ondas`, `IconeVoltar`                                     | Título, subtítulo, voltar e a linha de ondas                                              | todas                                              |
| `BarraContexto`                                                         | "Gira em andamento" e "Sem conexão. Registrando no aparelho"                              | todas as logadas                                   |
| `Rodape`                                                                | Ações fixas ao pé                                                                         | quase todas                                        |
| `Grupo`, `Linha`, `Secao`                                               | Listas em cartão, linha tocável ou com ações em coluna, título de seção                   | cadastros, presenças, consultas, fila, fogo, giras |
| `Pill`                                                                  | Selo de estado ou botão compacto (tons neutro, positivo, negativo, acento, aviso)         | presenças, giras, consultas, fila, fogo, usuários  |
| `BotaoPrincipal` (cheio, contorno, perigo; enviando), `BotaoSecundario` | Ação principal e ação discreta sublinhada                                                 | todas                                              |
| `Campo`, `Selecao`                                                      | Texto com rótulo; escolha numa folha de opções                                            | login, contas, médium, entidade, consulente, gira  |
| `Folha`, `TextoFolha`, `Confirmacao`                                    | Formulário que sobe do pé; diálogo de confirmação (finalizar, cancelar, remover, ausente) | cadastros, giras, consultas, presença              |
| `Destaque`                                                              | Cartão azul do que está acontecendo agora, com tempo                                      | fila (atendimento), fogo (lote)                    |
| `Vazio`, `Aviso`, `Esqueleto`, `EstadoErro`                             | Vazio com convite, faixa de aviso ou erro, carregando, erro com tentar de novo            | todas                                              |
| `SemPermissao`, `SemGira`                                               | Área fora do papel; operação sem gira ativa                                               | logadas; painel, presenças, consultas, fila, fogo  |

## Infra de tela

- `rotas.ts`: `ROTAS` (href, título, ação que libera, histórias), `ATALHOS_INICIO`, `NOME_PAPEL`, `primeiroNome`. Navegação e atalhos derivam daqui e de `permissoes.ts`.
- `Restrita`: guarda de rota por ação. Nenhuma tela testa papel na mão; use `usePode(acao)` para botões.
- `TelaDaGira` (operação: mostra `SemGira` sem gira ativa) e `TelaDeCadastro` (gestão).
- `mensagens.ts`: `mensagemDeErro(erro)` traduz cada `DomainErrorCode`; erro inesperado vira mensagem genérica.

Testes de tela em `__tests__/`; sessão de teste com `comSessao(papel, <Tela />)` de `src/__fixtures__/sessao.tsx`.
