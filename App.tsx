import React, { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';

import { TemaCtx } from './components/ui';
import { Shell } from './components/Shell';
import { AppProvider, useApp } from './lib/store';
import { temaClaro, temaEscuro } from './lib/theme';
import { LoginScreen, RecuperarScreen, ConviteScreen, SplashScreen } from './screens/AuthScreens';
import { UtenteDetalheScreen } from './screens/UtenteDetalheScreen';
import { ChatScreen } from './screens/ChatScreen';
import { NovaVisitaScreen } from './screens/NovaVisitaScreen';

const Pilha = createNativeStackNavigator();

type ParamsAuth = undefined;
type ParamsApp = { id?: string; utenteId?: string };

function AuthStack() {
  return (
    <Pilha.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: temaClaro.fundo } }}>
      <Pilha.Screen name="Login">{({ navigation }) => (
        <LoginScreen
          irParaRecuperar={() => navigation.navigate('Recuperar' as never)}
          irParaConvite={() => navigation.navigate('Convite' as never)}
        />
      )}</Pilha.Screen>
      <Pilha.Screen name="Recuperar">{({ navigation }) => <RecuperarScreen voltar={() => navigation.goBack()} />}</Pilha.Screen>
      <Pilha.Screen name="Convite">{({ navigation }) => <ConviteScreen voltar={() => navigation.goBack()} />}</Pilha.Screen>
    </Pilha.Navigator>
  );
}

function AppStack() {
  return (
    <Pilha.Navigator screenOptions={{ headerShown: false }}>
      <Pilha.Screen name="Shell">{({ navigation }) => (
        <Shell
          irParaUtente={(id) => navigation.navigate('Utente' as never, { id } as never)}
          irParaConversa={(id) => navigation.navigate('Conversa' as never, { id } as never)}
          novaVisita={(utenteId) => navigation.navigate('NovaVisita' as never, utenteId ? { utenteId } : {} as never)}
        />
      )}</Pilha.Screen>
      <Pilha.Screen name="Utente">{({ route, navigation }) => {
        const params = (route.params || {}) as ParamsApp;
        return <UtenteDetalheScreen utenteId={params.id || 'u1'} voltar={() => navigation.goBack()} />;
      }}</Pilha.Screen>
      <Pilha.Screen name="Conversa">{({ route, navigation }) => {
        const params = (route.params || {}) as ParamsApp;
        return <ChatScreen conversaId={params.id || 'cv1'} voltar={() => navigation.goBack()} />;
      }}</Pilha.Screen>
      <Pilha.Screen name="NovaVisita" options={{ presentation: 'modal' }}>{({ route, navigation }) => {
        const params = (route.params || {}) as ParamsApp;
        return <NovaVisitaScreen utenteInicial={params.utenteId} voltar={() => navigation.goBack()} />;
      }}</Pilha.Screen>
    </Pilha.Navigator>
  );
}

function Raiz() {
  const app = useApp();
  const esquema = useColorScheme();

  const escuro = app.definicoes.tema === 'escuro' || (app.definicoes.tema === 'sistema' && esquema === 'dark');
  const tema = escuro ? temaEscuro : temaClaro;

  const navegacao = useMemo(() => (escuro
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: tema.fundo, card: tema.superficie, primary: tema.primaria, text: tema.texto, border: tema.linha } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: tema.fundo, card: tema.superficie, primary: tema.primaria, text: tema.texto, border: tema.linha } }), [escuro, tema]);

  if (!app.pronto) {
    return <SplashScreen />;
  }

  return (
    <TemaCtx.Provider value={tema}>
      <NavigationContainer theme={navegacao}>
        <StatusBar style={escuro ? 'light' : 'dark'} />
        {app.utilizador ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </TemaCtx.Provider>
  );
}

export default function App() {
  const [fontesCarregadas] = useFonts({ ...Ionicons.font });

  if (!fontesCarregadas) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <Raiz />
      </AppProvider>
    </SafeAreaProvider>
  );
}

export type { ParamsAuth, ParamsApp };
