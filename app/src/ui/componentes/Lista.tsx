import { Children, Fragment, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { cor, espaco, raio, texto, toque } from '../tokens';

/** Cartão que agrupa linhas, com divisória entre elas. */
export function Grupo({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const itens = Children.toArray(children).filter(Boolean);
  return (
    <View style={[estilos.grupo, style]}>
      {itens.map((item, i) => (
        <Fragment key={i}>
          {i > 0 ? <View style={estilos.divisoria} /> : null}
          {item}
        </Fragment>
      ))}
    </View>
  );
}

/** Título de seção acima de um grupo, com contagem opcional à direita. */
export function Secao({ titulo, direita }: { titulo: string; direita?: string }) {
  return (
    <View style={estilos.secao}>
      <Text style={texto.rotulo}>{titulo}</Text>
      {direita ? <Text style={texto.rotulo}>{direita}</Text> : null}
    </View>
  );
}

export interface LinhaProps {
  titulo: string;
  detalhe?: string | null;
  /** Elementos à direita (pill, botões) ou abaixo, quando em coluna. */
  acessorio?: ReactNode;
  /** Ações em fileira abaixo do texto (presença, giras, consultas). */
  coluna?: boolean;
  onPress?: () => void;
  /** Cor do título, para linhas de ação como "Adicionar opção". */
  destaque?: boolean;
  accessibilityLabel?: string;
}

/** Linha de lista: toque inteiro quando tem onPress; feedback por estado pressed. */
export function Linha({
  titulo,
  detalhe,
  acessorio,
  coluna,
  onPress,
  destaque,
  accessibilityLabel,
}: LinhaProps) {
  const conteudo = (
    <>
      <View style={coluna ? undefined : estilos.cresce}>
        <Text style={[texto.nome, destaque && { color: cor.acento }]}>{titulo}</Text>
        {detalhe ? <Text style={texto.detalhe}>{detalhe}</Text> : null}
      </View>
      {acessorio ? (
        <View style={coluna ? estilos.acoesColuna : estilos.acessorio}>{acessorio}</View>
      ) : null}
    </>
  );
  const estilo = [estilos.linha, coluna && estilos.coluna];
  if (!onPress) return <View style={estilo}>{conteudo}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [...estilo, pressed && estilos.pressionado]}
    >
      {conteudo}
    </Pressable>
  );
}

export type TomPill = 'neutro' | 'positivo' | 'negativo' | 'acento' | 'aviso';

const corDoTom: Record<TomPill, string> = {
  neutro: cor.textoSecundario,
  positivo: cor.positivo,
  negativo: cor.negativo,
  acento: cor.acento,
  aviso: cor.aviso,
};

export interface PillProps {
  rotulo: string;
  tom?: TomPill;
  /** Com onPress vira botão (alvo de toque maior). */
  onPress?: () => void;
  desabilitado?: boolean;
  /** Ocupa o espaço disponível numa fileira de ações. */
  expandir?: boolean;
  accessibilityLabel?: string;
}

/** Selo de estado ou botão compacto (Presente, Ativar, Ao topo...). */
export function Pill({
  rotulo,
  tom = 'neutro',
  onPress,
  desabilitado,
  expandir,
  accessibilityLabel,
}: PillProps) {
  const c = corDoTom[tom];
  const borda = tom === 'neutro' ? cor.borda : c;
  const rot = <Text style={[estilos.pillTexto, { color: c }]}>{rotulo}</Text>;
  if (!onPress) {
    return <View style={[estilos.pill, { borderColor: borda }]}>{rot}</View>;
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!desabilitado }}
      disabled={desabilitado}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.pill,
        estilos.pillBotao,
        { borderColor: borda },
        expandir && { flex: 1 },
        pressed && estilos.pressionado,
        desabilitado && { opacity: 0.3 },
      ]}
    >
      {rot}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  grupo: {
    marginHorizontal: espaco.l,
    marginBottom: espaco.m,
    backgroundColor: cor.superficie,
    borderWidth: 1,
    borderColor: cor.borda,
    borderRadius: raio.cartao,
    overflow: 'hidden',
  },
  divisoria: { height: 1, backgroundColor: cor.borda },
  secao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: espaco.l,
    paddingTop: espaco.l,
    paddingBottom: espaco.xs,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.m,
    paddingHorizontal: espaco.l,
    paddingVertical: espaco.ml,
    minHeight: toque.linha,
  },
  coluna: { flexDirection: 'column', alignItems: 'stretch' },
  cresce: { flex: 1, minWidth: 0 },
  acessorio: { flexDirection: 'row', alignItems: 'center', gap: espaco.s },
  acoesColuna: { flexDirection: 'row', gap: espaco.s },
  pressionado: { backgroundColor: cor.superficiePressionada },
  pill: {
    borderWidth: 1,
    borderRadius: raio.pill,
    paddingHorizontal: espaco.sm,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBotao: { minHeight: toque.pill, paddingHorizontal: espaco.m, paddingVertical: espaco.s },
  pillTexto: { fontFamily: 'Archivo_700Bold', fontSize: 11.5 },
});
