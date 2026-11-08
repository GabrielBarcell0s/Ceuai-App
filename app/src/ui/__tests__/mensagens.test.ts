import { DomainError } from '@/domain';
import { MENSAGEM_INESPERADA, MENSAGENS, mensagemDeErro } from '@/ui/mensagens';

describe('mensagens de erro', () => {
  it('cada erro nomeado tem texto de tela, sem travessão', () => {
    for (const texto of Object.values(MENSAGENS)) {
      expect(texto.length).toBeGreaterThan(0);
      expect(texto).not.toMatch(/—/);
    }
  });

  it('traduz erro do domínio e esconde o inesperado', () => {
    expect(mensagemDeErro(new DomainError('JA_EXISTE_GIRA_ATIVA'))).toBe(
      MENSAGENS.JA_EXISTE_GIRA_ATIVA,
    );
    expect(mensagemDeErro(new Error('detalhe interno'))).toBe(MENSAGEM_INESPERADA);
  });
});
