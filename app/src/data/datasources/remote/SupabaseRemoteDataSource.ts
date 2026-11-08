import type { HealthStatus, RemoteDataSource } from './RemoteDataSource';

type Fetch = typeof fetch;

export class SupabaseRemoteDataSource implements RemoteDataSource {
  constructor(
    private readonly url: string,
    private readonly anonKey: string,
    private readonly fetchFn: Fetch = fetch,
  ) {}

  async health(): Promise<HealthStatus> {
    if (!this.url || !this.anonKey) return 'not_configured';
    try {
      const res = await this.fetchFn(`${this.url.replace(/\/$/, '')}/auth/v1/health`, {
        headers: { apikey: this.anonKey },
      });
      return res.ok ? 'ok' : 'unreachable';
    } catch {
      return 'unreachable';
    }
  }
}
