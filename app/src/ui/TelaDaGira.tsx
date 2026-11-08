import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';

import { useContextoDaGira, usePode } from '@/data/react';

import { SemGira, Tela, type TelaProps } from './componentes';
import { ROTAS } from './rotas';

export interface TelaDaGiraProps extends Omit<TelaProps, 'contexto'> {
  /** Mensagem do protótipo quando não há gira ativa. */
  semGira: string;
}

/**
 * Casca das telas de operação (100–180): sem gira ativa, mostra o aviso do protótipo
 * em vez do conteúdo; com gira, o card correspondente preenche o corpo.
 */
export function TelaDaGira({ semGira, children, rodape, ...tela }: TelaDaGiraProps) {
  const router = useRouter();
  const contexto = useContextoDaGira();
  const podeAbrirGiras = usePode('gerenciar_giras');
  const ativa = contexto.giraAtiva !== null;
  return (
    <Tela
      {...tela}
      onVoltar={tela.onVoltar ?? (() => router.back())}
      contexto={contexto}
      rodape={ativa ? rodape : undefined}
    >
      {ativa ? (
        children
      ) : (
        <SemGira
          mensagem={semGira}
          podeAbrirGiras={podeAbrirGiras}
          onAbrirGiras={() => router.push(ROTAS.giras.href)}
        />
      )}
    </Tela>
  );
}

/** Casca das telas de cadastro e gestão: contexto da gira e voltar. */
export function TelaDeCadastro({
  children,
  ...tela
}: Omit<TelaProps, 'contexto'> & { children?: ReactNode }) {
  const router = useRouter();
  const contexto = useContextoDaGira();
  return (
    <Tela {...tela} onVoltar={tela.onVoltar ?? (() => router.back())} contexto={contexto}>
      {children}
    </Tela>
  );
}
