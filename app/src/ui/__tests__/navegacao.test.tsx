import { render, screen } from '@testing-library/react-native';

import Inicio from '@/app/(app)/index';
import Usuarios from '@/app/(app)/usuarios';
import PresencaMediuns from '@/app/(app)/presenca-mediuns';

import { comSessao } from '@/__fixtures__/sessao';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
}));

describe('navegação por papel (40)', () => {
  it('Manager vê a Gira ativa e todos os atalhos de gestão', async () => {
    await render(comSessao('manager', <Inicio />));
    expect(screen.getByText('Axé, Rosana')).toBeTruthy();
    for (const t of [
      'Gira ativa',
      'Giras',
      'Consulentes',
      'Médiuns',
      'Entidades',
      'Usuários',
      'Configurações',
    ]) {
      expect(screen.getByText(t)).toBeTruthy();
    }
  });

  it('Controlador vê só Gira ativa e Consulentes', async () => {
    await render(comSessao('controlador', <Inicio />));
    expect(screen.getByText('Consulentes')).toBeTruthy();
    expect(screen.queryByText('Usuários')).toBeNull();
    expect(screen.queryByText('Giras')).toBeNull();
  });

  it('Contador vê só a Gira ativa', async () => {
    await render(comSessao('contador', <Inicio />));
    expect(screen.getByText('Gira ativa')).toBeTruthy();
    expect(screen.queryByText('Consulentes')).toBeNull();
  });

  it('rota fora do papel mostra Sem permissão', async () => {
    await render(comSessao('contador', <Usuarios />));
    expect(screen.getByText('Sem permissão')).toBeTruthy();
    expect(screen.getByText('Esta área não faz parte do papel Contador de presença.')).toBeTruthy();
  });

  it('operação sem gira ativa avisa em vez de sumir', async () => {
    await render(comSessao('contador', <PresencaMediuns />));
    expect(screen.getByText('A presença é marcada dentro da gira ativa.')).toBeTruthy();
    expect(screen.getByText('Peça ao Manager para ativar a gira.')).toBeTruthy();
  });
});
