import { BotaoPrincipal } from '@/ui/componentes';
import { Restrita } from '@/ui/Restrita';
import { TelaDaGira } from '@/ui/TelaDaGira';

/** Fila de uma entidade em consulta (130, 140, 150). O card 130 lê a consulta pelo parâmetro. */
export default function Fila() {
  return (
    <Restrita rota="fila">
      <TelaDaGira
        titulo="Fila"
        semGira="As consultas acontecem dentro da gira normal ativa."
        rodape={<BotaoPrincipal rotulo="Adicionar à fila" variante="cheio" />}
      />
    </Restrita>
  );
}
