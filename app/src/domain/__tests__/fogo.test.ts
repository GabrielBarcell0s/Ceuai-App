import { atendimentoIndividual, exigirGiraDeFogoAtiva, finalizarLote, iniciarLote } from '../fogo';
import { erroDe, gira, presencaConsulente, T } from '../__fixtures__/helpers';

const base = { id: 'l1', terreiroId: T, giraId: 'g1', inicio: '2026-11-08T21:00:00.000Z' };
const presentes = [
  presencaConsulente('c1'),
  presencaConsulente('c2'),
  presencaConsulente('c3', false),
];

describe('trabalho de fogo', () => {
  it('lote só no trabalho de fogo ativo (160)', () => {
    expect(erroDe(() => exigirGiraDeFogoAtiva(gira({ status: 'ativa' })))).toBe(
      'TIPO_DE_GIRA_INCORRETO',
    );
    expect(exigirGiraDeFogoAtiva(gira({ status: 'ativa', tipo: 'fogo' })).id).toBe('g1');
  });

  it('iniciar lote grava o mesmo início para todos os selecionados (160)', () => {
    const r = iniciarLote(
      { ...base, consulenteIds: ['c1', 'c2'], idsAtendimento: ['a1', 'a2'] },
      presentes,
      [],
    );
    expect(r.atendimentos.map((a) => [a.consulenteId, a.inicio, a.loteId])).toEqual([
      ['c1', base.inicio, 'l1'],
      ['c2', base.inicio, 'l1'],
    ]);
  });

  it('só consulentes presentes entram no lote (160)', () => {
    expect(
      erroDe(() =>
        iniciarLote({ ...base, consulenteIds: ['c3'], idsAtendimento: ['a'] }, presentes, []),
      ),
    ).toBe('CONSULENTE_AUSENTE');
  });

  it('lote precisa de seleção e só um aberto por vez (160)', () => {
    expect(
      erroDe(() => iniciarLote({ ...base, consulenteIds: [], idsAtendimento: [] }, presentes, [])),
    ).toBe('SELECAO_VAZIA');
    const aberto = { ...base, id: 'l0', fim: null };
    expect(
      erroDe(() =>
        iniciarLote({ ...base, consulenteIds: ['c1'], idsAtendimento: ['a'] }, presentes, [aberto]),
      ),
    ).toBe('LOTE_JA_ABERTO');
  });

  it('finalizar lote grava o mesmo fim para todos (160)', () => {
    const r = iniciarLote(
      { ...base, consulenteIds: ['c1', 'c2'], idsAtendimento: ['a1', 'a2'] },
      presentes,
      [],
    );
    const f = finalizarLote(r.lote, r.atendimentos, '2026-11-08T21:20:00.000Z');
    expect(f.lote.fim).toBe('2026-11-08T21:20:00.000Z');
    expect(new Set(f.atendimentos.map((a) => a.fim))).toEqual(
      new Set(['2026-11-08T21:20:00.000Z']),
    );
    expect(erroDe(() => finalizarLote(f.lote, f.atendimentos, '2026-11-08T21:30:00.000Z'))).toBe(
      'ESTADO_INVALIDO',
    );
  });

  it('atendimento individual também é possível, só com presente (160)', () => {
    const a = atendimentoIndividual(
      { id: 'a', terreiroId: T, giraId: 'g1', consulenteId: 'c1', momento: base.inicio },
      presentes,
    );
    expect([a.inicio, a.fim, a.loteId]).toEqual([base.inicio, base.inicio, null]);
    expect(
      erroDe(() =>
        atendimentoIndividual(
          { id: 'a', terreiroId: T, giraId: 'g1', consulenteId: 'c3', momento: base.inicio },
          presentes,
        ),
      ),
    ).toBe('CONSULENTE_AUSENTE');
  });
});
