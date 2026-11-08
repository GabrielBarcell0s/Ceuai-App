/**
 * Erros nomeados do domínio. Todo caso de borda registrado nas histórias tem um código aqui;
 * a camada App traduz o código em mensagem de tela.
 */
export type DomainErrorCode =
  | 'SEM_PERMISSAO' // papel não pode executar a ação (histórias 10, 40 e todas de operação)
  | 'NOME_OBRIGATORIO' // médium, consulente, entidade e opção de lista (50, 60, 65, 70)
  | 'EMAIL_INVALIDO' // conta de usuário (5, 10)
  | 'EMAIL_JA_CADASTRADO' // 10
  | 'CONTA_MANAGER_JA_EXISTE' // primeiro acesso só sem contas (5)
  | 'TIPO_GIRA_OBRIGATORIO' // 80
  | 'JA_EXISTE_GIRA_ATIVA' // 90
  | 'TRANSICAO_GIRA_INVALIDA' // 90, 170 (ex.: reativar cancelada)
  | 'NENHUMA_GIRA_ATIVA' // 40, 100, 110, 120, 130, 160, 180
  | 'TIPO_DE_GIRA_INCORRETO' // consultas só em gira normal; lote só em trabalho de fogo (120, 160)
  | 'MEDIUM_AUSENTE' // entidade só entra em consulta com médium presente (120)
  | 'ENTIDADE_JA_EM_CONSULTA' // 120
  | 'CONSULTA_NAO_ATIVA' // fila só recebe e atende em consulta ativa (130, 140)
  | 'CONSULENTE_JA_NA_FILA' // uma entrada por consulente por fila (130)
  | 'ATENDIMENTO_EM_ANDAMENTO' // um atendimento por vez na fila (140, protótipo)
  | 'MOVIMENTO_INVALIDO' // subir no topo, descer no fim (150)
  | 'CONSULENTE_AUSENTE' // lote do fogo só com presentes (160)
  | 'LOTE_JA_ABERTO' // um lote por vez (160, protótipo)
  | 'SELECAO_VAZIA' // iniciar lote sem selecionados (160)
  | 'ESTADO_INVALIDO' // operação sobre registro no estado errado
  | 'SEM_CONEXAO' // primeiro acesso, contas, primeiro login e redefinir senha exigem internet (5, 10, 20, 30)
  | 'CREDENCIAIS_INVALIDAS'; // login com e-mail ou senha errados (20)

export class DomainError extends Error {
  constructor(
    readonly code: DomainErrorCode,
    message?: string,
  ) {
    super(message ?? code);
    this.name = 'DomainError';
  }
}

export function falha(code: DomainErrorCode, message?: string): never {
  throw new DomainError(code, message);
}
