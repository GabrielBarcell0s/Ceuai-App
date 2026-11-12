import { useMemo } from 'react';

import { useRepositorioOpcional } from './Repositorios';
import { useObservavel } from './useObservavel';

const ROTULO_TIPO = { normal: 'Gira normal', fogo: 'Trabalho de fogo' } as const;

/** Dados da barra de contexto de toda tela: gira em andamento e conexão. */
export function useContextoDaGira(): { giraAtiva: string | null; offline: boolean } {
  const giras = useRepositorioOpcional('giras');
  const sincronizacao = useRepositorioOpcional('sincronizacao');
  const ativa = useObservavel(useMemo(() => giras?.giraAtiva(), [giras]));
  const conectado = useObservavel(useMemo(() => sincronizacao?.conectado(), [sincronizacao]));
  return {
    giraAtiva: ativa.estado === 'pronto' && ativa.valor ? ROTULO_TIPO[ativa.valor.tipo] : null,
    offline: conectado.estado === 'pronto' && !conectado.valor,
  };
}
