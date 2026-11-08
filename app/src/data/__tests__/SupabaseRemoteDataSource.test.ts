import { SupabaseRemoteDataSource } from '../datasources/remote/SupabaseRemoteDataSource';

const okFetch = jest.fn(async () => ({ ok: true }) as Response);

describe('SupabaseRemoteDataSource.health', () => {
  it('sem URL ou chave, informa que não está configurado', async () => {
    await expect(new SupabaseRemoteDataSource('', '', okFetch).health()).resolves.toBe(
      'not_configured',
    );
  });

  it('chama o endpoint de saúde do Auth com a chave pública', async () => {
    const ds = new SupabaseRemoteDataSource('https://x.supabase.co/', 'anon', okFetch);
    await expect(ds.health()).resolves.toBe('ok');
    expect(okFetch).toHaveBeenCalledWith('https://x.supabase.co/auth/v1/health', {
      headers: { apikey: 'anon' },
    });
  });

  it('sem rede, informa inacessível em vez de quebrar', async () => {
    const offline = jest.fn(async () => {
      throw new TypeError('Network request failed');
    });
    const ds = new SupabaseRemoteDataSource('https://x.supabase.co', 'anon', offline);
    await expect(ds.health()).resolves.toBe('unreachable');
  });
});
