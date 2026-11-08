import { falha } from './errors';
import type { Gira, StatusGira } from './types';

/**
 * Máquina de estados da gira:
 * agendada → ativa (90) → finalizada (90)
 * agendada | ativa → cancelada (170)
 * finalizada e cancelada são finais (170: cancelada não reativa).
 */
const TRANSICOES: Record<StatusGira, readonly StatusGira[]> = {
  agendada: ['ativa', 'cancelada'],
  ativa: ['finalizada', 'cancelada'],
  finalizada: [],
  cancelada: [],
};

export function podeTransicionar(de: StatusGira, para: StatusGira): boolean {
  return TRANSICOES[de].includes(para);
}

function transicionar(gira: Gira, para: StatusGira): Gira {
  if (!podeTransicionar(gira.status, para)) {
    falha('TRANSICAO_GIRA_INVALIDA', `${gira.status} → ${para}`);
  }
  return { ...gira, status: para };
}

/** Só uma gira ativa por vez, inclusive "ativa fantasma" esquecida (90). */
export function ativarGira(gira: Gira, girasDoTerreiro: readonly Gira[]): Gira {
  if (girasDoTerreiro.some((g) => g.status === 'ativa' && g.id !== gira.id)) {
    falha('JA_EXISTE_GIRA_ATIVA');
  }
  return transicionar(gira, 'ativa');
}

/** Pendências que pedem confirmação antes de finalizar (90, caso de borda). */
export interface PendenciasGira {
  naFila: number;
  emAtendimento: number;
}

export function temPendencias(p: PendenciasGira): boolean {
  return p.naFila > 0 || p.emAtendimento > 0;
}

/**
 * Finaliza a gira ativa (90). Com pendências, a tela pede confirmação antes;
 * confirmando, o que estava aberto é encerrado pela camada de Dados.
 */
export function finalizarGira(gira: Gira): Gira {
  return transicionar(gira, 'finalizada');
}

/** Cancela gira agendada ou ativa; registros permanecem no histórico (170). */
export function cancelarGira(gira: Gira): Gira {
  return transicionar(gira, 'cancelada');
}

/** Operação da gira (presença, consulta, fila, fogo) só com gira ativa (40, 100–180). */
export function exigirGiraAtiva(gira: Gira | null | undefined): Gira {
  if (!gira || gira.status !== 'ativa') falha('NENHUMA_GIRA_ATIVA');
  return gira;
}

export function giraAtiva(giras: readonly Gira[]): Gira | null {
  return giras.find((g) => g.status === 'ativa') ?? null;
}
