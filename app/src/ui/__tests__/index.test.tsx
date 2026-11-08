import { render, screen } from '@testing-library/react-native';

import Index from '@/app/index';

jest.mock('@/data/health', () => ({
  checkBackendHealth: jest.fn(async () => 'not_configured'),
}));

it('mostra o estado da conexão com o servidor', async () => {
  await render(<Index />);
  expect(await screen.findByText('Servidor não configurado: preencha o .env.local')).toBeTruthy();
});
