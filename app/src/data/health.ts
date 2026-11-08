import { readEnv } from '@/config/env';

import type { HealthStatus } from './datasources/remote/RemoteDataSource';
import { SupabaseRemoteDataSource } from './datasources/remote/SupabaseRemoteDataSource';

export type { HealthStatus };

export function checkBackendHealth(): Promise<HealthStatus> {
  const env = readEnv();
  return new SupabaseRemoteDataSource(env.supabaseUrl, env.supabaseAnonKey).health();
}
