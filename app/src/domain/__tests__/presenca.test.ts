import { naoAtribuidos, presencaAoEntrarNaFila } from '../presenca';
import { T, entrada, presencaConsulente } from '../__fixtures__/helpers';

describe('presença de consulentes', () => {
  it('entrar na fila marca presente (130)', () => {
    const novo = { id: 'p1', terreiroId: T, giraId: 'g1', consulenteId: 'c1' };
    expect(presencaAoEntrarNaFila(undefined, novo).presente).toBe(true);
    expect(presencaAoEntrarNaFila({ ...novo, presente: false }, novo).presente).toBe(true);
  });

  it('não atribuídos: presentes sem fila aberta, inclusive devolvidos (120, 130)', () => {
    const presencas = [
      presencaConsulente('c1'),
      presencaConsulente('c2'),
      presencaConsulente('c3'),
      presencaConsulente('c4', false),
    ];
    const entradas = [
      entrada({ id: '1', consulenteId: 'c1' }),
      entrada({ id: '2', consulenteId: 'c2', status: 'devolvido' }),
    ];
    expect(naoAtribuidos(presencas, entradas)).toEqual(['c2', 'c3']);
  });
});
