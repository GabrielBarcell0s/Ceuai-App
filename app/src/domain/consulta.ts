import { falha } from './errors';
import { entradasAtivas } from './fila';
import { exigirGiraAtiva } from './gira';
import type {
  Atendimento,
  Consulta,
  EntradaFila,
  Entidade,
  Gira,
  Id,
  Iso,
  PresencaMedium,
} from './types';

/** Consultas existem só na gira normal ativa (120). */
export function exigirGiraNormalAtiva(gira: Gira | null | undefined): Gira {
  const g = exigirGiraAtiva(gira);
  if (g.tipo !== 'normal') falha('TIPO_DE_GIRA_INCORRETO');
  return g;
}

function emConsulta(consultas: readonly Consulta[]): Set<Id> {
  return new Set(consultas.filter((c) => c.emConsulta).map((c) => c.entidadeId));
}

/**
 * Pares disponíveis para colocar em consulta (120): entidade de médium presente
 * que não está em consulta agora. Entidade finalizada volta a aparecer.
 */
export function entidadesDisponiveis(
  entidades: readonly Entidade[],
  presencas: readonly PresencaMedium[],
  consultas: readonly Consulta[],
): Entidade[] {
  const presentes = new Set(presencas.filter((p) => p.presente).map((p) => p.mediumId));
  const ocupadas = emConsulta(consultas);
  return entidades.filter((e) => presentes.has(e.mediumId) && !ocupadas.has(e.id));
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
  if (emConsulta(consultas).has(entidade.id)) falha('ENTIDADE_JA_EM_CONSULTA');
}

/**
 * Coloca em consulta (120). Um registro por entidade por gira: se a entidade já
 * esteve em consulta nesta gira, o mesmo registro liga de novo, com a fila vazia
 * (quem aguardava foi devolvido ao finalizar).
 */
export function colocarEmConsulta(
  existente: Consulta | undefined,
  novo: { id: Id; terreiroId: Id; giraId: Id; entidadeId: Id },
): Consulta {
  return existente ? { ...existente, emConsulta: true } : { ...novo, emConsulta: true };
}

/** Fila só recebe e atende em consulta ativa (130, 140). */
export function exigirConsultaAtiva(consulta: Consulta): void {
  if (!consulta.emConsulta) falha('CONSULTA_NAO_ATIVA');
}

/**
 * O que a confirmação mostra antes de finalizar uma consulta, marcar o médium ausente,
 * finalizar ou cancelar a gira (90, 100, 120, 170): a entidade, se tem atendimento em
 * andamento e quantas pessoas estão aguardando na fila.
 */
export interface PendenciaConsulta {
  consultaId: Id;
  entidadeId: Id;
  emAtendimento: boolean;
  naFila: number;
}

export function pendenciaDaConsulta(
  consulta: Consulta,
  entradas: readonly EntradaFila[],
): PendenciaConsulta {
  const daFila = entradas.filter((e) => e.consultaId === consulta.id);
  return {
    consultaId: consulta.id,
    entidadeId: consulta.entidadeId,
    emAtendimento: daFila.some((e) => e.status === 'em_atendimento'),
    naFila: daFila.filter((e) => e.status === 'aguardando').length,
  };
}

/** Pendências das consultas ligadas; só entram as que têm algo aberto. */
export function pendenciasDasConsultas(
  consultas: readonly Consulta[],
  entradas: readonly EntradaFila[],
): PendenciaConsulta[] {
  return consultas
    .filter((c) => c.emConsulta)
    .map((c) => pendenciaDaConsulta(c, entradas))
    .filter((p) => p.emAtendimento || p.naFila > 0);
}

/**
 * "Finalizar consulta" (120). Desliga a flag; o atendimento em andamento é finalizado
 * com o horário de agora e quem aguardava volta para não atribuídos (presente na gira,
 * sem fila), porque nem todo presente se consulta toda vez.
 * Devolve só os registros alterados, para a camada de Dados gravar.
 */
export function finalizarConsulta(
  consulta: Consulta,
  entradas: readonly EntradaFila[],
  atendimentos: readonly Atendimento[],
  agora: Iso,
): { consulta: Consulta; entradas: EntradaFila[]; atendimentos: Atendimento[] } {
  exigirConsultaAtiva(consulta);
  const abertas = entradasAtivas(entradas.filter((e) => e.consultaId === consulta.id));
  const idsEmAtendimento = new Set(
    abertas.filter((e) => e.status === 'em_atendimento').map((e) => e.id),
  );
  return {
    consulta: { ...consulta, emConsulta: false },
    entradas: abertas.map((e) => ({
      ...e,
      status: e.status === 'em_atendimento' ? 'atendido' : 'devolvido',
    })),
    atendimentos: atendimentos
      .filter((a) => a.fim === null && a.entradaFilaId && idsEmAtendimento.has(a.entradaFilaId))
      .map((a) => ({ ...a, fim: agora })),
  };
}

/** Médium marcado ausente: as consultas ligadas das entidades dele são finalizadas (100, 120). */
export function consultasDoMedium(
  mediumId: Id,
  entidades: readonly Entidade[],
  consultas: readonly Consulta[],
): Consulta[] {
  const dele = new Set(entidades.filter((e) => e.mediumId === mediumId).map((e) => e.id));
  return consultas.filter((c) => c.emConsulta && dele.has(c.entidadeId));
}
