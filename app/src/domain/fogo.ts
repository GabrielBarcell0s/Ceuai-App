import { falha } from './errors';
import { exigirGiraAtiva } from './gira';
import type { Atendimento, Gira, Iso, Lote, PresencaConsulente } from './types';

/** Atendimento em lote só no trabalho de fogo ativo (160). */
export function exigirGiraDeFogoAtiva(gira: Gira | null | undefined): Gira {
  const g = exigirGiraAtiva(gira);
  if (g.tipo !== 'fogo') falha('TIPO_DE_GIRA_INCORRETO');
  return g;
}

function exigirPresentes(
  consulenteIds: readonly string[],
  presencas: readonly PresencaConsulente[],
) {
  const presentes = new Set(presencas.filter((p) => p.presente).map((p) => p.consulenteId));
  if (consulenteIds.some((id) => !presentes.has(id))) falha('CONSULENTE_AUSENTE');
}

/**
 * "Iniciar lote" grava o início para todos os selecionados (160).
 * Só presentes; um lote aberto por vez (protótipo).
 */
export function iniciarLote(
  dados: {
    id: string;
    terreiroId: string;
    giraId: string;
    inicio: Iso;
    consulenteIds: readonly string[];
    idsAtendimento: readonly string[];
  },
  presencas: readonly PresencaConsulente[],
  lotes: readonly Lote[],
): { lote: Lote; atendimentos: Atendimento[] } {
  if (dados.consulenteIds.length === 0) falha('SELECAO_VAZIA');
  if (lotes.some((l) => l.giraId === dados.giraId && l.fim === null)) falha('LOTE_JA_ABERTO');
  exigirPresentes(dados.consulenteIds, presencas);
  const lote: Lote = {
    id: dados.id,
    terreiroId: dados.terreiroId,
    giraId: dados.giraId,
    inicio: dados.inicio,
    fim: null,
  };
  const atendimentos = dados.consulenteIds.map((consulenteId, i) => ({
    id: dados.idsAtendimento[i],
    terreiroId: dados.terreiroId,
    giraId: dados.giraId,
    consulenteId,
    entidadeId: null,
    entradaFilaId: null,
    loteId: lote.id,
    inicio: dados.inicio,
    fim: null,
  }));
  return { lote, atendimentos };
}

/** "Finalizar lote" grava o mesmo fim para todos do lote (160). */
export function finalizarLote(
  lote: Lote,
  atendimentosDoLote: readonly Atendimento[],
  fim: Iso,
): { lote: Lote; atendimentos: Atendimento[] } {
  if (lote.fim !== null) falha('ESTADO_INVALIDO', 'lote já finalizado');
  if (fim < lote.inicio) falha('ESTADO_INVALIDO', 'fim antes do início');
  return {
    lote: { ...lote, fim },
    atendimentos: atendimentosDoLote.map((a) => ({ ...a, inicio: lote.inicio, fim })),
  };
}

/** "Atender só este": atendimento individual registrado na hora (160, protótipo). */
export function atendimentoIndividual(
  dados: { id: string; terreiroId: string; giraId: string; consulenteId: string; momento: Iso },
  presencas: readonly PresencaConsulente[],
): Atendimento {
  exigirPresentes([dados.consulenteId], presencas);
  return {
    id: dados.id,
    terreiroId: dados.terreiroId,
    giraId: dados.giraId,
    consulenteId: dados.consulenteId,
    entidadeId: null,
    entradaFilaId: null,
    loteId: null,
    inicio: dados.momento,
    fim: dados.momento,
  };
}
