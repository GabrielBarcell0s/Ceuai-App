import {
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
} from '@expo-google-fonts/archivo';
import { BricolageGrotesque_700Bold } from '@expo-google-fonts/bricolage-grotesque';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RepositoriosProvider, SessaoProvider } from '@/data/react';
import { criarRepositorios } from '@/data/repositories';
import { cor } from '@/ui/tokens';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontesProntas] = useFonts({
    BricolageGrotesque_700Bold,
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
    Archivo_700Bold,
  });
  const repositorios = useMemo(() => criarRepositorios(), []);

  useEffect(() => {
    if (fontesProntas) SplashScreen.hideAsync();
  }, [fontesProntas]);

  // A splash do Android cobre a carga das fontes: sem tela branca nem troca de fonte visível.
  if (!fontesProntas) return null;

  return (
    <SafeAreaProvider>
      <RepositoriosProvider repositorios={repositorios}>
        <SessaoProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cor.tela } }}
          />
        </SessaoProvider>
      </RepositoriosProvider>
    </SafeAreaProvider>
  );
}
