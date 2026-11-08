export type HealthStatus = 'ok' | 'not_configured' | 'unreachable';

/**
 * Fonte remota (Api). Hoje implementada pelo Supabase; a migração para a API em C#
 * é uma nova implementação desta interface.
 */
export interface RemoteDataSource {
  health(): Promise<HealthStatus>;
}
