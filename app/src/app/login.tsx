import { useRouter } from 'expo-router';

import { BotaoPrincipal, BotaoSecundario, Campo, Grupo, Tela } from '@/ui/componentes';

/** Casca da tela Login (20). O card 20 liga a autenticação. */
export default function Login() {
  const router = useRouter();
  return (
    <Tela
      titulo="Entrar"
      subtitulo="Centro Espírita União ao Infinito"
      rodape={
        <>
          <BotaoPrincipal rotulo="Entrar" variante="cheio" />
          <BotaoSecundario
            rotulo="Esqueceu a senha"
            onPress={() => router.push('/redefinir-senha')}
          />
        </>
      }
    >
      <Grupo>
        <Campo
          rotulo="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <Campo rotulo="Senha" secureTextEntry autoComplete="password" />
      </Grupo>
    </Tela>
  );
}
