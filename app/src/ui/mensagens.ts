import { DomainError, type DomainErrorCode } from '@/domain';

/**
 * Texto de tela para cada erro nomeado do Domínio. A voz é a do protótipo:
 * diz o que houve e o que fazer, sem culpar quem usa. Nada de travessão (Lista de Proibições).
 */
export const MENSAGENS: Record<DomainErrorCode, string> = {
  SEM_PERMISSAO: 'Esta ação não faz parte do seu papel.',
  NOME_OBRIGATORIO: 'Preencha o nome para salvar.',
  EMAIL_INVALIDO: 'Confira o e-mail: ele parece incompleto.',
  EMAIL_JA_CADASTRADO: 'Já existe uma conta com este e-mail.',
  CONTA_MANAGER_JA_EXISTE: 'O terreiro já tem conta. Entre com seu e-mail e senha.',
  TIPO_GIRA_OBRIGATORIO: 'Escolha o tipo da gira.',
  JA_EXISTE_GIRA_ATIVA:
    'Já existe uma gira ativa. Finalize ou cancele a atual antes de ativar outra.',
  TRANSICAO_GIRA_INVALIDA: 'Esta gira não pode mudar para esse estado.',
  NENHUMA_GIRA_ATIVA: 'Nenhuma gira ativa no momento.',
  TIPO_DE_GIRA_INCORRETO: 'Isto não vale para o tipo da gira ativa.',
  MEDIUM_AUSENTE: 'O médium desta entidade não está presente.',
  ENTIDADE_JA_EM_CONSULTA: 'Esta entidade já está em consulta.',
  CONSULTA_NAO_ATIVA: 'Esta entidade não está em consulta.',
  CONSULENTE_JA_NA_FILA: 'Este consulente já está nesta fila.',
  ATENDIMENTO_EM_ANDAMENTO: 'Finalize o atendimento em andamento antes de iniciar outro.',
  MOVIMENTO_INVALIDO: 'Não dá para mover mais nessa direção.',
  CONSULENTE_AUSENTE: 'Só consulentes presentes entram no lote.',
  LOTE_JA_ABERTO: 'Já existe um lote em atendimento. Finalize antes de iniciar outro.',
  SELECAO_VAZIA: 'Selecione ao menos um consulente.',
  ESTADO_INVALIDO: 'Isso mudou enquanto você olhava. Confira a tela e tente de novo.',
  SEM_CONEXAO: 'Este passo exige internet. Conecte o aparelho e tente de novo.',
  CREDENCIAIS_INVALIDAS: 'E-mail ou senha incorretos. Confira e tente de novo.',
};

/** Erro inesperado: mensagem genérica na tela; o detalhe vai só para o log, sem dado pessoal. */
export const MENSAGEM_INESPERADA = 'Algo não saiu como esperado. Tente de novo.';

export function mensagemDeErro(erro: unknown): string {
  return erro instanceof DomainError ? MENSAGENS[erro.code] : MENSAGEM_INESPERADA;
}
