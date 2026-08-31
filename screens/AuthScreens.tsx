import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Botao, Campo, Cartao, Chave, useTema } from '../components/ui';
import { Logotipo, Marca } from '../components/Logo';
import { useApp } from '../lib/store';
import { PAPEIS, Papel } from '../lib/data';
import { cores, serif } from '../lib/theme';

/* -------------------------------------------------------------------- LOGIN */
export function LoginScreen({
  irParaRecuperar, irParaConvite,
}: { irParaRecuperar: () => void; irParaConvite: () => void }) {
  const t = useTema();
  const app = useApp();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(true);
  const [ocultar, setOcultar] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const contas: { papel: Papel; email: string }[] = [
    { papel: 'administrador', email: 'marta@cuidadosderaiz.pt' },
    { papel: 'enfermeiro', email: 'rui@cuidadosderaiz.pt' },
    { papel: 'profissional', email: 'ines@cuidadosderaiz.pt' },
    { papel: 'gestor', email: 'carla@cuidadosderaiz.pt' },
  ];

  const entrar = () => {
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha o email e a palavra-passe para continuar.');
      return;
    }
    setCarregando(true);
    setTimeout(() => {
      const erroLogin = app.entrar(email, senha, lembrar);
      setErro(erroLogin);
      setCarregando(false);
    }, 550);
  };

  return (
    <LinearGradient colors={[cores.verdeEscuro, cores.verdeEscuro2]} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ padding: 22, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40, flexGrow: 1, justifyContent: 'center', maxWidth: 480, width: '100%', alignSelf: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignItems: 'center', marginBottom: 26 }}>
            <Logotipo tamanho={74} tom="claro" centralizado />
          </View>

          <Cartao style={{ padding: 22 }}>
            <Text style={{ color: t.texto, fontFamily: serif, fontSize: 21, fontWeight: '700' }}>Entrar na plataforma</Text>
            <Text style={{ color: t.textoMedia, fontSize: 13, marginTop: 5, marginBottom: 18, lineHeight: 19 }}>
              Acesso seguro à prestação de cuidados de enfermagem ao domicílio.
            </Text>

            <Campo rotulo="Email" valor={email} onChangeText={setEmail} icone="mail-outline" teclado="email-address" autoCapitalize="none" placeholder="nome@cuidadosderaiz.pt" />
            <Campo rotulo="Palavra-passe" valor={senha} onChangeText={setSenha} icone="lock-closed-outline" secureTextEntry={ocultar} autoCapitalize="none" placeholder="••••••" />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <Chave ativo={lembrar} onToggle={() => setLembrar(!lembrar)} rotulo="Manter sessão iniciada" />
              </View>
              <Pressable onPress={() => setOcultar(!ocultar)} hitSlop={10}>
                <Ionicons name={ocultar ? 'eye-outline' : 'eye-off-outline'} size={19} color={t.textoFraca} />
              </Pressable>
            </View>

            {erro ? (
              <View style={{ backgroundColor: '#F6E2DC', borderRadius: 12, padding: 11, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="alert-circle" size={16} color="#8E3423" />
                <Text style={{ color: '#8E3423', fontSize: 12.5, flex: 1 }}>{erro}</Text>
              </View>
            ) : null}

            <Botao titulo="Entrar" icone="log-in-outline" full onPress={entrar} carregando={carregando} />

            <Pressable onPress={irParaRecuperar} style={{ alignSelf: 'center', marginTop: 16 }}>
              <Text style={{ color: t.primaria, fontSize: 13, fontWeight: '700' }}>Esqueci-me da palavra-passe</Text>
            </Pressable>

            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.linha, marginVertical: 18 }} />

            <View style={{ backgroundColor: t.begeSuave, borderRadius: 14, padding: 14 }}>
              <Text style={{ color: t.textoMedia, fontSize: 12, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>
                Contas de demonstração
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {contas.map((c) => (
                  <Pressable
                    key={c.papel}
                    onPress={() => {
                      setEmail(c.email);
                      setSenha('123456');
                      setErro(null);
                    }}
                    style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: t.superficie, borderWidth: 1, borderColor: t.linha }}
                  >
                    <Text style={{ color: t.texto, fontSize: 12, fontWeight: '700' }}>
                      {PAPEIS.filter((p) => p.id === c.papel)[0].nome}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text style={{ color: t.textoFraca, fontSize: 11.5, marginTop: 10 }}>Palavra-passe de todas as contas: 123456</Text>
            </View>
          </Cartao>

          <Pressable onPress={irParaConvite} style={{ marginTop: 18, alignItems: 'center' }}>
            <Text style={{ color: 'rgba(243,235,218,0.9)', fontSize: 13 }}>
              Ainda não tem acesso? <Text style={{ color: cores.bege, fontWeight: '700' }}>Registo por convite</Text>
            </Text>
          </Pressable>

          <Text style={{ color: 'rgba(243,235,218,0.6)', fontSize: 11.5, textAlign: 'center', marginTop: 22 }}>
            Cuidado no conforto do lar · CUIDADOS DE RAIZ
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/* ------------------------------------------------------------- RECUPERAR */
export function RecuperarScreen({ voltar }: { voltar: () => void }) {
  const t = useTema();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const enviar = () => {
    if (!email.includes('@')) {
      setErro('Indique um email válido para receber as instruções.');
      return;
    }
    setErro(null);
    setEnviado(true);
  };

  return (
    <LinearGradient colors={[cores.verdeEscuro, cores.verdeEscuro2]} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 22, paddingTop: insets.top + 26, flexGrow: 1, maxWidth: 480, width: '100%', alignSelf: 'center', justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Logotipo tamanho={60} tom="claro" centralizado />
          </View>
          <Cartao style={{ padding: 22 }}>
            <Text style={{ color: t.texto, fontFamily: serif, fontSize: 20, fontWeight: '700' }}>Recuperar palavra-passe</Text>
            <Text style={{ color: t.textoMedia, fontSize: 13, marginTop: 6, marginBottom: 18, lineHeight: 19 }}>
              Enviaremos instruções seguras para o email registado na plataforma.
            </Text>
            {enviado ? (
              <View style={{ backgroundColor: t.primariaSuave, borderRadius: 14, padding: 14, marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Ionicons name="checkmark-circle" size={18} color={t.primaria} />
                  <Text style={{ color: t.primaria, fontWeight: '800', fontSize: 13.5 }}>Instruções enviadas</Text>
                </View>
                <Text style={{ color: t.textoMedia, fontSize: 12.5, lineHeight: 19 }}>
                  Se existir uma conta associada a <Text style={{ fontWeight: '700' }}>{email}</Text>, receberá um email com as instruções de reposição em poucos minutos.
                </Text>
              </View>
            ) : (
              <View>
                <Campo rotulo="Email profissional" valor={email} onChangeText={setEmail} icone="mail-outline" teclado="email-address" autoCapitalize="none" placeholder="nome@cuidadosderaiz.pt" />
                {erro ? (
                  <View style={{ backgroundColor: '#F6E2DC', borderRadius: 12, padding: 11, marginBottom: 14 }}>
                    <Text style={{ color: '#8E3423', fontSize: 12.5 }}>{erro}</Text>
                  </View>
                ) : null}
                <Botao titulo="Enviar instruções" icone="send-outline" full onPress={enviar} />
              </View>
            )}
            <View style={{ height: 16 }} />
            <Botao titulo="Voltar ao início" icone="arrow-back" tipo="fantasma" full onPress={voltar} />
          </Cartao>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/* --------------------------------------------------------- REGISTO CONVITE */
export function ConviteScreen({ voltar }: { voltar: () => void }) {
  const t = useTema();
  const app = useApp();
  const insets = useSafeAreaInsets();

  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const convite = app.convites.filter((c) => c.codigo.toUpperCase() === codigo.trim().toUpperCase() && !c.usado)[0] || null;

  const registar = () => {
    if (!convite) {
      setErro('Introduza um código de convite válido e por utilizar.');
      return;
    }
    setCarregando(true);
    setTimeout(() => {
      const erroRegisto = app.registarPorConvite(codigo, nome || convite.nome, email || convite.email, senha);
      setErro(erroRegisto);
      setCarregando(false);
    }, 550);
  };

  return (
    <LinearGradient colors={[cores.verdeEscuro, cores.verdeEscuro2]} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 22, paddingTop: insets.top + 26, paddingBottom: insets.bottom + 40, flexGrow: 1, maxWidth: 480, width: '100%', alignSelf: 'center', justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Logotipo tamanho={60} tom="claro" centralizado />
          </View>
          <Cartao style={{ padding: 22 }}>
            <Text style={{ color: t.texto, fontFamily: serif, fontSize: 20, fontWeight: '700' }}>Registo por convite</Text>
            <Text style={{ color: t.textoMedia, fontSize: 13, marginTop: 6, marginBottom: 18, lineHeight: 19 }}>
              O acesso à plataforma é atribuído pela administração. Introduza o código de convite que recebeu.
            </Text>

            <Campo rotulo="Código de convite" valor={codigo} onChangeText={(v) => setCodigo(v.toUpperCase())} icone="key-outline" autoCapitalize="characters" placeholder="RAIZ-ENF-2025" />

            {convite ? (
              <View style={{ backgroundColor: t.primariaSuave, borderRadius: 14, padding: 13, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="checkmark-circle" size={18} color={t.primaria} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: t.primaria, fontSize: 12.5, fontWeight: '800' }}>Convite válido</Text>
                  <Text style={{ color: t.textoMedia, fontSize: 12, marginTop: 2 }}>
                    Perfil: {PAPEIS.filter((p) => p.id === convite.papel)[0].nome} · {convite.nome}
                  </Text>
                </View>
              </View>
            ) : null}

            <Campo rotulo="Nome completo" valor={nome} onChangeText={setNome} icone="person-outline" placeholder={convite ? convite.nome : 'O seu nome'} />
            <Campo rotulo="Email" valor={email} onChangeText={setEmail} icone="mail-outline" teclado="email-address" autoCapitalize="none" placeholder={convite ? convite.email : 'nome@cuidadosderaiz.pt'} />
            <Campo rotulo="Palavra-passe (mín. 6 caracteres)" valor={senha} onChangeText={setSenha} icone="lock-closed-outline" secureTextEntry autoCapitalize="none" placeholder="••••••" />

            {erro ? (
              <View style={{ backgroundColor: '#F6E2DC', borderRadius: 12, padding: 11, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="alert-circle" size={16} color="#8E3423" />
                <Text style={{ color: '#8E3423', fontSize: 12.5, flex: 1 }}>{erro}</Text>
              </View>
            ) : null}

            <Botao titulo="Criar conta e entrar" icone="person-add-outline" full onPress={registar} carregando={carregando} />

            <View style={{ backgroundColor: t.begeSuave, borderRadius: 14, padding: 13, marginTop: 16 }}>
              <Text style={{ color: t.textoMedia, fontSize: 11.5, lineHeight: 18 }}>
                Convites disponíveis nesta demonstração:{' '}
                <Text style={{ fontWeight: '800' }}>{app.convites.filter((c) => !c.usado).map((c) => c.codigo).join(' · ') || 'nenhum'}</Text>
              </Text>
            </View>

            <View style={{ height: 14 }} />
            <Botao titulo="Já tenho conta" icone="arrow-back" tipo="fantasma" full onPress={voltar} />
          </Cartao>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/* ------------------------------------------------------------------ SPLASH */
export function SplashScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: cores.verdeEscuro, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ alignItems: 'center' }}>
        <Marca tamanho={104} />
        <Text style={{ color: '#F3EBDA', fontFamily: serif, fontSize: 19, fontWeight: '700', letterSpacing: 2, marginTop: 22 }}>
          CUIDADOS DE RAIZ
        </Text>
        <Text style={{ color: cores.bege, fontSize: 12, letterSpacing: 1, marginTop: 6 }}>Cuidado no conforto do lar</Text>
      </View>
    </View>
  );
}
