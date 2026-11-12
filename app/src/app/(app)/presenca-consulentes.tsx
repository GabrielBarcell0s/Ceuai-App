import { Restrita } from '@/ui/Restrita';
import { TelaDaGira } from '@/ui/TelaDaGira';

/** Presença de consulentes fora de consulta (110). */
export default function PresencaConsulentes() {
  return (
    <Restrita rota="presencaConsulentes">
      <TelaDaGira
        titulo="Presença de consulentes"
        semGira="A presença é marcada dentro da gira ativa."
      />
    </Restrita>
  );
}
