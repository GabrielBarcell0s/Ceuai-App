import type { ReactNode } from 'react';

import { RepositoriosProvider, SessaoFixa } from '@/data/react';
import type { Papel, Repositorios } from '@/domain';

/** Monta a tela com uma sessão do papel pedido, sem login real. */
export function comSessao(
  papel: Papel,
  filho: ReactNode,
  repositorios: Partial<Repositorios> = {},
) {
  return (
    <RepositoriosProvider repositorios={repositorios}>
      <SessaoFixa
        sessao={{
          estado: 'ativa',
          usuario: { id: 'u1', terreiroId: 't1', nome: 'Rosana Lima', email: 'r@ceuai.org', papel },
        }}
      >
        {filho}
      </SessaoFixa>
    </RepositoriosProvider>
  );
}
