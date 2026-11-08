import {
  emailValido,
  exigirEmailLivre,
  exigirPrimeiroAcesso,
  nomesParecidos,
  nomeValido,
  opcaoExistente,
  opcional,
  tipoGiraValido,
} from '../cadastros';
import { presencaAoEntrarNaFila } from '../presenca';
import { erroDe, T } from '../__fixtures__/helpers';

describe('cadastros', () => {
  it('nome é obrigatório e normalizado (50, 60, 65, 70)', () => {
    expect(erroDe(() => nomeValido('   '))).toBe('NOME_OBRIGATORIO');
    expect(nomeValido('  Dona   Lurdes ')).toBe('Dona Lurdes');
  });

  it('telefone e e-mail opcionais viram null quando vazios (60, 70)', () => {
    expect(opcional('')).toBeNull();
    expect(opcional(' (21) 99999 0000 ')).toBe('(21) 99999 0000');
  });

  it('e-mail de conta válido e único (10)', () => {
    expect(erroDe(() => emailValido('beto'))).toBe('EMAIL_INVALIDO');
    expect(emailValido(' Beto@CEUAI.org ')).toBe('beto@ceuai.org');
    expect(erroDe(() => exigirEmailLivre('BETO@ceuai.org', ['beto@ceuai.org']))).toBe(
      'EMAIL_JA_CADASTRADO',
    );
  });

  it('primeiro acesso só sem nenhuma conta (5)', () => {
    expect(() => exigirPrimeiroAcesso(0)).not.toThrow();
    expect(erroDe(() => exigirPrimeiroAcesso(1))).toBe('CONTA_MANAGER_JA_EXISTE');
  });

  it('gira exige tipo (80)', () => {
    expect(erroDe(() => tipoGiraValido(''))).toBe('TIPO_GIRA_OBRIGATORIO');
    expect(tipoGiraValido('fogo')).toBe('fogo');
  });

  it('opção duplicada reaproveita a existente, ignorando caixa e acento (50)', () => {
    const opcoes = [
      { id: 'o1', terreiroId: T, tipo: 'obrigacao' as const, nome: 'Obrigação de 1 ano' },
    ];
    expect(opcaoExistente(opcoes, 'obrigacao', 'obrigacao DE 1 ano')?.id).toBe('o1');
    expect(opcaoExistente(opcoes, 'missao', 'Obrigação de 1 ano')).toBeUndefined();
  });

  it('aviso de nome parecido no médium, sem bloquear (60)', () => {
    expect(nomesParecidos('Jorge Sant Anna', ['Jorge Santana', 'Leda Moraes'])).toEqual([
      'Jorge Santana',
    ]);
    expect(nomesParecidos('Diego', ['Leda Moraes'])).toEqual([]);
  });

  it('entrar na fila marca o consulente presente (130)', () => {
    const novo = { id: 'p', terreiroId: T, giraId: 'g1', consulenteId: 'c1' };
    expect(presencaAoEntrarNaFila(undefined, novo).presente).toBe(true);
    expect(presencaAoEntrarNaFila({ ...novo, presente: false }, novo).presente).toBe(true);
  });
});
