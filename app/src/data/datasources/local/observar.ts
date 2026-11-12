import type { Observavel } from '@/domain';

/** O pedaço do PowerSync que observar() usa; facilita o teste sem SQLite. */
export interface BancoObservavel {
  watch(
    sql: string,
    parametros: unknown[],
    handler: {
      onResult: (r: { rows?: { _array: Record<string, unknown>[] } }) => void;
      onError?: (e: Error) => void;
    },
    opcoes: { signal: AbortSignal },
  ): void;
}

/**
 * Transforma uma consulta SQL local em Observavel do contrato: o PowerSync reemite
 * sempre que as tabelas lidas mudam (escrita local ou sincronização).
 * Base de toda leitura dos repositórios.
 */
export function observar<T>(
  db: BancoObservavel,
  sql: string,
  parametros: unknown[],
  mapear: (linhas: Record<string, unknown>[]) => T,
): Observavel<T> {
  return {
    subscribe(ouvinte) {
      const controle = new AbortController();
      db.watch(
        sql,
        parametros,
        { onResult: (r) => ouvinte(mapear(r.rows?._array ?? [])) },
        { signal: controle.signal },
      );
      return () => controle.abort();
    },
  };
}
