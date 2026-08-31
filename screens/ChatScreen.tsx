import React, { useMemo, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, BotaoIcone, useTema } from '../components/ui';
import { useApp } from '../lib/store';
import { serif } from '../lib/theme';

export function ChatScreen({ conversaId, voltar }: { conversaId: string; voltar: () => void }) {
  const t = useTema();
  const app = useApp();
  const insets = useSafeAreaInsets();
  const [texto, setTexto] = useState('');

  const conversa = useMemo(() => app.conversas.filter((c) => c.id === conversaId)[0], [app.conversas, conversaId]);
  const mensagens = useMemo(() => [...conversa.mensagens].reverse(), [conversa.mensagens]);

  const enviar = () => {
    const limpo = texto.trim();
    if (!limpo) return;
    app.enviarMensagem(conversaId, limpo);
    setTexto('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.fundo }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[estilos.topo, { paddingTop: insets.top + 12, borderBottomColor: t.linha, backgroundColor: t.superficie }]}>
        <BotaoIcone icone="arrow-back" onPress={voltar} />
        <Avatar nome={conversa.nome} tamanho={38} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ color: t.texto, fontFamily: serif, fontSize: 16, fontWeight: '700' }}>{conversa.nome}</Text>
          <Text style={{ color: t.textoMedia, fontSize: 11.5, marginTop: 1 }}>{conversa.papel}</Text>
        </View>
        <BotaoIcone icone="videocam-outline" />
      </View>

      <FlatList
        data={mensagens}
        inverted
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
        renderItem={({ item }) => {
          const meu = item.de === 'eu';
          return (
            <View style={{ alignItems: meu ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
              <View
                style={{
                  maxWidth: '82%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18,
                  backgroundColor: meu ? t.primaria : t.superficie,
                  borderTopRightRadius: meu ? 6 : 18, borderTopLeftRadius: meu ? 18 : 6,
                  borderWidth: meu ? 0 : StyleSheet.hairlineWidth, borderColor: t.linha,
                }}
              >
                <Text style={{ color: meu ? '#F7F5EE' : t.texto, fontSize: 13.5, lineHeight: 19 }}>{item.texto}</Text>
                <Text style={{ color: meu ? 'rgba(247,245,238,0.75)' : t.textoFraca, fontSize: 10.5, marginTop: 4, alignSelf: 'flex-end' }}>{item.hora}</Text>
              </View>
            </View>
          );
        }}
      />

      <View style={[estilos.barra, { paddingBottom: Math.max(insets.bottom, 12), borderTopColor: t.linha, backgroundColor: t.superficie }]}>
        <TextInput
          value={texto}
          onChangeText={setTexto}
          placeholder="Escreva uma mensagem…"
          placeholderTextColor={t.textoFraca}
          multiline
          style={[estilos.input, { backgroundColor: t.escuro ? t.superficieAlta : '#F3F1E8', color: t.texto }]}
        />
        <Pressable onPress={enviar} style={[estilos.botaoEnviar, { backgroundColor: texto.trim() ? t.primaria : t.linha }]}>
          <Ionicons name="send" size={17} color={texto.trim() ? '#fff' : t.textoFraca} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  topo: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  barra: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 14, paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingTop: 11, paddingBottom: 11, maxHeight: 110, fontSize: 14 },
  botaoEnviar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
