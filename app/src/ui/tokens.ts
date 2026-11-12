/**
 * Tokens do protótipo aprovado (identidade CEUAI, azul de Yemanjá), nomeados pelo papel.
 * Fonte: seção Design do Notion. Nunca use cor ou medida solta numa tela: use estes nomes.
 */
export const cor = {
  /** Fundo atrás da tela (barra de status). */
  fundo: '#0A1420',
  /** Fundo da tela; nunca branco puro (Lista de Proibições). */
  tela: '#101B29',
  superficie: '#1A2939',
  /** Feedback de toque (estado pressed). Mobile não tem hover. */
  superficiePressionada: '#223346',
  borda: '#2C3F53',
  texto: '#EAF2F7',
  textoSecundario: '#93A7B8',
  acento: '#3FB8E8',
  acentoBorda: '#1E7FAA',
  textoSobreAcento: '#052236',
  /** Aviso, sem conexão, finalizar. */
  aviso: '#E8C43D',
  /** Presente, ativa. */
  positivo: '#5FA88A',
  /** Ausente, cancelar, erro. */
  negativo: '#C96A55',
  /** Véu atrás de folhas e diálogos. */
  veu: 'rgba(5,15,25,0.72)',
} as const;

/** Raio é decisão de identidade (fluidez de água), não default de template. */
export const raio = {
  pequeno: 8,
  pill: 9,
  controle: 12,
  cartao: 16,
  destaque: 20,
  tela: 24,
} as const;

export const espaco = {
  xxs: 4,
  xs: 6,
  s: 8,
  sm: 10,
  m: 12,
  ml: 14,
  l: 16,
  xl: 24,
} as const;

/** Alvos de toque generosos: a gira é de pé, com pressa e pouca luz. */
export const toque = {
  minimo: 44,
  linha: 56,
  campo: 52,
  pill: 40,
} as const;

/** Bricolage Grotesque para títulos e números de destaque; Archivo para o resto. */
export const fonte = {
  titulo: 'BricolageGrotesque_700Bold',
  corpo: 'Archivo_400Regular',
  corpoMedio: 'Archivo_500Medium',
  corpoForte: 'Archivo_600SemiBold',
  corpoNegrito: 'Archivo_700Bold',
} as const;

export const texto = {
  titulo: { fontFamily: fonte.titulo, fontSize: 21, lineHeight: 24, color: cor.texto },
  tituloFolha: { fontFamily: fonte.titulo, fontSize: 17, color: cor.texto },
  numeroDestaque: { fontFamily: fonte.titulo, fontSize: 26, color: cor.texto },
  corpo: { fontFamily: fonte.corpo, fontSize: 16, color: cor.texto },
  nome: { fontFamily: fonte.corpoForte, fontSize: 16, color: cor.texto },
  subtitulo: { fontFamily: fonte.corpo, fontSize: 13.5, color: cor.textoSecundario },
  detalhe: {
    fontFamily: fonte.corpo,
    fontSize: 12.5,
    color: cor.textoSecundario,
    fontVariant: ['tabular-nums' as const],
  },
  rotulo: { fontFamily: fonte.corpoForte, fontSize: 12.5, color: cor.textoSecundario },
} as const;
