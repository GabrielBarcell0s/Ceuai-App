import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { pode, type Acao, type Usuario } from '@/domain';

import { useRepositorioOpcional } from './Repositorios';
import { useObservavel } from './useObservavel';

export type EstadoSessao =
  { estado: 'carregando' } | { estado: 'sem_sessao' } | { estado: 'ativa'; usuario: Usuario };

const Contexto = createContext<EstadoSessao>({ estado: 'carregando' });

/**
 * Sessão como infraestrutura (20): quem entrou e com qual papel, valendo offline.
 * Sem o repositório de contas (card 20 ainda não feito), não há sessão.
 */
export function SessaoProvider({ children }: { children: ReactNode }) {
  const contas = useRepositorioOpcional('contas');
  const observavel = useMemo(() => contas?.sessaoAtual(), [contas]);
  const leitura = useObservavel(observavel);
  const valor: EstadoSessao = !contas
    ? { estado: 'sem_sessao' }
    : leitura.estado === 'carregando'
      ? { estado: 'carregando' }
      : leitura.estado === 'pronto' && leitura.valor
        ? { estado: 'ativa', usuario: leitura.valor }
        : { estado: 'sem_sessao' };
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

/** Para testes e para montar telas fora do fluxo real. */
export function SessaoFixa({ sessao, children }: { sessao: EstadoSessao; children: ReactNode }) {
  return <Contexto.Provider value={sessao}>{children}</Contexto.Provider>;
}

export function useSessao(): EstadoSessao {
  return useContext(Contexto);
}

/** Autorização derivada do modelo (permissoes.ts): a tela pergunta, não decide. */
export function usePode(acao: Acao): boolean {
  const sessao = useSessao();
  return sessao.estado === 'ativa' && pode(sessao.usuario.papel, acao);
}
