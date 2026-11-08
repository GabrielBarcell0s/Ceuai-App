import { useEffect, useState } from 'react';

import type { Observavel } from '@/domain';

export type Leitura<T> =
  { estado: 'carregando' } | { estado: 'pronto'; valor: T } | { estado: 'erro'; erro: unknown };

/**
 * Assina um Observavel do contrato e entrega o estado para a tela escolher entre
 * esqueleto (carregando), conteúdo/vazio (pronto) e erro. Passe um observável estável
 * (useMemo), senão a assinatura é refeita a cada render.
 */
export function useObservavel<T>(observavel: Observavel<T> | null | undefined): Leitura<T> {
  const [atual, setAtual] = useState<{ fonte: Observavel<T>; leitura: Leitura<T> } | null>(null);
  useEffect(() => {
    if (!observavel) return;
    try {
      return observavel.subscribe((valor) =>
        setAtual({ fonte: observavel, leitura: { estado: 'pronto', valor } }),
      );
    } catch (erro) {
      queueMicrotask(() => setAtual({ fonte: observavel, leitura: { estado: 'erro', erro } }));
    }
  }, [observavel]);
  // Leitura de outro observável (o anterior) ainda não vale: carregando até a primeira emissão.
  return atual && atual.fonte === observavel ? atual.leitura : { estado: 'carregando' };
}
