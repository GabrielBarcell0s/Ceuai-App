import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { checkBackendHealth, type HealthStatus } from '@/data/health';

const LABEL: Record<HealthStatus | 'checking', string> = {
  checking: 'Verificando o servidor',
  ok: 'Servidor alcançado',
  not_configured: 'Servidor não configurado: preencha o .env.local',
  unreachable: 'Sem conexão com o servidor',
};

// Tela provisória do esqueleto: prova que App alcança o Backend pela camada de Dados.
export default function Index() {
  const [status, setStatus] = useState<HealthStatus | 'checking'>('checking');

  useEffect(() => {
    checkBackendHealth().then(setStatus);
  }, []);

  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>CEUAI</Text>
      <Text style={styles.status}>{LABEL[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#101B29' },
  titulo: { color: '#EAF2F7', fontSize: 28, fontWeight: '700' },
  status: { color: '#93A7B8', fontSize: 16, marginTop: 8 },
});
