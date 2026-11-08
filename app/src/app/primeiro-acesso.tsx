import { Text } from 'react-native';

import { BotaoPrincipal, Campo, Grupo, Tela } from '@/ui/componentes';
import { espaco, texto } from '@/ui/tokens';

/** Casca do Primeiro acesso (5): cria a conta do Manager, com nome. */
export default function PrimeiroAcesso() {
  return (
    <Tela
      titulo="Bem-vindo ao CEUAI"
      subtitulo="Nenhuma conta existe ainda"
      rodape={<BotaoPrincipal rotulo="Criar conta do Manager" variante="cheio" />}
    >
      <Text
        style={[
          texto.subtitulo,
          { fontSize: 14.5, lineHeight: 22, marginHorizontal: espaco.l, marginBottom: espaco.m },
        ]}
      >
        Crie a conta do Manager para o terreiro começar a usar o app. Este passo exige internet e
        acontece uma única vez.
      </Text>
      <Grupo>
        <Campo rotulo="Nome" autoComplete="name" />
        <Campo rotulo="E-mail" keyboardType="email-address" autoCapitalize="none" />
        <Campo rotulo="Senha" secureTextEntry />
      </Grupo>
    </Tela>
  );
}
