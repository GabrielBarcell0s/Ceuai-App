import {
  desfazerAtendimento,
  encerrarAbertos,
  finalizarAtendimento,
  iniciarAtendimento,
  removerDaFila,
} from '../atendimento';
import { entrada, erroDe } from '../__fixtures__/helpers';

const dados = { id: 'at1', giraId: 'g1', entidadeId: 'e1', inicio: '2026-11-08T21:00:00.000Z' };

describe('atendimento', () => {
  it('iniciar grava consulente, entidade e início (140)', () => {
    const e = entrada({ id: 'a' });
    const r = iniciarAtendimento(e, [e], dados);
    expect(r.entrada.status).toBe('em_atendimento');
    expect(r.atendimento).toMatchObject({
      consulenteId: 'c-a',
      entidadeId: 'e1',
      inicio: dados.inicio,
      fim: null,
      entradaFilaId: 'a',
    });
  });

  it('um atendimento por vez na fila (140)', () => {
    const atendendo = entrada({ id: 'a', status: 'em_atendimento' });
    const b = entrada({ id: 'b', posicao: 2000 });
    expect(erroDe(() => iniciarAtendimento(b, [atendendo, b], dados))).toBe(
      'ATENDIMENTO_EM_ANDAMENTO',
    );
  });

  it('finalizar grava o fim (140)', () => {
    const e = entrada({ id: 'a' });
    const r = iniciarAtendimento(e, [e], dados);
    const f = finalizarAtendimento(r.entrada, r.atendimento, '2026-11-08T21:10:00.000Z');
    expect(f.entrada.status).toBe('atendido');
    expect(f.atendimento.fim).toBe('2026-11-08T21:10:00.000Z');
  });

  it('não finaliza o que não começou, nem com fim antes do início', () => {
    const e = entrada({ id: 'a' });
    const r = iniciarAtendimento(e, [e], dados);
    expect(erroDe(() => finalizarAtendimento(e, r.atendimento, dados.inicio))).toBe(
      'ESTADO_INVALIDO',
    );
    expect(
      erroDe(() => finalizarAtendimento(r.entrada, r.atendimento, '2026-11-08T20:00:00.000Z')),
    ).toBe('ESTADO_INVALIDO');
  });

  it('desfazer devolve o consulente à mesma posição (140)', () => {
    const e = entrada({ id: 'a', posicao: 3000, status: 'em_atendimento' });
    expect(desfazerAtendimento(e)).toMatchObject({ status: 'aguardando', posicao: 3000 });
    expect(desfazerAtendimento({ ...e, status: 'atendido' }).status).toBe('aguardando');
    expect(erroDe(() => desfazerAtendimento(entrada({ id: 'b' })))).toBe('ESTADO_INVALIDO');
  });

  it('remover da fila só quem aguarda (130)', () => {
    expect(removerDaFila(entrada({ id: 'a' })).status).toBe('removido');
    expect(erroDe(() => removerDaFila(entrada({ id: 'a', status: 'em_atendimento' })))).toBe(
      'ESTADO_INVALIDO',
    );
  });

  it('finalizar a gira encerra o que estava aberto (90)', () => {
    const r = encerrarAbertos(
      [
        entrada({ id: 'a' }),
        entrada({ id: 'b', status: 'em_atendimento' }),
        entrada({ id: 'c', status: 'atendido' }),
      ],
      [
        {
          id: 'at',
          terreiroId: 't1',
          giraId: 'g1',
          consulenteId: 'c-b',
          entidadeId: 'e1',
          entradaFilaId: 'b',
          loteId: null,
          inicio: dados.inicio,
          fim: null,
        },
      ],
      '2026-11-08T23:00:00.000Z',
    );
    expect(r.entradas.map((e) => [e.id, e.status])).toEqual([
      ['a', 'encerrado'],
      ['b', 'atendido'],
    ]);
    expect(r.atendimentos[0].fim).toBe('2026-11-08T23:00:00.000Z');
  });
});
