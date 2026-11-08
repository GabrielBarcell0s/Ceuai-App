import { falha } from './errors';
import type { EntradaFila } from './types';

/** Espaçamento da posição (Restrições do briefing): 1000, 2000, 3000... */
export const PASSO_POSICAO = 1000;

const ATIVAS = new Set(['aguardando', 'em_atendimento']);

/** Entradas que ainda contam como "na fila", em ordem. */
export function entradasAtivas(entradas: readonly EntradaFila[]): EntradaFila[] {
  return entradas.filter((e) => ATIVAS.has(e.status)).sort((a, b) => a.posicao - b.posicao);
}

/** Só quem espera, em ordem: é o que a tela numera como 1, 2, 3. */
export function aguardando(entradas: readonly EntradaFila[]): EntradaFila[] {
  return entradas.filter((e) => e.status === 'aguardando').sort((a, b) => a.posicao - b.posicao);
}

/** Número exibido na tela: 1, 2, 3 pela ordem atual; a posição espaçada é interna. */
export function numeroNaFila(entradas: readonly EntradaFila[], entradaId: string): number | null {
  const i = aguardando(entradas).findIndex((e) => e.id === entradaId);
  return i < 0 ? null : i + 1;
}

/** Uma entrada por consulente por fila; volta a entrar depois de atendido (130). */
export function exigirConsulenteForaDaFila(
  entradas: readonly EntradaFila[],
  consulenteId: string,
): void {
  if (entradasAtivas(entradas).some((e) => e.consulenteId === consulenteId)) {
    falha('CONSULENTE_JA_NA_FILA');
  }
}

/** Ordem de chegada por padrão: nova entrada vai para o fim (130). */
export function posicaoNoFim(entradas: readonly EntradaFila[]): number {
  const maior = entradas.reduce((m, e) => Math.max(m, e.posicao), 0);
  return Math.floor(maior / PASSO_POSICAO) * PASSO_POSICAO + PASSO_POSICAO;
}

export type Movimento = 'subir' | 'descer' | 'topo';

/**
 * Nova posição de uma entrada que aguarda, sem reescrever a fila (150).
 * Retorna null quando não há espaço entre vizinhos: aí use renumerar().
 */
export function novaPosicao(
  entradas: readonly EntradaFila[],
  entradaId: string,
  movimento: Movimento,
): number | null {
  const fila = aguardando(entradas);
  const i = fila.findIndex((e) => e.id === entradaId);
  if (i < 0) falha('ESTADO_INVALIDO', 'entrada não está aguardando');
  if ((movimento === 'subir' || movimento === 'topo') && i === 0) falha('MOVIMENTO_INVALIDO');
  if (movimento === 'descer' && i === fila.length - 1) falha('MOVIMENTO_INVALIDO');

  let antes: number;
  let depois: number;
  if (movimento === 'topo') {
    depois = fila[0].posicao;
    antes = depois - 2 * PASSO_POSICAO;
  } else if (movimento === 'subir') {
    depois = fila[i - 1].posicao;
    antes = i >= 2 ? fila[i - 2].posicao : depois - 2 * PASSO_POSICAO;
  } else {
    antes = fila[i + 1].posicao;
    depois = i + 2 < fila.length ? fila[i + 2].posicao : antes + 2 * PASSO_POSICAO;
  }
  const meio = Math.floor((antes + depois) / 2);
  return meio > antes && meio < depois ? meio : null;
}

/** Reespaça a fila mantendo a ordem (raro: só quando novaPosicao() não acha espaço). */
export function renumerar(entradas: readonly EntradaFila[]): Map<string, number> {
  const mapa = new Map<string, number>();
  entradasAtivas(entradas).forEach((e, i) => mapa.set(e.id, (i + 1) * PASSO_POSICAO));
  return mapa;
}
