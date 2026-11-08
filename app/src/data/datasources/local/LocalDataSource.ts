/**
 * Fonte local (SQLite via PowerSync): toda leitura e escrita do dia a dia, offline.
 * As tabelas estão em ./schema.ts, espelho de supabase/migrations.
 */
export interface LocalDataSource {
  open(): Promise<void>;
}
