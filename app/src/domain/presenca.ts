import type { Id, PresencaConsulente } from './types';

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
