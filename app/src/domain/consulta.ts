import { falha } from './errors';
import { entradasAtivas } from './fila';
import { exigirGiraAtiva } from './gira';
import type {
  Consulta,
  EntradaFila,
  Entidade,
  Gira,
  PresencaMedium,
  StatusConsulta,
} from './types';

/** Consultas existem só na gira normal ativa (120). */
export function exigirGiraNormalAtiva(gira: Gira | null | undefined): Gira {
  const g = exigirGiraAtiva(gira);
  if (g.tipo !== 'normal') falha('TIPO_DE_GIRA_INCORRETO');
  return g;
}

/**
 * Pares disponíveis para colocar em consulta (120): entidade de médium presente
 * que ainda não está em consulta nesta gira.
 */
export function entidadesDisponiveis(
  entidades: readonly Entidade[],
  presencas: readonly PresencaMedium[],
  consultas: readonly Consulta[],
): Entidade[] {
  const presentes = new Set(presencas.filter((p) => p.presente).map((p) => p.mediumId));
  const emConsulta = new Set(
    consultas.filter((c) => c.status === 'em_consulta').map((c) => c.entidadeId),
  );
  return entidades.filter((e) => presentes.has(e.mediumId) && !emConsulta.has(e.id));
}

/** Rótulo da lista de consultas: "entidade - primeiro nome do médium" (120). */
export function rotuloDoPar(nomeEntidade: string, nomeMedium: string): string {
  const primeiro = nomeMedium.trim().split(/\s+/)[0] ?? '';
  return `${nomeEntidade.trim()} - ${primeiro}`;
}

/** Valida colocar uma entidade em consulta (120). */
export function exigirPodeEntrarEmConsulta(
  entidade: Entidade,
  presencas: readonly PresencaMedium[],
  consultas: readonly Consulta[],
): void {
  const presente = presencas.some((p) => p.mediumId === entidade.mediumId && p.presente);
  if (!presente) falha('MEDIUM_AUSENTE');
  if (consultas.some((c) => c.entidadeId === entidade.id && c.status === 'em_consulta')) {
    falha('ENTIDADE_JA_EM_CONSULTA');
  }
}

/** Fila só recebe e atende em consulta ativa (130, 140). */
export function exigirConsultaAtiva(consulta: Consulta): void {
  if (consulta.status !== 'em_consulta') falha('CONSULTA_NAO_ATIVA');
}

/**
 * Tirar de consulta (120): com fila não zerada, a fila fica congelada
 * para redistribuição manual; sem fila, a consulta encerra.
 */
export function tirarDeConsulta(consulta: Consulta, entradas: readonly EntradaFila[]): Consulta {
  exigirConsultaAtiva(consulta);
  const status: StatusConsulta = entradasAtivas(entradas).length > 0 ? 'congelada' : 'encerrada';
  return { ...consulta, status };
}

/**
 * Depois de finalizar um atendimento ou redistribuir a fila congelada:
 * fila zerada encerra a consulta (140 e 120).
 */
export function encerrarSeFilaZerou(
  consulta: Consulta,
  entradas: readonly EntradaFila[],
): Consulta {
  if (consulta.status === 'encerrada') return consulta;
  return entradasAtivas(entradas).length === 0 ? { ...consulta, status: 'encerrada' } : consulta;
}
