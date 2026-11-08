import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useContextoDaGira, usePode, useRepositorioOpcional, useSessao } from '@/data/react';
import { pode } from '@/domain';
import { BotaoSecundario, Tela } from '@/ui/componentes';
import { ATALHOS_INICIO, NOME_PAPEL, ROTAS, primeiroNome, type Rota } from '@/ui/rotas';
import { cor, espaco, raio, texto } from '@/ui/tokens';

/** Tela inicial (40): Gira ativa em destaque e só os atalhos do papel. */
export default function Inicio() {
  const router = useRouter();
  const sessao = useSessao();
  const contexto = useContextoDaGira();
  const contas = useRepositorioOpcional('contas');
  const verPainel = usePode('ver_painel');
  if (sessao.estado !== 'ativa') return null;
  const { usuario } = sessao;
  const atalhos = ATALHOS_INICIO.filter((chave) => {
    const acao = ROTAS[chave].acao;
    return acao !== null && pode(usuario.papel, acao);
  });

  return (
    <Tela
      titulo={`Axé, ${primeiroNome(usuario.nome)}`}
      subtitulo={NOME_PAPEL[usuario.papel]}
      contexto={contexto}
      rodape={<BotaoSecundario rotulo="Sair da conta" onPress={() => contas?.sair()} />}
    >
      <View style={estilos.grade}>
        {verPainel ? (
          <Atalho
            titulo={ROTAS.giraAtiva.titulo}
            detalhe={
              contexto.giraAtiva
                ? `${contexto.giraAtiva} em andamento. Presença, filas e atendimento acontecem aqui`
                : 'Nenhuma gira ativa no momento'
            }
            destaque
            onPress={() => router.push(ROTAS.giraAtiva.href)}
          />
        ) : null}
        {atalhos.map((chave) => {
          const r: Rota = ROTAS[chave];
          return (
            <Atalho
              key={chave}
              titulo={r.titulo}
              detalhe={r.atalho}
              onPress={() => router.push(r.href)}
            />
          );
        })}
      </View>
    </Tela>
  );
}

function Atalho(p: { titulo: string; detalhe?: string; destaque?: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={p.onPress}
      style={({ pressed }) => [
        estilos.atalho,
        p.destaque && estilos.atalhoDestaque,
        pressed && { backgroundColor: cor.superficiePressionada },
      ]}
    >
      <Text style={[texto.nome, { fontFamily: 'Archivo_700Bold', fontSize: 15 }]}>{p.titulo}</Text>
      {p.detalhe ? <Text style={texto.detalhe}>{p.detalhe}</Text> : null}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm, marginHorizontal: espaco.l },
  atalho: {
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 76,
    padding: espaco.l,
    gap: espaco.xs,
    justifyContent: 'space-between',
    backgroundColor: cor.superficie,
    borderWidth: 1,
    borderColor: cor.borda,
    borderRadius: raio.cartao,
  },
  atalhoDestaque: { flexBasis: '100%', borderColor: cor.acento },
});
