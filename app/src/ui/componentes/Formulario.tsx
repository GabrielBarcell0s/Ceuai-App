import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { cor, espaco, fonte, raio, texto, toque } from '../tokens';
import { Folha } from './Folhas';
import { Grupo, Linha } from './Lista';

export interface CampoProps extends Omit<TextInputProps, 'style'> {
  rotulo: string;
  erro?: string | null;
}

/** Campo de texto com rótulo acima, como nos formulários do protótipo. */
export function Campo({ rotulo, erro, ...input }: CampoProps) {
  const [focado, setFocado] = useState(false);
  return (
    <View style={estilos.campo}>
      <Text style={texto.rotulo}>{rotulo}</Text>
      <TextInput
        accessibilityLabel={rotulo}
        placeholderTextColor={cor.textoSecundario}
        {...input}
        onFocus={(e) => {
          setFocado(true);
          input.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocado(false);
          input.onBlur?.(e);
        }}
        style={[
          estilos.entrada,
          focado && { borderColor: cor.acento },
          erro && { borderColor: cor.negativo },
        ]}
      />
      {erro ? <Text style={[texto.detalhe, { color: cor.negativo }]}>{erro}</Text> : null}
    </View>
  );
}

export interface OpcaoSelecao {
  valor: string;
  rotulo: string;
}

export interface SelecaoProps {
  rotulo: string;
  opcoes: readonly OpcaoSelecao[];
  valor: string | null;
  onMudar: (valor: string) => void;
  /** Texto quando nada foi escolhido. */
  vazio?: string;
}

/** Escolha de uma opção de lista (papel, médium, tipo de gira, obrigação, missão). */
export function Selecao({ rotulo, opcoes, valor, onMudar, vazio = 'Escolher' }: SelecaoProps) {
  const [aberta, setAberta] = useState(false);
  const atual = opcoes.find((o) => o.valor === valor);
  return (
    <View style={estilos.campo}>
      <Text style={texto.rotulo}>{rotulo}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${rotulo}: ${atual?.rotulo ?? vazio}`}
        onPress={() => setAberta(true)}
        style={({ pressed }) => [
          estilos.entrada,
          estilos.selecao,
          pressed && { backgroundColor: cor.superficiePressionada },
        ]}
      >
        <Text style={[texto.corpo, !atual && { color: cor.textoSecundario }]}>
          {atual?.rotulo ?? vazio}
        </Text>
      </Pressable>
      <Folha visivel={aberta} titulo={rotulo} onFechar={() => setAberta(false)}>
        <Grupo>
          {opcoes.map((o) => (
            <Linha
              key={o.valor}
              titulo={o.rotulo}
              destaque={o.valor === valor}
              onPress={() => {
                onMudar(o.valor);
                setAberta(false);
              }}
            />
          ))}
        </Grupo>
      </Folha>
    </View>
  );
}

const estilos = StyleSheet.create({
  campo: { gap: espaco.xs, paddingHorizontal: espaco.l, paddingVertical: espaco.m },
  entrada: {
    backgroundColor: cor.tela,
    borderWidth: 1,
    borderColor: cor.borda,
    borderRadius: raio.controle,
    color: cor.texto,
    fontFamily: fonte.corpo,
    fontSize: 16,
    padding: espaco.ml,
    minHeight: toque.campo,
  },
  selecao: { justifyContent: 'center' },
});
