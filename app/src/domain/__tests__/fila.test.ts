import {
  exigirConsulenteForaDaFila,
  novaPosicao,
  numeroNaFila,
  posicaoNoFim,
  renumerar,
} from '../fila';
import type { EntradaFila } from '../types';
import { entrada, erroDe } from '../__fixtures__/helpers';

const fila = (): EntradaFila[] => [
  entrada({ id: 'a', posicao: 1000 }),
  entrada({ id: 'b', posicao: 2000 }),
  entrada({ id: 'c', posicao: 3000 }),
];

function ordem(entradas: EntradaFila[], id: string, posicao: number) {
  return entradas
    .map((e) => (e.id === id ? { ...e, posicao } : e))
    .sort((x, y) => x.posicao - y.posicao)
    .map((e) => e.id);
}

describe('fila', () => {
  it('ordem de chegada: nova entrada vai para o fim, com posição espaçada (130)', () => {
    expect(posicaoNoFim([])).toBe(1000);
    expect(posicaoNoFim(fila())).toBe(4000);
  });

  it('uma entrada por consulente por fila (130)', () => {
    expect(erroDe(() => exigirConsulenteForaDaFila(fila(), 'c-a'))).toBe('CONSULENTE_JA_NA_FILA');
  });

  it('consulente atendido pode entrar de novo (130)', () => {
    const atendida = [entrada({ id: 'a', status: 'atendido' })];
    expect(() => exigirConsulenteForaDaFila(atendida, 'c-a')).not.toThrow();
  });

  it('a tela numera 1, 2, 3 pela ordem, não pela posição interna', () => {
    const f = [entrada({ id: 'x', posicao: 1500 }), entrada({ id: 'y', posicao: 500 })];
    expect(numeroNaFila(f, 'y')).toBe(1);
    expect(numeroNaFila(f, 'x')).toBe(2);
  });

  it('subir troca com o anterior sem reescrever a fila (150)', () => {
    const f = fila();
    const p = novaPosicao(f, 'c', 'subir');
    expect(p).not.toBeNull();
    expect(ordem(f, 'c', p!)).toEqual(['a', 'c', 'b']);
  });

  it('descer troca com o próximo (150)', () => {
    const f = fila();
    expect(ordem(f, 'a', novaPosicao(f, 'a', 'descer')!)).toEqual(['b', 'a', 'c']);
  });

  it('ao topo leva para a primeira posição em um toque (150)', () => {
    const f = fila();
    expect(ordem(f, 'c', novaPosicao(f, 'c', 'topo')!)).toEqual(['c', 'a', 'b']);
  });

  it('subir e ao topo bloqueados no primeiro; descer bloqueado no último (150)', () => {
    expect(erroDe(() => novaPosicao(fila(), 'a', 'subir'))).toBe('MOVIMENTO_INVALIDO');
    expect(erroDe(() => novaPosicao(fila(), 'a', 'topo'))).toBe('MOVIMENTO_INVALIDO');
    expect(erroDe(() => novaPosicao(fila(), 'c', 'descer'))).toBe('MOVIMENTO_INVALIDO');
  });

  it('sem espaço entre vizinhos pede renumeração, mantendo a ordem', () => {
    const f = [
      entrada({ id: 'a', posicao: 1 }),
      entrada({ id: 'b', posicao: 2 }),
      entrada({ id: 'c', posicao: 3 }),
    ];
    expect(novaPosicao(f, 'c', 'subir')).toBeNull();
    expect([...renumerar(f).entries()]).toEqual([
      ['a', 1000],
      ['b', 2000],
      ['c', 3000],
    ]);
  });
});
