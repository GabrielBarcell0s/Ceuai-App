import { useRouter } from 'expo-router';
import { Text } from 'react-native';

import { BotaoPrincipal, Campo, Grupo, Tela } from '@/ui/componentes';
import { espaco, texto } from '@/ui/tokens';

/** Casca da tela Redefinir senha (30). */
export default function RedefinirSenha() {
  const router = useRouter();
  return (
    <Tela
      titulo="Redefinir senha"
      onVoltar={() => router.back()}
      rodape={<BotaoPrincipal rotulo="Enviar link de redefinição" variante="cheio" />}
    >
      <Grupo>
        <Campo rotulo="E-mail cadastrado" keyboardType="email-address" autoCapitalize="none" />
      </Grupo>
      <Text style={[texto.detalhe, { marginHorizontal: espaco.l }]}>
        Este passo exige internet, diferente do login do dia a dia.
      </Text>
    </Tela>
  );
}
