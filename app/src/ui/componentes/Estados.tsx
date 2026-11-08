import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, Text, View } from 'react-native';

import { cor, espaco, raio, texto } from '../tokens';
import { BotaoPrincipal } from './Botoes';

export interface VazioProps {
  mensagem: string;
  /** Segunda linha, mais explicativa. */
  detalhe?: string;
  acao?: { rotulo: string; onPress: () => void; cheio?: boolean };
}

/** Estado vazio: diz o que falta e convida à ação, como no protótipo. */
export function Vazio({ mensagem, detalhe, acao }: VazioProps) {
  return (
    <View style={estilos.vazio}>
      <Text style={estilos.vazioTexto}>{mensagem}</Text>
      {detalhe ? <Text style={estilos.vazioTexto}>{detalhe}</Text> : null}
      {acao ? (
        <View style={{ marginTop: espaco.ml, alignSelf: 'stretch' }}>
          <BotaoPrincipal
            rotulo={acao.rotulo}
            onPress={acao.onPress}
            variante={acao.cheio ? 'cheio' : 'contorno'}
          />
        </View>
      ) : null}
    </View>
  );
}

/** Faixa de aviso (amarelo) ou erro (coral) dentro da tela. */
export function Aviso({ mensagem, tom = 'aviso' }: { mensagem: string; tom?: 'aviso' | 'erro' }) {
  const c = tom === 'erro' ? cor.negativo : cor.aviso;
  return (
    <View
      style={[estilos.aviso, { borderColor: c }]}
      accessible
      accessibilityLiveRegion={tom === 'erro' ? 'polite' : 'none'}
      accessibilityRole={tom === 'erro' ? 'alert' : undefined}
    >
      <Text style={[texto.subtitulo, { color: c }]}>{mensagem}</Text>
    </View>
  );
}

/**
 * Carregando: esqueleto com a forma da lista, nunca spinner nem tela em branco.
 * A maré (pulso de opacidade) só roda se o aparelho não pediu movimento reduzido.
 */
export function Esqueleto({ linhas = 3 }: { linhas?: number }) {
  const [opacidade] = useState(() => new Animated.Value(1));
  const [reduzido, setReduzido] = useState(true);

  useEffect(() => {
    let ativo = true;
    AccessibilityInfo.isReduceMotionEnabled().then((r) => ativo && setReduzido(r));
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (reduzido) return;
    const mare = Animated.loop(
      Animated.sequence([
        Animated.timing(opacidade, { toValue: 0.55, duration: 1200, useNativeDriver: true }),
        Animated.timing(opacidade, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ]),
    );
    mare.start();
    return () => mare.stop();
  }, [reduzido, opacidade]);

  return (
    <View style={estilos.esqueleto} accessibilityLabel="Carregando" accessibilityRole="progressbar">
      <Animated.View style={[estilos.osso, estilos.ossoCurto, { opacity: opacidade }]} />
      {Array.from({ length: linhas }, (_, i) => (
        <Animated.View key={i} style={[estilos.osso, { opacity: opacidade }]} />
      ))}
    </View>
  );
}

export interface EstadoErroProps {
  /** Mensagem já traduzida (ver mensagemDeErro). */
  mensagem: string;
  onTentarDeNovo?: () => void;
}

/** Erro que impede a tela: explica o que houve e oferece o caminho. */
export function EstadoErro({ mensagem, onTentarDeNovo }: EstadoErroProps) {
  return (
    <View>
      <Aviso mensagem={mensagem} tom="erro" />
      {onTentarDeNovo ? (
        <View style={{ marginHorizontal: espaco.l }}>
          <BotaoPrincipal rotulo="Tentar de novo" onPress={onTentarDeNovo} />
        </View>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  vazio: { marginVertical: espaco.xl, marginHorizontal: espaco.l, alignItems: 'center' },
  vazioTexto: { ...texto.subtitulo, fontSize: 14.5, lineHeight: 22, textAlign: 'center' },
  aviso: {
    marginHorizontal: espaco.l,
    marginBottom: espaco.m,
    paddingHorizontal: espaco.l,
    paddingVertical: espaco.m,
    borderRadius: raio.controle,
    borderWidth: 1,
  },
  esqueleto: { marginHorizontal: espaco.l, marginBottom: espaco.m, gap: espaco.sm },
  osso: { backgroundColor: cor.superficie, borderRadius: raio.controle, height: 56 },
  ossoCurto: { height: 24, width: '55%' },
});
