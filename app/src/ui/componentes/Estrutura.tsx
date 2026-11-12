import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cor, espaco, raio, texto, toque } from '../tokens';
import { IconeVoltar, Ondas } from './Icones';

export interface CabecalhoProps {
  titulo: string;
  subtitulo?: string | null;
  /** Mostra o botão de voltar. */
  onVoltar?: () => void;
}

export function Cabecalho({ titulo, subtitulo, onVoltar }: CabecalhoProps) {
  return (
    <View>
      <View style={estilos.cabecalho}>
        {onVoltar ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={onVoltar}
            style={({ pressed }) => [estilos.voltar, pressed && estilos.pressionado]}
          >
            <IconeVoltar />
          </Pressable>
        ) : null}
        <View style={estilos.cabecalhoTexto}>
          <Text style={texto.titulo} accessibilityRole="header">
            {titulo}
          </Text>
          {subtitulo ? <Text style={[texto.subtitulo, { marginTop: 2 }]}>{subtitulo}</Text> : null}
        </View>
      </View>
      <Ondas />
    </View>
  );
}

export interface BarraContextoProps {
  /** Nome da gira ativa; null quando não há. */
  giraAtiva: string | null;
  offline: boolean;
}

/** Faixa logo abaixo do cabeçalho: gira em andamento e estado da conexão. */
export function BarraContexto({ giraAtiva, offline }: BarraContextoProps) {
  return (
    <View style={estilos.contexto}>
      <Text style={texto.detalhe} numberOfLines={1}>
        {giraAtiva ? `${giraAtiva} em andamento` : 'Nenhuma gira ativa'}
      </Text>
      {offline ? (
        <Text style={[texto.detalhe, { color: cor.aviso }]} numberOfLines={1}>
          <Text style={{ fontFamily: 'Archivo_600SemiBold' }}>Sem conexão.</Text> Registrando no
          aparelho
        </Text>
      ) : null}
    </View>
  );
}

/** Rodapé fixo das ações principais da tela. */
export function Rodape({ children }: { children: ReactNode }) {
  return <View style={estilos.rodape}>{children}</View>;
}

export interface TelaProps extends CabecalhoProps {
  contexto?: BarraContextoProps;
  rodape?: ReactNode;
  children?: ReactNode;
  /** Folhas e diálogos da tela. */
  sobreposicao?: ReactNode;
}

/** Casca de toda tela do app: cabeçalho, contexto da gira, conteúdo rolável e rodapé. */
export function Tela({ contexto, rodape, children, sobreposicao, ...cabecalho }: TelaProps) {
  return (
    <SafeAreaView style={estilos.tela} edges={['top', 'bottom']}>
      <Cabecalho {...cabecalho} />
      {contexto ? <BarraContexto {...contexto} /> : null}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={estilos.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
      {rodape ? <Rodape>{rodape}</Rodape> : null}
      {sobreposicao}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cor.tela },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco.m,
    paddingHorizontal: espaco.l,
    paddingTop: espaco.l,
    paddingBottom: espaco.m,
  },
  cabecalhoTexto: { flex: 1, minWidth: 0, alignSelf: 'center' },
  voltar: {
    width: toque.minimo,
    height: toque.minimo,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cor.superficie,
    borderWidth: 1,
    borderColor: cor.borda,
    borderRadius: raio.controle,
  },
  pressionado: { backgroundColor: cor.superficiePressionada },
  contexto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: espaco.s,
    paddingHorizontal: espaco.l,
    paddingVertical: espaco.s,
    borderBottomWidth: 1,
    borderBottomColor: cor.borda,
  },
  conteudo: { paddingTop: espaco.ml, paddingBottom: espaco.xl, flexGrow: 1 },
  rodape: {
    paddingHorizontal: espaco.l,
    paddingVertical: espaco.ml,
    borderTopWidth: 1,
    borderTopColor: cor.borda,
    backgroundColor: cor.tela,
    gap: espaco.sm,
  },
});
