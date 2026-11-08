// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');

// Fronteiras das camadas (ver CLAUDE.md de cada pasta).
const infra = [
  '@supabase/*',
  '@powersync/*',
  '@op-engineering/*',
  '@react-native-async-storage/*',
  'expo-secure-store',
];

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  { ignores: ['dist/*', '.expo/*', 'android/*', 'coverage/*'] },
  {
    // Domínio: TypeScript puro.
    files: ['src/domain/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react', 'react-native', 'react-native-*', 'expo', 'expo-*', ...infra],
              message: 'Domínio é TypeScript puro: sem React Native, Expo, PowerSync ou Supabase.',
            },
            {
              group: ['@/app/*', '@/ui/*', '@/data/*'],
              message: 'Domínio não depende de outras camadas.',
            },
          ],
        },
      ],
    },
  },
  {
    // App/UI: nunca fala com rede ou banco direto.
    files: ['src/app/**', 'src/ui/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: infra,
              message: 'Tela não fala com rede nem banco: use os repositórios de @/data.',
            },
            {
              group: ['@/data/datasources/*'],
              message: 'Tela não acessa datasource: use os repositórios de @/data.',
            },
          ],
        },
      ],
    },
  },
]);
