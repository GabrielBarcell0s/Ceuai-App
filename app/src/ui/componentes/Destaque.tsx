import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cor, espaco, fonte, raio } from '../tokens';

export interface DestaqueProps {
  rotulo: string;
  nome: string;
  /** Tempo decorrido já formatado (ex.: 4:05). */
  tempo: string;
  dica: string;
  onPress: () => void;
}

/** Cartão azul do que está acontecendo agora: atendimento da fila ou lote do fogo. */
export function Destaque({ rotulo, nome, tempo, dica, onPress }: DestaqueProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${rotulo}: ${nome}. ${dica}`}
      onPress={onPress}
      style={({ pressed }) => [estilos.cartao, pressed && { opacity: 0.88 }]}
    >
      <Text style={estilos.rotulo}>{rotulo.toUpperCase()}</Text>
      <Text style={estilos.nome}>{nome}</Text>
      <View style={estilos.linha}>
        <Text style={estilos.tempo}>{tempo}</Text>
        <Text style={estilos.dica}>{dica}</Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    marginHorizontal: espaco.l,
    marginBottom: espaco.xxs,
    backgroundColor: cor.acento,
    borderColor: cor.acentoBorda,
    borderWidth: 1,
    borderRadius: raio.destaque,
    paddingHorizontal: 18,
    paddingVertical: espaco.l,
  },
  rotulo: {
    fontFamily: fonte.corpoNegrito,
    fontSize: 11.5,
    letterSpacing: 0.5,
    color: cor.textoSobreAcento,
  },
  nome: {
    fontFamily: fonte.titulo,
    fontSize: 20,
    color: cor.textoSobreAcento,
    marginTop: 2,
    marginBottom: espaco.s,
  },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  tempo: {
    fontFamily: fonte.corpoNegrito,
    fontSize: 22,
    color: cor.textoSobreAcento,
    fontVariant: ['tabular-nums'],
  },
  dica: { fontFamily: fonte.corpo, fontSize: 13, color: cor.textoSobreAcento },
});
