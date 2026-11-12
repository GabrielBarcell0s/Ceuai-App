import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';

import { usePode, useSessao, useContextoDaGira } from '@/data/react';

import { SemPermissao, Tela } from './componentes';
import { NOME_PAPEL, ROTAS, type ChaveRota } from './rotas';

/**
 * Guarda de rota: a tela só monta se o papel de quem entrou tem a ação da rota
 * (permissoes.ts). Sem permissão, mostra o estado do protótipo em vez de esconder.
 */
export function Restrita({ rota, children }: { rota: ChaveRota; children: ReactNode }) {
  const acao = ROTAS[rota].acao;
  const liberada = usePode(acao ?? 'ver_painel');
  const sessao = useSessao();
  const contexto = useContextoDaGira();
  const router = useRouter();
  if (acao === null || liberada) return <>{children}</>;
  const papel = sessao.estado === 'ativa' ? NOME_PAPEL[sessao.usuario.papel] : '';
  return (
    <Tela titulo="Sem permissão" subtitulo={`Seu papel: ${papel}`} contexto={contexto}>
      <SemPermissao papel={papel} onInicio={() => router.replace(ROTAS.inicio.href)} />
    </Tela>
  );
}
