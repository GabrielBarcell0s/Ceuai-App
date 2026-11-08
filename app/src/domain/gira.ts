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

/**
 * Finaliza a gira ativa (90). Com pendências (pendenciasDasConsultas, em consulta.ts),
 * a tela pede confirmação mostrando cada entidade com atendimento em andamento e o
 * tamanho da fila; confirmando, a camada de Dados encerra o que estava aberto (encerrarAbertos).
 */
export function finalizarGira(gira: Gira): Gira {
  return transicionar(gira, 'finalizada');
}

/**
 * Cancela gira agendada ou ativa; registros permanecem no histórico (170).
 * Gira ativa com pendências: mesma confirmação e mesmo encerramento de finalizar.
 */
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
