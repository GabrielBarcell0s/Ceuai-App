import { falha } from './errors';
import type { Atendimento, EntradaFila, Iso } from './types';

/** Um atendimento por vez em cada fila (140, protótipo). */
export function exigirSemAtendimentoEmAndamento(entradas: readonly EntradaFila[]): void {
  if (entradas.some((e) => e.status === 'em_atendimento')) falha('ATENDIMENTO_EM_ANDAMENTO');
}

/** Tocar no nome inicia: entrada passa a em_atendimento e o início é gravado (140). */
export function iniciarAtendimento(
  entrada: EntradaFila,
  entradasDaFila: readonly EntradaFila[],
  dados: { id: string; giraId: string; entidadeId: string; inicio: Iso },
): { entrada: EntradaFila; atendimento: Atendimento } {
  if (entrada.status !== 'aguardando') falha('ESTADO_INVALIDO', 'entrada não está aguardando');
  exigirSemAtendimentoEmAndamento(entradasDaFila);
  return {
    entrada: { ...entrada, status: 'em_atendimento' },
    atendimento: {
      id: dados.id,
      terreiroId: entrada.terreiroId,
      giraId: dados.giraId,
      consulenteId: entrada.consulenteId,
      entidadeId: dados.entidadeId,
      entradaFilaId: entrada.id,
      loteId: null,
      inicio: dados.inicio,
      fim: null,
    },
  };
}

/** Tocar de novo finaliza: grava o fim (140). */
export function finalizarAtendimento(
  entrada: EntradaFila,
  atendimento: Atendimento,
  fim: Iso,
): { entrada: EntradaFila; atendimento: Atendimento } {
  if (entrada.status !== 'em_atendimento' || atendimento.fim !== null) {
    falha('ESTADO_INVALIDO', 'atendimento não está em andamento');
  }
  if (fim < atendimento.inicio) falha('ESTADO_INVALIDO', 'fim antes do início');
  return { entrada: { ...entrada, status: 'atendido' }, atendimento: { ...atendimento, fim } };
}

/**
 * Desfazer (140): remove o registro de atendimento e o consulente volta à posição
 * que tinha na fila. Vale para atendimento em andamento ou já finalizado (protótipo).
 * Quem chama apaga o atendimento e grava a entrada devolvida.
 */
export function desfazerAtendimento(entrada: EntradaFila): EntradaFila {
  if (entrada.status !== 'em_atendimento' && entrada.status !== 'atendido') {
    falha('ESTADO_INVALIDO', 'não há atendimento para desfazer');
  }
  return { ...entrada, status: 'aguardando' };
}

/** Remover da fila (desistiu, foi embora): não desfaz a presença (130). */
export function removerDaFila(entrada: EntradaFila): EntradaFila {
  if (entrada.status !== 'aguardando') falha('ESTADO_INVALIDO', 'só sai da fila quem aguarda');
  return { ...entrada, status: 'removido' };
}

/**
 * Ao finalizar ou cancelar a gira com pendências, o que estava aberto é encerrado (90, 170):
 * atendimento em andamento ganha fim, quem aguardava fica encerrado.
 */
export function encerrarAbertos(
  entradas: readonly EntradaFila[],
  atendimentos: readonly Atendimento[],
  agora: Iso,
): { entradas: EntradaFila[]; atendimentos: Atendimento[] } {
  return {
    entradas: entradas
      .filter((e) => e.status === 'aguardando' || e.status === 'em_atendimento')
      .map((e) => ({ ...e, status: e.status === 'em_atendimento' ? 'atendido' : 'encerrado' })),
    atendimentos: atendimentos.filter((a) => a.fim === null).map((a) => ({ ...a, fim: agora })),
  };
}
