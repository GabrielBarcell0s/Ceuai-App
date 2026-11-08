import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { cor, espaco, raio, texto } from '../tokens';
import { BotaoPrincipal, BotaoSecundario } from './Botoes';

export interface FolhaProps {
  visivel: boolean;
  titulo: string;
  onFechar: () => void;
  children?: ReactNode;
  /** Botões ao pé da folha. */
  acoes?: ReactNode;
  /** Centralizada (diálogo de confirmação) em vez de presa embaixo. */
  dialogo?: boolean;
}

/** Folha que sobe do pé da tela (formulários) ou diálogo central (confirmações). */
export function Folha({ visivel, titulo, onFechar, children, acoes, dialogo }: FolhaProps) {
  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onFechar}
      statusBarTranslucent
    >
      <View style={[estilos.veu, dialogo ? estilos.veuDialogo : estilos.veuFolha]}>
        <Pressable style={StyleSheet.absoluteFill} accessibilityLabel="Fechar" onPress={onFechar} />
        <View style={dialogo ? estilos.dialogo : estilos.folha} accessibilityViewIsModal>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={[texto.tituloFolha, estilos.titulo]} accessibilityRole="header">
              {titulo}
            </Text>
            {children}
            {acoes ? <View style={estilos.acoes}>{acoes}</View> : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/** Parágrafo dentro de folha ou diálogo. */
export function TextoFolha({ children, mudo }: { children: ReactNode; mudo?: boolean }) {
  return <Text style={[estilos.texto, mudo && { color: cor.textoSecundario }]}>{children}</Text>;
}

export interface ConfirmacaoProps {
  visivel: boolean;
  titulo: string;
  /** O que a confirmação mostra antes de agir (pendências, consequência). */
  children?: ReactNode;
  rotuloConfirmar: string;
  /** Ação que encerra ou apaga algo: botão em tom de perigo. */
  perigo?: boolean;
  enviando?: boolean;
  onConfirmar: () => void;
  onVoltar: () => void;
}

/** Diálogo de confirmação: finalizar, cancelar, remover, marcar ausente. */
export function Confirmacao({
  visivel,
  titulo,
  children,
  rotuloConfirmar,
  perigo,
  enviando,
  onConfirmar,
  onVoltar,
}: ConfirmacaoProps) {
  return (
    <Folha
      visivel={visivel}
      titulo={titulo}
      onFechar={onVoltar}
      dialogo
      acoes={
        <>
          <BotaoPrincipal
            rotulo={rotuloConfirmar}
            variante={perigo ? 'perigo' : 'cheio'}
            enviando={enviando}
            onPress={onConfirmar}
          />
          <BotaoSecundario rotulo="Voltar" onPress={onVoltar} />
        </>
      }
    >
      {children}
    </Folha>
  );
}

const estilos = StyleSheet.create({
  veu: { flex: 1, backgroundColor: cor.veu },
  veuFolha: { justifyContent: 'flex-end' },
  veuDialogo: { justifyContent: 'center', paddingHorizontal: 20 },
  folha: {
    backgroundColor: cor.superficie,
    borderTopWidth: 1,
    borderTopColor: cor.acento,
    borderTopLeftRadius: raio.destaque,
    borderTopRightRadius: raio.destaque,
    paddingVertical: espaco.l,
    maxHeight: '80%',
  },
  dialogo: {
    backgroundColor: cor.superficie,
    borderWidth: 1,
    borderColor: cor.borda,
    borderRadius: raio.destaque,
    paddingVertical: espaco.l,
    maxHeight: '80%',
  },
  titulo: { marginHorizontal: espaco.l, marginBottom: espaco.sm },
  texto: {
    ...texto.corpo,
    fontSize: 13.5,
    lineHeight: 21,
    marginHorizontal: espaco.l,
    marginBottom: espaco.sm,
  },
  acoes: { gap: espaco.sm, marginTop: espaco.m, marginHorizontal: espaco.l },
});
