import { entradasAtivas } from './fila';
import type { EntradaFila, Id, PresencaConsulente } from './types';

/**
 * Presença é um registro por pessoa por gira, com estado alternável (100, 110).
 * Ausência de registro equivale a ausente.
 */

/** Entrar numa fila marca o consulente presente na gira (130). */
export function presencaAoEntrarNaFila(
  existente: PresencaConsulente | undefined,
  novo: { id: Id; terreiroId: Id; giraId: Id; consulenteId: Id },
): PresencaConsulente {
  return existente ? { ...existente, presente: true } : { ...novo, presente: true };
}

/**
 * Não atribuídos (120, 130): consulentes presentes na gira que não estão aguardando nem
 * em atendimento em fila nenhuma. Inclui quem voltou de uma consulta finalizada.
 */
export function naoAtribuidos(
  presencas: readonly PresencaConsulente[],
  entradasDaGira: readonly EntradaFila[],
): Id[] {
  const emFila = new Set(entradasAtivas(entradasDaGira).map((e) => e.consulenteId));
  return presencas
    .filter((p) => p.presente && !emFila.has(p.consulenteId))
    .map((p) => p.consulenteId);
}
