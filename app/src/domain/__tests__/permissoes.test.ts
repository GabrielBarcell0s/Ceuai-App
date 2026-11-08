import { exigirPermissao, pode } from '../permissoes';
import { erroDe } from '../__fixtures__/helpers';

describe('permissões por papel', () => {
  it('manager tem acesso completo (briefing)', () => {
    expect(pode('manager', 'gerenciar_usuarios')).toBe(true);
    expect(pode('manager', 'operar_consultas')).toBe(true);
    expect(pode('manager', 'marcar_presenca_medium')).toBe(true);
  });

  it('só o manager gerencia giras, contas, listas, médiuns e entidades (10, 50, 60, 65, 90)', () => {
    for (const acao of [
      'gerenciar_giras',
      'gerenciar_usuarios',
      'gerenciar_listas',
      'cadastrar_medium',
      'cadastrar_entidade',
    ] as const) {
      expect(pode('controlador', acao)).toBe(false);
      expect(pode('contador', acao)).toBe(false);
    }
  });

  it('contador marca presença de médiuns; controlador não (100)', () => {
    expect(pode('contador', 'marcar_presenca_medium')).toBe(true);
    expect(pode('controlador', 'marcar_presenca_medium')).toBe(false);
  });

  it('controlador e contador marcam presença de consulentes (110)', () => {
    expect(pode('controlador', 'marcar_presenca_consulente')).toBe(true);
    expect(pode('contador', 'marcar_presenca_consulente')).toBe(true);
  });

  it('consultas, fila e fogo são do controlador, não do contador (120–160)', () => {
    expect(pode('controlador', 'operar_consultas')).toBe(true);
    expect(pode('controlador', 'operar_fogo')).toBe(true);
    expect(pode('contador', 'operar_consultas')).toBe(false);
    expect(pode('contador', 'operar_fogo')).toBe(false);
  });

  it('controlador cadastra consulente (70)', () => {
    expect(pode('controlador', 'cadastrar_consulente')).toBe(true);
    expect(pode('contador', 'cadastrar_consulente')).toBe(false);
  });

  it('painel é leitura para os três papéis (180)', () => {
    expect(pode('contador', 'ver_painel') && pode('controlador', 'ver_painel')).toBe(true);
  });

  it('ação negada falha com erro nomeado', () => {
    expect(erroDe(() => exigirPermissao('contador', 'gerenciar_giras'))).toBe('SEM_PERMISSAO');
  });
});
