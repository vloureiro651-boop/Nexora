import React, { createContext, useContext, useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView,
  StyleProp, StyleSheet, Text, TextInput, TextStyle, View, ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Polyline } from 'react-native-svg';
import { Tema, raio, serif, temaClaro } from '../lib/theme';
import { iniciais } from '../lib/formatos';

/* ------------------------------------------------------------------ TEMA */
export const TemaCtx = createContext<Tema>(temaClaro);
export const useTema = (): Tema => useContext(TemaCtx);

/* --------------------------------------------------------------- CARTÃO */
export function Cartao({
  children, style, onPress, tom,
}: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; tom?: 'alto' }) {
  const t = useTema();
  const conteudo = (
    <View
      style={[
        {
          backgroundColor: tom === 'alto' ? t.superficieAlta : t.superficie,
          borderRadius: raio.lg,
          padding: 16,
          borderWidth: t.escuro ? 1 : StyleSheet.hairlineWidth,
          borderColor: t.linha,
        },
        t.sombra,
        style,
      ]}
    >
      {children}
    </View>
  );
  if (!onPress) return conteudo;
  return <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1, borderRadius: raio.lg }]}>{conteudo}</Pressable>;
}

/* -------------------------------------------------------------- ETIQUETA */
const TONS: Record<string, { fundo: string; texto: string }> = {
  verde: { fundo: '#E4EFE7', texto: '#1B5540' },
  bege: { fundo: '#F1E8D6', texto: '#7A5F2A' },
  alerta: { fundo: '#F7EADA', texto: '#96601C' },
  perigo: { fundo: '#F6E2DC', texto: '#8E3423' },
  info: { fundo: '#E2ECF3', texto: '#2F5872' },
  neutro: { fundo: '#EFEDE6', texto: '#5C6B63' },
};

const TONS_ESCUROS: Record<string, { fundo: string; texto: string }> = {
  verde: { fundo: '#1D3128', texto: '#7CC49A' },
  bege: { fundo: '#2C2A20', texto: '#D8C396' },
  alerta: { fundo: '#2F2618', texto: '#E0AC66' },
  perigo: { fundo: '#2F1D19', texto: '#E08B72' },
  info: { fundo: '#182530', texto: '#7FB0CC' },
  neutro: { fundo: '#222A26', texto: '#A9B8AF' },
};

export function Etiqueta({ texto, tom = 'verde', icone }: { texto: string; tom?: keyof typeof TONS | string; icone?: string }) {
  const t = useTema();
  const paleta = (t.escuro ? TONS_ESCUROS : TONS)[tom] || TONS.neutro;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: paleta.fundo, paddingHorizontal: 9, paddingVertical: 4, borderRadius: raio.pilula, alignSelf: 'flex-start' }}>
      {icone ? <Ionicons name={icone as any} size={11} color={paleta.texto} /> : null}
      <Text style={{ color: paleta.texto, fontSize: 11.5, fontWeight: '700', letterSpacing: 0.2 }}>{texto}</Text>
    </View>
  );
}

/* ---------------------------------------------------------------- AVATAR */
const AVATARES = ['#2E7D5B', '#3E6D8E', '#A98C58', '#16503A', '#8E6A4A', '#4E7A63'];

export function Avatar({ nome, tamanho = 42, sub }: { nome: string; tamanho?: number; sub?: string }) {
  const t = useTema();
  let soma = 0;
  for (let i = 0; i < nome.length; i += 1) soma += nome.charCodeAt(i);
  const cor = AVATARES[soma % AVATARES.length];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View style={{ width: tamanho, height: tamanho, borderRadius: raio.pilula, backgroundColor: cor, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#F3EBDA', fontWeight: '700', fontSize: tamanho * 0.36, letterSpacing: 0.5 }}>{iniciais(nome)}</Text>
      </View>
      {sub ? (
        <View>
          <Text style={{ color: t.texto, fontWeight: '600', fontSize: 14.5 }}>{nome}</Text>
          <Text style={{ color: t.textoFraca, fontSize: 12 }}>{sub}</Text>
        </View>
      ) : null}
    </View>
  );
}

/* ---------------------------------------------------------------- BOTÃO */
type BotaoProps = {
  titulo: string; onPress?: () => void; icone?: string; tipo?: 'primario' | 'secundario' | 'fantasma' | 'perigo';
  pequeno?: boolean; style?: StyleProp<ViewStyle>; carregando?: boolean; desativado?: boolean; full?: boolean;
};

export function Botao({ titulo, onPress, icone, tipo = 'primario', pequeno, style, carregando, desativado, full }: BotaoProps) {
  const t = useTema();
  const base: ViewStyle = {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    paddingVertical: pequeno ? 8 : 13, paddingHorizontal: pequeno ? 13 : 20,
    borderRadius: raio.md, opacity: desativado ? 0.5 : 1, alignSelf: full ? 'stretch' : 'flex-start',
  };
  const fundo: ViewStyle =
    tipo === 'primario' ? { backgroundColor: t.primaria }
      : tipo === 'perigo' ? { backgroundColor: t.perigo }
        : tipo === 'secundario' ? { backgroundColor: t.superficie, borderWidth: 1.4, borderColor: t.primaria }
          : { backgroundColor: 'transparent' };
  const corTexto = tipo === 'primario' || tipo === 'perigo' ? '#F7F5EE' : tipo === 'secundario' ? t.primaria : t.textoMedia;

  return (
    <Pressable
      onPress={desativado || carregando ? undefined : onPress}
      style={({ pressed }) => [base, fundo, { transform: [{ scale: pressed ? 0.98 : 1 }] }, style]}
    >
      {carregando ? <ActivityIndicator size="small" color={corTexto} /> : icone ? <Ionicons name={icone as any} size={pequeno ? 14 : 17} color={corTexto} /> : null}
      <Text style={{ color: corTexto, fontWeight: '700', fontSize: pequeno ? 12.5 : 14.5 }}>{titulo}</Text>
    </Pressable>
  );
}

export function BotaoIcone({
  icone, onPress, tom, badge, tamanho = 40,
}: { icone: string; onPress?: () => void; tom?: string; badge?: number; tamanho?: number }) {
  const t = useTema();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{
        width: tamanho, height: tamanho, borderRadius: raio.md, alignItems: 'center', justifyContent: 'center',
        backgroundColor: t.primariaSuave, opacity: pressed ? 0.7 : 1,
      }]}
    >
      <Ionicons name={icone as any} size={tamanho * 0.48} color={tom || t.primaria} />
      {badge ? (
        <View style={{ position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: t.perigo, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
          <Text style={{ color: '#fff', fontSize: 9.5, fontWeight: '700' }}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

/* ----------------------------------------------------------------- CAMPO */
export function Campo({
  rotulo, valor, onChangeText, icone, placeholder, secureTextEntry, teclado, multiline, autoCapitalize = 'sentences', editable = true,
}: {
  rotulo?: string; valor: string; onChangeText: (v: string) => void; icone?: string; placeholder?: string;
  secureTextEntry?: boolean; teclado?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  multiline?: boolean; autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'; editable?: boolean;
}) {
  const t = useTema();
  const [focado, setFocado] = useState(false);
  return (
    <View style={{ marginBottom: 14 }}>
      {rotulo ? <Text style={{ color: t.textoMedia, fontSize: 12.5, fontWeight: '700', marginBottom: 6, letterSpacing: 0.3 }}>{rotulo}</Text> : null}
      <View
        style={{
          flexDirection: 'row', alignItems: multiline ? 'flex-start' : 'center', gap: 8,
          backgroundColor: t.superficie, borderRadius: raio.md, borderWidth: 1.3,
          borderColor: focado ? t.primaria : t.linha, paddingHorizontal: 12, paddingVertical: multiline ? 10 : 0,
          minHeight: multiline ? 92 : 48,
        }}
      >
        {icone ? <Ionicons name={icone as any} size={17} color={focado ? t.primaria : t.textoFraca} style={{ marginTop: multiline ? 2 : 0 }} /> : null}
        <TextInput
          value={valor}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={t.textoFraca}
          secureTextEntry={secureTextEntry}
          keyboardType={teclado}
          multiline={multiline}
          editable={editable}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          style={{ flex: 1, color: t.texto, fontSize: 14.5, paddingVertical: multiline ? 0 : 13, textAlignVertical: multiline ? 'top' : 'center' } as TextStyle}
        />
      </View>
    </View>
  );
}

/* ---------------------------------------------------------- BARRA PESQUISA */
export function BarraPesquisa({ valor, onChangeText, placeholder = 'Pesquisar…' }: { valor: string; onChangeText: (v: string) => void; placeholder?: string }) {
  const t = useTema();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: t.superficie, borderRadius: raio.md, borderWidth: 1, borderColor: t.linha, paddingHorizontal: 12, marginBottom: 14 }}>
      <Ionicons name="search" size={17} color={t.textoFraca} />
      <TextInput
        value={valor}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={t.textoFraca}
        autoCapitalize="none"
        style={{ flex: 1, color: t.texto, fontSize: 14.5, paddingVertical: 12 } as TextStyle}
      />
      {valor ? (
        <Pressable onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={17} color={t.textoFraca} />
        </Pressable>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ CHIP */
export function Chip({ rotulo, ativo, onPress, icone }: { rotulo: string; ativo?: boolean; onPress?: () => void; icone?: string }) {
  const t = useTema();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 13, paddingVertical: 7,
        borderRadius: raio.pilula, borderWidth: 1.2,
        backgroundColor: ativo ? t.primaria : t.superficie,
        borderColor: ativo ? t.primaria : t.linha,
      }}
    >
      {icone ? <Ionicons name={icone as any} size={13} color={ativo ? '#F7F5EE' : t.textoMedia} /> : null}
      <Text style={{ color: ativo ? '#F7F5EE' : t.textoMedia, fontSize: 12.5, fontWeight: '700' }}>{rotulo}</Text>
    </Pressable>
  );
}

/* ------------------------------------------------------------- SEGMENTADO */
export function Segmentado<T extends string>({
  opcoes, valor, onChange,
}: { opcoes: { id: T; rotulo: string; icone?: string }[]; valor: T; onChange: (v: T) => void }) {
  const t = useTema();
  return (
    <View style={{ flexDirection: 'row', backgroundColor: t.escuro ? t.superficieAlta : '#EFEDE4', borderRadius: raio.md, padding: 4, gap: 4, marginBottom: 14 }}>
      {opcoes.map((o) => {
        const ativo = o.id === valor;
        return (
          <Pressable
            key={o.id}
            onPress={() => onChange(o.id)}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9, borderRadius: raio.sm, backgroundColor: ativo ? t.superficie : 'transparent' }}
          >
            {o.icone ? <Ionicons name={o.icone as any} size={14} color={ativo ? t.primaria : t.textoFraca} /> : null}
            <Text style={{ color: ativo ? t.texto : t.textoFraca, fontWeight: '700', fontSize: 12.5 }}>{o.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* -------------------------------------------------------------- PROGRESSO */
export function Progresso({ valor, cor }: { valor: number; cor?: string }) {
  const t = useTema();
  return (
    <View style={{ height: 8, borderRadius: 4, backgroundColor: t.escuro ? t.linha : '#E9E5D9', overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(2, Math.min(100, valor))}%`, height: '100%', borderRadius: 4, backgroundColor: cor || t.primaria }} />
    </View>
  );
}

/* -------------------------------------------------------- CABEÇALHO SEÇÃO */
export function Cabecalho({
  titulo, subtitulo, acoes,
}: { titulo: string; subtitulo?: string; acoes?: React.ReactNode }) {
  const t = useTema();
  return (
    <View style={{ marginBottom: 16, marginTop: 4, flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: t.texto, fontFamily: serif, fontSize: 25, fontWeight: '700' }}>{titulo}</Text>
        {subtitulo ? <Text style={{ color: t.textoMedia, fontSize: 13, marginTop: 4, lineHeight: 19 }}>{subtitulo}</Text> : null}
      </View>
      {acoes ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>{acoes}</View> : null}
    </View>
  );
}

/* -------------------------------------------------------------- DESTAQUE */
export function Destaque({
  rotulo, valor, icone, cor, nota,
}: { rotulo: string; valor: string; icone: string; cor: string; nota?: string }) {
  const t = useTema();
  return (
    <Cartao style={{ flex: 1, minWidth: 150 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: `${cor}1F`, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icone as any} size={17} color={cor} />
        </View>
      </View>
      <Text style={{ color: t.texto, fontFamily: serif, fontSize: 26, fontWeight: '700' }}>{valor}</Text>
      <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 2 }}>{rotulo}</Text>
      {nota ? <Text style={{ color: cor, fontSize: 11.5, fontWeight: '700', marginTop: 6 }}>{nota}</Text> : null}
    </Cartao>
  );
}

/* --------------------------------------------------------- GRÁFICO BARRAS */
export function GraficoBarras({
  dados, altura = 120, cor,
}: { dados: { rotulo: string; valor: number }[]; altura?: number; cor?: string }) {
  const t = useTema();
  const max = Math.max(1, ...dados.map((d) => d.valor));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: altura }}>
      {dados.map((d, i) => (
        <View key={`${d.rotulo}-${i}`} style={{ flex: 1, alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
          <Text style={{ color: t.textoFraca, fontSize: 10, fontWeight: '700' }}>{d.valor}</Text>
          <View
            style={{
              width: '70%', borderRadius: 7,
              height: Math.max(6, (d.valor / max) * (altura - 34)),
              backgroundColor: cor || t.primaria,
              opacity: 0.35 + (d.valor / max) * 0.65,
            }}
          />
          <Text style={{ color: t.textoFraca, fontSize: 10 }}>{d.rotulo}</Text>
        </View>
      ))}
    </View>
  );
}

/* ------------------------------------------------------------- SPARKLINE */
export function Sparkline({
  dados, altura = 46, cor, espessura = 2,
}: { dados: number[]; altura?: number; cor?: string; espessura?: number }) {
  const t = useTema();
  if (!dados.length) return null;
  const largura = 160;
  const min = Math.min(...dados);
  const max = Math.max(...dados);
  const intervalo = max - min || 1;
  const pontos = dados
    .map((v, i) => {
      const x = (i / Math.max(1, dados.length - 1)) * largura;
      const y = altura - 6 - ((v - min) / intervalo) * (altura - 12);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <Svg width="100%" height={altura} viewBox={`0 0 ${largura} ${altura}`} preserveAspectRatio="none">
      <Polyline points={pontos} fill="none" stroke={cor || t.primaria} strokeWidth={espessura} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ VAZIO */
export function Vazio({
  icone, titulo, texto, acao,
}: { icone: string; titulo: string; texto: string; acao?: React.ReactNode }) {
  const t = useTema();
  return (
    <View style={{ alignItems: 'center', paddingVertical: 44, paddingHorizontal: 24 }}>
      <View style={{ width: 68, height: 68, borderRadius: 34, backgroundColor: t.primariaSuave, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Ionicons name={icone as any} size={30} color={t.primaria} />
      </View>
      <Text style={{ color: t.texto, fontSize: 16, fontWeight: '700', marginBottom: 6, textAlign: 'center' }}>{titulo}</Text>
      <Text style={{ color: t.textoMedia, fontSize: 13.5, textAlign: 'center', lineHeight: 20, marginBottom: acao ? 16 : 0 }}>{texto}</Text>
      {acao}
    </View>
  );
}

/* -------------------------------------------------------------- ESQUELETO */
export function Esqueleto({ altura = 16, largura = '100%', raioB = 8 }: { altura?: number; largura?: number | string; raioB?: number }) {
  const t = useTema();
  return <View style={{ height: altura, width: largura as any, borderRadius: raioB, backgroundColor: t.escuro ? t.superficieAlta : '#EDEAE0' }} />;
}

export function Separador() {
  const t = useTema();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.linha, marginVertical: 12 }} />;
}

/* --------------------------------------------------------------- LINHA ITEM */
export function ItemLinha({
  esquerda, titulo, subtitulo, direita, onPress, style,
}: {
  esquerda?: React.ReactNode; titulo: string; subtitulo?: string; direita?: React.ReactNode;
  onPress?: () => void; style?: StyleProp<ViewStyle>;
}) {
  const t = useTema();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [{
        flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12,
        opacity: pressed && onPress ? 0.7 : 1,
      }, style]}
    >
      {esquerda}
      <View style={{ flex: 1 }}>
        <Text style={{ color: t.texto, fontSize: 14.5, fontWeight: '600' }} numberOfLines={1}>{titulo}</Text>
        {subtitulo ? <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 2 }} numberOfLines={2}>{subtitulo}</Text> : null}
      </View>
      {direita}
    </Pressable>
  );
}

/* ------------------------------------------------------------ MODAL BASE */
export function ModalBase({
  visivel, fechar, titulo, subtitulo, children,
}: { visivel: boolean; fechar: () => void; titulo: string; subtitulo?: string; children: React.ReactNode }) {
  const t = useTema();
  return (
    <Modal visible={visivel} animationType="slide" transparent onRequestClose={fechar}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(10,20,15,0.45)' }}
      >
        <Pressable style={{ flex: 1 }} onPress={fechar} />
        <View style={{ backgroundColor: t.fundo, borderTopLeftRadius: raio.xl, borderTopRightRadius: raio.xl, maxHeight: '88%', paddingBottom: 22 }}>
          <View style={{ alignItems: 'center', paddingTop: 10 }}>
            <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: t.linha }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ color: t.texto, fontFamily: serif, fontSize: 20, fontWeight: '700' }}>{titulo}</Text>
              {subtitulo ? <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 2 }}>{subtitulo}</Text> : null}
            </View>
            <BotaoIcone icone="close" onPress={fechar} />
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8 }} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ------------------------------------------------------------ CONTROLO CHAVE */
export function Chave({
  ativo, onToggle, rotulo, subtitulo,
}: { ativo: boolean; onToggle: () => void; rotulo: string; subtitulo?: string }) {
  const t = useTema();
  return (
    <Pressable onPress={onToggle} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, gap: 14 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: t.texto, fontSize: 14.5, fontWeight: '600' }}>{rotulo}</Text>
        {subtitulo ? <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 2, lineHeight: 17 }}>{subtitulo}</Text> : null}
      </View>
      <View style={{ width: 48, height: 28, borderRadius: 14, backgroundColor: ativo ? t.primaria : t.escuro ? '#2C3A33' : '#DCD8CC', alignItems: ativo ? 'flex-end' : 'flex-start', justifyContent: 'center', paddingHorizontal: 3 }}>
        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' }} />
      </View>
    </Pressable>
  );
}
