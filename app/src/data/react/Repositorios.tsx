import { createContext, useContext, type ReactNode } from 'react';

import type { Repositorios } from '@/domain';

const Contexto = createContext<Partial<Repositorios>>({});

export function RepositoriosProvider({
  repositorios,
  children,
}: {
  repositorios: Partial<Repositorios>;
  children: ReactNode;
}) {
  return <Contexto.Provider value={repositorios}>{children}</Contexto.Provider>;
}

/** Repositório para a tela; falha alto se o card que o implementa ainda não foi feito. */
export function useRepositorio<K extends keyof Repositorios>(nome: K): Repositorios[K] {
  const repo = useContext(Contexto)[nome];
  if (!repo) throw new Error(`Repositório "${nome}" ainda não implementado.`);
  return repo;
}

/** Versão tolerante, para a infraestrutura comum (sessão, barra de contexto). */
export function useRepositorioOpcional<K extends keyof Repositorios>(
  nome: K,
): Repositorios[K] | undefined {
  return useContext(Contexto)[nome];
}
