import { BotaoPrincipal } from '@/ui/componentes';
import { Restrita } from '@/ui/Restrita';
import { TelaDaGira } from '@/ui/TelaDaGira';

/** Trabalho de fogo (160): seleção múltipla e lote. */
export default function Fogo() {
  return (
    <Restrita rota="fogo">
      <TelaDaGira
        titulo="Trabalho de fogo"
        semGira="O trabalho de fogo acontece dentro da gira ativa."
        rodape={<BotaoPrincipal rotulo="Iniciar lote" variante="cheio" desabilitado />}
      />
    </Restrita>
  );
}
