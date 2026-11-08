import {
  encerrarSeFilaZerou,
  entidadesDisponiveis,
  exigirGiraNormalAtiva,
  exigirPodeEntrarEmConsulta,
  rotuloDoPar,
  tirarDeConsulta,
} from '../consulta';
import { consulta, entidade, entrada, erroDe, gira, presencaMedium } from '../__fixtures__/helpers';

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

  it('tirar de consulta com fila congela; sem fila encerra (120)', () => {
    expect(tirarDeConsulta(consulta(), [entrada({ id: 'a' })]).status).toBe('congelada');
    expect(tirarDeConsulta(consulta(), [entrada({ id: 'a', status: 'atendido' })]).status).toBe(
      'encerrada',
    );
  });

  it('fila zerada encerra a consulta (140)', () => {
    expect(encerrarSeFilaZerou(consulta(), [entrada({ id: 'a', status: 'atendido' })]).status).toBe(
      'encerrada',
    );
    expect(encerrarSeFilaZerou(consulta(), [entrada({ id: 'a' })]).status).toBe('em_consulta');
  });

  it('fila congelada redistribuída por inteiro encerra (120)', () => {
    const congelada = consulta({ status: 'congelada' });
    expect(encerrarSeFilaZerou(congelada, [entrada({ id: 'a', status: 'removido' })]).status).toBe(
      'encerrada',
    );
  });
});
