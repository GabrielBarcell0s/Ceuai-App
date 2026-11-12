import { Redirect, Stack, type ErrorBoundaryProps } from 'expo-router';

import { useSessao } from '@/data/react';
import { EstadoErro, Esqueleto, Tela } from '@/ui/componentes';
import { mensagemDeErro } from '@/ui/mensagens';
import { cor } from '@/ui/tokens';

/** Área logada: sem sessão vai para o login; carregando mostra esqueleto, nunca tela branca. */
export default function AreaLogada() {
  const sessao = useSessao();
  if (sessao.estado === 'carregando') {
    return (
      <Tela titulo="CEUAI">
        <Esqueleto linhas={4} />
      </Tela>
    );
  }
  if (sessao.estado === 'sem_sessao') return <Redirect href="/login" />;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cor.tela } }} />
  );
}

/** Erro inesperado em qualquer tela logada: explica e oferece tentar de novo. */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <Tela titulo="Algo deu errado">
      <EstadoErro mensagem={mensagemDeErro(error)} onTentarDeNovo={retry} />
    </Tela>
  );
}
