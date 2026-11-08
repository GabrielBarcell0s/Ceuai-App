export type AppEnv = 'dev' | 'prod';

export interface Env {
  appEnv: AppEnv;
  supabaseUrl: string;
  supabaseAnonKey: string;
  powersyncUrl: string;
}

// O Expo só injeta variáveis EXPO_PUBLIC_ acessadas de forma literal.
export function readEnv(): Env {
  return {
    appEnv: process.env.EXPO_PUBLIC_APP_ENV === 'prod' ? 'prod' : 'dev',
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    powersyncUrl: process.env.EXPO_PUBLIC_POWERSYNC_URL ?? '',
  };
}
