import { Restrita } from '@/ui/Restrita';
import { TelaDaGira } from '@/ui/TelaDaGira';

/** Painel da Gira ativa (90, 180): centro da operação; muda conforme o tipo da gira. */
export default function GiraAtiva() {
  return (
    <Restrita rota="giraAtiva">
      <TelaDaGira
        titulo="Gira ativa"
        semGira="Presença, filas e atendimento acontecem dentro da gira ativa."
      />
    </Restrita>
  );
}
