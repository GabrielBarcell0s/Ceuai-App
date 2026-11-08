import { BotaoPrincipal, Vazio } from '@/ui/componentes';
import { Restrita } from '@/ui/Restrita';
import { TelaDeCadastro } from '@/ui/TelaDaGira';

/** Entidades (65): quem cada médium incorpora. */
export default function Entidades() {
  return (
    <Restrita rota="entidades">
      <TelaDeCadastro
        titulo="Entidades"
        subtitulo="Quem cada médium incorpora"
        rodape={<BotaoPrincipal rotulo="Cadastrar entidade" variante="cheio" />}
      >
        <Vazio
          mensagem="Nenhuma entidade cadastrada."
          detalhe="Cadastre para poder colocar em consulta nas giras."
        />
      </TelaDeCadastro>
    </Restrita>
  );
}
