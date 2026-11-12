import { useCallback, useState } from 'react';

import { log } from '@/config/log';

/**
 * Executa uma escrita da tela: marca "enviando", guarda o erro (DomainError nomeado ou
 * inesperado) para a tela traduzir com mensagemDeErro e devolve se deu certo.
 */
export function useAcao<A extends unknown[]>(acao: (...args: A) => Promise<unknown>) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<unknown>(null);

  const executar = useCallback(
    async (...args: A): Promise<boolean> => {
      setEnviando(true);
      setErro(null);
      try {
        await acao(...args);
        return true;
      } catch (e) {
        log.erro('acao_falhou', e);
        setErro(e);
        return false;
      } finally {
        setEnviando(false);
      }
    },
    [acao],
  );

  return { executar, enviando, erro, limparErro: () => setErro(null) };
}
