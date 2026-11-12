import { fireEvent, render, screen } from '@testing-library/react-native';

import {
  BotaoPrincipal,
  Confirmacao,
  Esqueleto,
  EstadoErro,
  Grupo,
  Linha,
  Pill,
  SemGira,
  Vazio,
} from '@/ui/componentes';

describe('componentes da fundação', () => {
  it('linha com onPress é botão', async () => {
    const toque = jest.fn();
    await render(
      <Grupo>
        <Linha titulo="Termos de Uso" onPress={toque} />
      </Grupo>,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Termos de Uso' }));
    expect(toque).toHaveBeenCalled();
  });

  it('pill desabilitada não responde', async () => {
    const toque = jest.fn();
    await render(<Pill rotulo="Ao topo" onPress={toque} desabilitado />);
    await fireEvent.press(screen.getByText('Ao topo'));
    expect(toque).not.toHaveBeenCalled();
  });

  it('botão enviando mostra Aguarde e não repete a ação', async () => {
    const toque = jest.fn();
    await render(<BotaoPrincipal rotulo="Salvar" onPress={toque} enviando />);
    await fireEvent.press(screen.getByText('Aguarde'));
    expect(toque).not.toHaveBeenCalled();
  });

  it('vazio mostra o convite à ação', async () => {
    const toque = jest.fn();
    await render(
      <Vazio
        mensagem="Nenhuma entidade cadastrada."
        acao={{ rotulo: 'Cadastrar', onPress: toque }}
      />,
    );
    await fireEvent.press(screen.getByText('Cadastrar'));
    expect(toque).toHaveBeenCalled();
  });

  it('esqueleto se anuncia como carregando', async () => {
    await render(<Esqueleto />);
    expect(screen.getByLabelText('Carregando')).toBeTruthy();
  });

  it('erro explica e oferece tentar de novo', async () => {
    const tentar = jest.fn();
    await render(<EstadoErro mensagem="Sem internet." onTentarDeNovo={tentar} />);
    expect(screen.getByRole('alert')).toBeTruthy();
    await fireEvent.press(screen.getByText('Tentar de novo'));
    expect(tentar).toHaveBeenCalled();
  });

  it('confirmação mostra o conteúdo e confirma ou volta', async () => {
    const sim = jest.fn();
    const nao = jest.fn();
    await render(
      <Confirmacao
        visivel
        titulo="Finalizar consulta"
        rotuloConfirmar="Finalizar"
        perigo
        onConfirmar={sim}
        onVoltar={nao}
      />,
    );
    await fireEvent.press(screen.getByText('Finalizar'));
    await fireEvent.press(screen.getByText('Voltar'));
    expect(sim).toHaveBeenCalled();
    expect(nao).toHaveBeenCalled();
  });

  it('sem gira: Manager abre Giras, os outros veem o pedido', async () => {
    const abrir = jest.fn();
    const { rerender } = await render(<SemGira mensagem="x" podeAbrirGiras onAbrirGiras={abrir} />);
    await fireEvent.press(screen.getByText('Abrir Giras'));
    expect(abrir).toHaveBeenCalled();
    await rerender(<SemGira mensagem="x" podeAbrirGiras={false} onAbrirGiras={abrir} />);
    expect(screen.getByText('Peça ao Manager para ativar a gira.')).toBeTruthy();
  });
});
