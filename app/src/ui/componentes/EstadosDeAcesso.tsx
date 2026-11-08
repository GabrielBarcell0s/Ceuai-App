import { Text, View } from 'react-native';

import { espaco, texto } from '../tokens';
import { Vazio } from './Estados';

/** Área fora do papel de quem entrou (40). */
export function SemPermissao({ papel, onInicio }: { papel: string; onInicio: () => void }) {
  return (
    <Vazio
      mensagem={`Esta área não faz parte do papel ${papel}.`}
      detalhe="Volte para a tela inicial."
      acao={{ rotulo: 'Ir para a tela inicial', onPress: onInicio }}
    />
  );
}

export interface SemGiraProps {
  mensagem: string;
  /** Só o Manager abre Giras; os outros papéis veem o pedido. */
  podeAbrirGiras: boolean;
  onAbrirGiras: () => void;
}

/** Operação da gira sem gira ativa (40, 100–180): avisa em vez de sumir. */
export function SemGira({ mensagem, podeAbrirGiras, onAbrirGiras }: SemGiraProps) {
  if (podeAbrirGiras) {
    return (
      <Vazio
        mensagem={mensagem}
        acao={{ rotulo: 'Abrir Giras', onPress: onAbrirGiras, cheio: true }}
      />
    );
  }
  return (
    <View>
      <Vazio mensagem={mensagem} />
      <Text style={[texto.detalhe, { textAlign: 'center', marginTop: -espaco.m }]}>
        Peça ao Manager para ativar a gira.
      </Text>
    </View>
  );
}
