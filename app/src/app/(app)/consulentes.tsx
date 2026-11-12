import { BotaoPrincipal, Campo, Grupo } from '@/ui/componentes';
import { Restrita } from '@/ui/Restrita';
import { TelaDeCadastro } from '@/ui/TelaDaGira';

/** Consulentes (70): buscar antes, cadastrar se faltar. */
export default function Consulentes() {
  return (
    <Restrita rota="consulentes">
      <TelaDeCadastro
        titulo="Consulentes"
        subtitulo="Buscar antes, cadastrar se faltar"
        rodape={<BotaoPrincipal rotulo="Cadastrar consulente" />}
      >
        <Grupo>
          <Campo rotulo="Buscar pelo nome" placeholder="Comece a digitar" />
        </Grupo>
      </TelaDeCadastro>
    </Restrita>
  );
}
