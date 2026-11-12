import { BotaoPrincipal, Vazio } from '@/ui/componentes';
import { Restrita } from '@/ui/Restrita';
import { TelaDeCadastro } from '@/ui/TelaDaGira';

/** Giras (80, 90, 170). */
export default function Giras() {
  return (
    <Restrita rota="giras">
      <TelaDeCadastro
        titulo="Giras"
        subtitulo="Uma ativa por vez"
        rodape={<BotaoPrincipal rotulo="Criar gira" variante="cheio" />}
      >
        <Vazio mensagem="Nenhuma gira criada ainda." detalhe="Crie a primeira para o terreiro." />
      </TelaDeCadastro>
    </Restrita>
  );
}
