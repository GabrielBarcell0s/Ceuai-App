/**
 * Fonte local (SQLite via PowerSync): toda leitura e escrita do dia a dia, offline.
 * As tabelas nascem com a modelagem (start-3).
 */
export interface LocalDataSource {
  open(): Promise<void>;
}
