import { Pressable, StyleSheet, Text } from 'react-native';

import { cor, espaco, fonte, raio, toque } from '../tokens';

export type VarianteBotao = 'cheio' | 'contorno' | 'perigo';

export interface BotaoPrincipalProps {
  rotulo: string;
  onPress?: () => void;
  variante?: VarianteBotao;
  desabilitado?: boolean;
  /** Ação em andamento: desabilita e troca o rótulo. */
  enviando?: boolean;
}

/** Botão de largura total do rodapé, das folhas e dos estados vazios. */
export function BotaoPrincipal({
  rotulo,
  onPress,
  variante = 'contorno',
  desabilitado,
  enviando,
}: BotaoPrincipalProps) {
  const inativo = desabilitado || enviando;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inativo, busy: !!enviando }}
      disabled={inativo}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.base,
        estilos[variante],
        pressed && (variante === 'cheio' ? estilos.cheioPressionado : estilos.pressionado),
        inativo && { opacity: 0.45 },
      ]}
    >
      <Text
        style={[
          estilos.rotulo,
          { color: variante === 'cheio' ? cor.textoSobreAcento : undefined },
          variante === 'perigo' && { color: cor.negativo },
        ]}
      >
        {enviando ? 'Aguarde' : rotulo}
      </Text>
    </Pressable>
  );
}

/** Ação discreta sublinhada (Esqueceu a senha, Sair da conta, Voltar). */
export function BotaoSecundario({ rotulo, onPress }: { rotulo: string; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [estilos.secundario, pressed && { opacity: 0.6 }]}
    >
      <Text style={estilos.secundarioTexto}>{rotulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    width: '100%',
    minHeight: toque.linha,
    borderRadius: raio.cartao,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: espaco.l,
  },
  contorno: { backgroundColor: cor.superficie, borderColor: cor.acento },
  cheio: { backgroundColor: cor.acento, borderColor: cor.acentoBorda },
  perigo: { backgroundColor: cor.superficie, borderColor: cor.negativo },
  pressionado: { backgroundColor: cor.superficiePressionada },
  cheioPressionado: { opacity: 0.88 },
  rotulo: { fontFamily: fonte.corpoNegrito, fontSize: 16, color: cor.texto },
  secundario: {
    padding: espaco.sm,
    alignItems: 'center',
    minHeight: toque.minimo,
    justifyContent: 'center',
  },
  secundarioTexto: {
    fontFamily: fonte.corpo,
    fontSize: 13.5,
    color: cor.textoSecundario,
    textDecorationLine: 'underline',
  },
});
