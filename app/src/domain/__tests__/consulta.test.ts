import {
  colocarEmConsulta,
  consultasDoMedium,
  entidadesDisponiveis,
  exigirConsultaAtiva,
  exigirGiraNormalAtiva,
  exigirPodeEntrarEmConsulta,
  finalizarConsulta,
  pendenciasDasConsultas,
  rotuloDoPar,
} from '../consulta';
import { finalizarAtendimento } from '../atendimento';
import type { Atendimento } from '../types';
import {
  T,
  consulta,
  entidade,
  entrada,
  erroDe,
  gira,
  presencaMedium,
} from '../__fixtures__/helpers';

const AGORA = '2026-11-08T22:00:00.000Z';

function atendimentoAberto(entradaFilaId: string): Atendimento {
  return {
    id: `at-${entradaFilaId}`,
    terreiroId: T,
    giraId: 'g1',
    consulenteId: `c-${entradaFilaId}`,
    entidadeId: 'e1',
    entradaFilaId,
    loteId: null,
    inicio: '2026-11-08T21:30:00.000Z',
    fim: null,
  };
}

describe('consultas', () => {
  it('só na gira normal ativa (120)', () => {
    expect(erroDe(() => exigirGiraNormalAtiva(gira({ status: 'ativa', tipo: 'fogo' })))).toBe(
      'TIPO_DE_GIRA_INCORRETO',
    );
    expect(erroDe(() => exigirGiraNormalAtiva(gira()))).toBe('NENHUMA_GIRA_ATIVA');
  });

  it('lista "entidade - primeiro nome do médium" (120)', () => {
    expect(rotuloDoPar('Vovó Maria', 'Leda Moraes')).toBe('Vovó Maria - Leda');
  });

  it('só entram entidades de médium presente (120)', () => {
    const e = entidade({ id: 'e1', mediumId: 'm1' });
    expect(erroDe(() => exigirPodeEntrarEmConsulta(e, [presencaMedium('m1', false)], []))).toBe(
      'MEDIUM_AUSENTE',
    );
    expect(() => exigirPodeEntrarEmConsulta(e, [presencaMedium('m1')], [])).not.toThrow();
  });

  it('entidade já em consulta não entra de novo nem aparece na lista (120)', () => {
    const e = entidade({ id: 'e1' });
    const outra = entidade({ id: 'e2', nome: 'Cabocla Jurema' });
    const q = [consulta({ entidadeId: 'e1' })];
    expect(erroDe(() => exigirPodeEntrarEmConsulta(e, [presencaMedium('m1')], q))).toBe(
      'ENTIDADE_JA_EM_CONSULTA',
    );
    expect(entidadesDisponiveis([e, outra], [presencaMedium('m1')], q).map((x) => x.id)).toEqual([
      'e2',
    ]);
  });

  it('entidade de médium ausente não aparece na lista (120)', () => {
    const e = entidade({ id: 'e1', mediumId: 'm2' });
    expect(entidadesDisponiveis([e], [presencaMedium('m1')], [])).toEqual([]);
  });

  it('entidade finalizada volta para a lista e liga o mesmo registro de novo (120)', () => {
    const e = entidade({ id: 'e1' });
    const finalizada = consulta({ emConsulta: false });
    expect(entidadesDisponiveis([e], [presencaMedium('m1')], [finalizada])).toHaveLength(1);
    expect(() => exigirPodeEntrarEmConsulta(e, [presencaMedium('m1')], [finalizada])).not.toThrow();
    const religada = colocarEmConsulta(finalizada, {
      id: 'outro',
      terreiroId: T,
      giraId: 'g1',
      entidadeId: 'e1',
    });
    expect(religada).toEqual({ ...finalizada, emConsulta: true });
  });

  it('primeira vez na gira cria a consulta ligada (120)', () => {
    const nova = colocarEmConsulta(undefined, {
      id: 'q9',
      terreiroId: T,
      giraId: 'g1',
      entidadeId: 'e1',
    });
    expect(nova.emConsulta).toBe(true);
  });

  it('fila zerada não tira a entidade de consulta (140)', () => {
    const e = entrada({ id: 'a', status: 'em_atendimento' });
    finalizarAtendimento(e, atendimentoAberto('a'), AGORA);
    expect(() => exigirConsultaAtiva(consulta())).not.toThrow();
  });

  it('finalizar devolve quem aguardava para não atribuídos (120)', () => {
    const r = finalizarConsulta(
      consulta(),
      [
        entrada({ id: 'a', posicao: 1000 }),
        entrada({ id: 'b', posicao: 2000 }),
        entrada({ id: 'c', status: 'atendido' }),
      ],
      [],
      AGORA,
    );
    expect(r.consulta.emConsulta).toBe(false);
    expect(r.entradas.map((e) => [e.id, e.status])).toEqual([
      ['a', 'devolvido'],
      ['b', 'devolvido'],
    ]);
  });

  it('finalizar encerra o atendimento em andamento com o horário de agora (120)', () => {
    const r = finalizarConsulta(
      consulta(),
      [entrada({ id: 'a', status: 'em_atendimento' })],
      [atendimentoAberto('a'), { ...atendimentoAberto('x'), entradaFilaId: 'x' }],
      AGORA,
    );
    expect(r.entradas[0]?.status).toBe('atendido');
    expect(r.atendimentos).toEqual([{ ...atendimentoAberto('a'), fim: AGORA }]);
  });

  it('não finaliza consulta já finalizada (120)', () => {
    expect(erroDe(() => finalizarConsulta(consulta({ emConsulta: false }), [], [], AGORA))).toBe(
      'CONSULTA_NAO_ATIVA',
    );
  });

  it('fila não recebe em consulta finalizada (130)', () => {
    expect(erroDe(() => exigirConsultaAtiva(consulta({ emConsulta: false })))).toBe(
      'CONSULTA_NAO_ATIVA',
    );
  });

  it('confirmação mostra entidade, atendimento em andamento e tamanho da fila (90, 100, 120, 170)', () => {
    const q1 = consulta({ id: 'q1', entidadeId: 'e1' });
    const q2 = consulta({ id: 'q2', entidadeId: 'e2' });
    const q3 = consulta({ id: 'q3', entidadeId: 'e3' });
    const entradas = [
      entrada({ id: 'a', consultaId: 'q1', status: 'em_atendimento' }),
      entrada({ id: 'b', consultaId: 'q1' }),
      entrada({ id: 'c', consultaId: 'q2' }),
      entrada({ id: 'd', consultaId: 'q2' }),
      entrada({ id: 'e', consultaId: 'q3', status: 'atendido' }),
    ];
    expect(pendenciasDasConsultas([q1, q2, q3], entradas)).toEqual([
      { consultaId: 'q1', entidadeId: 'e1', emAtendimento: true, naFila: 1 },
      { consultaId: 'q2', entidadeId: 'e2', emAtendimento: false, naFila: 2 },
    ]);
  });

  it('médium ausente: finaliza só as consultas ligadas das entidades dele (100)', () => {
    const entidades = [
      entidade({ id: 'e1', mediumId: 'm1' }),
      entidade({ id: 'e2', mediumId: 'm1' }),
      entidade({ id: 'e3', mediumId: 'm2' }),
    ];
    const consultas = [
      consulta({ id: 'q1', entidadeId: 'e1' }),
      consulta({ id: 'q2', entidadeId: 'e2', emConsulta: false }),
      consulta({ id: 'q3', entidadeId: 'e3' }),
    ];
    expect(consultasDoMedium('m1', entidades, consultas).map((c) => c.id)).toEqual(['q1']);
  });
});
