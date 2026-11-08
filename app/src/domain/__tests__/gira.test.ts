import {
  ativarGira,
  cancelarGira,
  exigirGiraAtiva,
  finalizarGira,
  podeTransicionar,
  temPendencias,
} from '../gira';
import { erroDe, gira } from '../__fixtures__/helpers';

describe('máquina de estados da gira', () => {
  it('agendada → ativa (90)', () => {
    expect(ativarGira(gira(), [gira()]).status).toBe('ativa');
  });

  it('só uma gira ativa por vez, inclusive ativa fantasma (90)', () => {
    const fantasma = gira({ id: 'g0', status: 'ativa' });
    expect(erroDe(() => ativarGira(gira(), [fantasma, gira()]))).toBe('JA_EXISTE_GIRA_ATIVA');
  });

  it('finalizar ou cancelar a ativa libera ativar outra (90, 170)', () => {
    const fechada = cancelarGira(gira({ id: 'g0', status: 'ativa' }));
    expect(ativarGira(gira(), [fechada, gira()]).status).toBe('ativa');
  });

  it('ativa → finalizada (90)', () => {
    expect(finalizarGira(gira({ status: 'ativa' })).status).toBe('finalizada');
  });

  it('não finaliza gira que não está ativa', () => {
    expect(erroDe(() => finalizarGira(gira()))).toBe('TRANSICAO_GIRA_INVALIDA');
  });

  it('cancela agendada e ativa (170)', () => {
    expect(cancelarGira(gira()).status).toBe('cancelada');
    expect(cancelarGira(gira({ status: 'ativa' })).status).toBe('cancelada');
  });

  it('cancelada não volta a ser ativada (170)', () => {
    const cancelada = gira({ status: 'cancelada' });
    expect(erroDe(() => ativarGira(cancelada, [cancelada]))).toBe('TRANSICAO_GIRA_INVALIDA');
  });

  it('finalizada e cancelada são estados finais', () => {
    for (const para of ['agendada', 'ativa', 'finalizada', 'cancelada'] as const) {
      expect(podeTransicionar('finalizada', para)).toBe(false);
      expect(podeTransicionar('cancelada', para)).toBe(false);
    }
  });

  it('operação da gira exige gira ativa (100–180)', () => {
    expect(erroDe(() => exigirGiraAtiva(null))).toBe('NENHUMA_GIRA_ATIVA');
    expect(erroDe(() => exigirGiraAtiva(gira()))).toBe('NENHUMA_GIRA_ATIVA');
    expect(exigirGiraAtiva(gira({ status: 'ativa' })).id).toBe('g1');
  });

  it('finalizar com fila ou atendimento aberto pede confirmação (90)', () => {
    expect(temPendencias({ naFila: 0, emAtendimento: 0 })).toBe(false);
    expect(temPendencias({ naFila: 2, emAtendimento: 0 })).toBe(true);
    expect(temPendencias({ naFila: 0, emAtendimento: 1 })).toBe(true);
  });
});
