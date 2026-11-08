import type {
  Consulta,
  EntradaFila,
  Entidade,
  Gira,
  PresencaConsulente,
  PresencaMedium,
} from '../types';

export const T = 't1';

export function gira(p: Partial<Gira> = {}): Gira {
  return { id: 'g1', terreiroId: T, tipo: 'normal', dataHora: null, status: 'agendada', ...p };
}

export function entrada(p: Partial<EntradaFila> & { id: string }): EntradaFila {
  return {
    terreiroId: T,
    consultaId: 'q1',
    consulenteId: `c-${p.id}`,
    posicao: 1000,
    status: 'aguardando',
    chegadaEm: '2026-11-08T21:00:00.000Z',
    ...p,
  };
}

export function entidade(p: Partial<Entidade> & { id: string }): Entidade {
  return { terreiroId: T, nome: 'Caboclo Pena Verde', mediumId: 'm1', ...p };
}

export function presencaMedium(mediumId: string, presente = true): PresencaMedium {
  return { id: `pm-${mediumId}`, terreiroId: T, giraId: 'g1', mediumId, presente };
}

export function presencaConsulente(consulenteId: string, presente = true): PresencaConsulente {
  return { id: `pc-${consulenteId}`, terreiroId: T, giraId: 'g1', consulenteId, presente };
}

export function consulta(p: Partial<Consulta> = {}): Consulta {
  return { id: 'q1', terreiroId: T, giraId: 'g1', entidadeId: 'e1', status: 'em_consulta', ...p };
}

export function erroDe(fn: () => unknown): string | undefined {
  try {
    fn();
  } catch (e) {
    return (e as { code?: string }).code;
  }
  return undefined;
}
