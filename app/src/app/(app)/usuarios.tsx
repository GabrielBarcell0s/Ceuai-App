import { Aviso, BotaoPrincipal } from '@/ui/componentes';
import { Restrita } from '@/ui/Restrita';
import { TelaDeCadastro } from '@/ui/TelaDaGira';

/** Usuários (10): contas do terreiro. */
export default function Usuarios() {
  return (
    <Restrita rota="usuarios">
      <TelaDeCadastro
        titulo="Usuários"
        subtitulo="Contas do terreiro"
        rodape={<BotaoPrincipal rotulo="Criar conta" variante="cheio" />}
      >
        <Aviso mensagem="Criar e editar contas exige internet. É preparação, fora da gira." />
      </TelaDeCadastro>
    </Restrita>
  );
}
