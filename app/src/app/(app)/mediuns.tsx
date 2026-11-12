import { BotaoPrincipal, Vazio } from '@/ui/componentes';
import { Restrita } from '@/ui/Restrita';
import { TelaDeCadastro } from '@/ui/TelaDaGira';

/** Médiuns (60): as pessoas da corrente. */
export default function Mediuns() {
  return (
    <Restrita rota="mediuns">
      <TelaDeCadastro
        titulo="Médiuns"
        subtitulo="As pessoas da corrente"
        rodape={<BotaoPrincipal rotulo="Cadastrar médium" variante="cheio" />}
      >
        <Vazio
          mensagem="Nenhum médium cadastrado ainda."
          detalhe="As entidades de cada médium ficam na tela Entidades."
        />
      </TelaDeCadastro>
    </Restrita>
  );
}
