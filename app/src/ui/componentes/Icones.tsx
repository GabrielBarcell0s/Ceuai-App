import Svg, { Path } from 'react-native-svg';

import { cor } from '../tokens';

/** Ícones desenhados à mão, como no protótipo (nada de Lucide, Lista de Proibições). */
export function IconeVoltar({ cor: c = cor.texto }: { cor?: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" accessibilityElementsHidden>
      <Path d="M10 2 4 8l6 6" fill="none" stroke={c} strokeWidth={2} />
    </Svg>
  );
}

/** Linha de ondas sob o cabeçalho: o mar da identidade. */
export function Ondas() {
  const d =
    'M0 4 q13 -6 26 0 t26 0 t26 0 t26 0 t26 0 t26 0 t26 0 t26 0 t26 0 t26 0 t26 0 t26 0 t26 0 t26 0 t26 0 t26 0';
  return (
    <Svg
      width="100%"
      height={8}
      viewBox="0 0 412 8"
      preserveAspectRatio="none"
      style={{ opacity: 0.55 }}
      accessibilityElementsHidden
    >
      <Path d={d} fill="none" stroke={cor.acento} strokeWidth={1.5} />
    </Svg>
  );
}
