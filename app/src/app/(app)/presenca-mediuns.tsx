import { Restrita } from '@/ui/Restrita';
import { TelaDaGira } from '@/ui/TelaDaGira';

/** Presença de médiuns (100). */
export default function PresencaMediuns() {
  return (
    <Restrita rota="presencaMediuns">
      <TelaDaGira
        titulo="Presença de médiuns"
        semGira="A presença é marcada dentro da gira ativa."
      />
    </Restrita>
  );
}
