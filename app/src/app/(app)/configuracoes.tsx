import { Grupo, Linha, Secao } from '@/ui/componentes';
import { Restrita } from '@/ui/Restrita';
import { TelaDeCadastro } from '@/ui/TelaDaGira';

/**
 * Configurações (50): listas de Obrigação e Missão, Termos de Uso e Política de
 * Privacidade (sempre acessíveis aqui, CLAUDE.md raiz).
 */
export default function Configuracoes() {
  return (
    <Restrita rota="configuracoes">
      <TelaDeCadastro titulo="Configurações">
        <Secao titulo="Obrigações" />
        <Grupo>
          <Linha titulo="Adicionar opção" destaque />
        </Grupo>
        <Secao titulo="Missões" />
        <Grupo>
          <Linha titulo="Adicionar opção" destaque />
        </Grupo>
        <Secao titulo="Sobre os dados" />
        <Grupo>
          <Linha titulo="Termos de Uso" />
          <Linha
            titulo="Política de Privacidade"
            detalhe="Como o terreiro guarda nomes e contatos"
          />
        </Grupo>
      </TelaDeCadastro>
    </Restrita>
  );
}
