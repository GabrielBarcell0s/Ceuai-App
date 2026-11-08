import { BotaoPrincipal } from '@/ui/componentes';
import { Restrita } from '@/ui/Restrita';
import { TelaDaGira } from '@/ui/TelaDaGira';

/** Consultas (120): entidades em consulta e suas filas. */
export default function Consultas() {
  return (
    <Restrita rota="consultas">
      <TelaDaGira
        titulo="Consultas"
        subtitulo="Entidades atendendo nesta gira"
        semGira="As consultas acontecem dentro da gira normal ativa."
        rodape={<BotaoPrincipal rotulo="Colocar em consulta" variante="cheio" />}
      />
    </Restrita>
  );
}
