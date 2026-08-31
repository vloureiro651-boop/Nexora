import React, { useMemo, useState } from 'react';
import {
  Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cores, raio, serif } from '../lib/theme';
import { GRUPOS, SECCOES, SecId, seccaoPorId } from '../lib/seccoes';
import { DESTAQUES_MOBILE } from '../lib/seccoes';
import { useApp } from '../lib/store';
import { NavCtx, NavApp } from '../lib/nav';
import { nomePapel } from '../lib/data';
import { Logotipo } from './Logo';
import { useTema } from './ui';
import { REGISTO_SECCOES } from '../lib/registry';

type Props = {
  irParaUtente: (id: string) => void;
  irParaConversa: (id: string) => void;
  novaVisita: (utenteId?: string) => void;
};

export function Shell({ irParaUtente, irParaConversa, novaVisita }: Props) {
  const t = useTema();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const app = useApp();
  const [seccao, setSecao] = useState<SecId>('dashboard');
  const [menuAberto, setMenuAberto] = useState(false);

  const permitidas = useMemo(() => SECCOES.filter((s) => app.podeVer(s.id)), [app]);

  const destaquesAtivos = useMemo<SecId[]>(() => {
    const escolhidos = (app.definicoes.destaqueMobile || []) as SecId[];
    const validos = escolhidos.filter((id) => app.podeVer(id));
    return validos.length ? validos.slice(0, 3) : DESTAQUES_MOBILE;
  }, [app]);

  const nav: NavApp = useMemo(
    () => ({
      irParaSecao: (id) => {
        if (app.podeVer(id)) setSecao(id);
        setMenuAberto(false);
      },
      irParaUtente,
      irParaConversa,
      novaVisita,
      voltar: () => setSecao('dashboard'),
      seccaoAtual: seccao,
    }),
    [app, irParaConversa, irParaUtente, novaVisita, seccao],
  );

  const naoLidasNotificacoes = app.notificacoes.filter((n) => !n.lida).length;
  const naoLidasMensagens = app.conversas.reduce((s, c) => s + c.naoLidas, 0);
  const desktop = width >= 900;
  const meta = seccaoPorId(seccao);
  const ComponenteSecao = REGISTO_SECCOES[seccao];

  const badgeSecao = (id: SecId): number => {
    if (id === 'notificacoes') return naoLidasNotificacoes;
    if (id === 'mensagens') return naoLidasMensagens;
    return 0;
  };

  const irParaNotificacoes = () => {
    if (app.podeVer('notificacoes')) setSecao('notificacoes');
  };

  /* ------------------------------------------------------------ CONTEÚDO */
  const conteudo = (
    <View style={{ flex: 1 }}>
      {!desktop ? (
        <View style={[estilos.topoMobile, { paddingTop: insets.top + 10, borderBottomColor: t.linha, backgroundColor: t.superficie }]}>
          <Logotipo tamanho={34} tom="escuro" slogan={false} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable onPress={irParaNotificacoes} style={[estilos.iconeTopo, { backgroundColor: t.primariaSuave }]}>
              <Ionicons name="notifications-outline" size={18} color={t.primaria} />
              {naoLidasNotificacoes > 0 ? <View style={[estilos.badge, { backgroundColor: t.perigo }]}><Text style={estilos.badgeTexto}>{naoLidasNotificacoes}</Text></View> : null}
            </Pressable>
            <Pressable onPress={() => setSecao('config')} style={[estilos.avatarTopo, { backgroundColor: t.primaria }]}>
              <Text style={{ color: '#F7F5EE', fontWeight: '700', fontSize: 12 }}>
                {(app.utilizador?.nome || 'CR').split(' ').map((p) => p[0]).slice(0, 2).join('')}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {desktop ? (
        <View style={[estilos.topoDesktop, { borderBottomColor: t.linha, backgroundColor: t.superficie }]}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: t.texto, fontFamily: serif, fontSize: 21, fontWeight: '700' }}>{meta.titulo}</Text>
            <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 2 }}>{meta.subtitulo}</Text>
          </View>
          <Pressable onPress={() => setSecao('utentes')} style={[estilos.pesquisaDesktop, { backgroundColor: t.escuro ? t.superficieAlta : '#F2F0E8', borderColor: t.linha }]}>
            <Ionicons name="search" size={16} color={t.textoFraca} />
            <Text style={{ color: t.textoFraca, fontSize: 13, marginLeft: 8 }}>Pesquisar utentes, documentos…</Text>
          </Pressable>
          <Pressable onPress={irParaNotificacoes} style={[estilos.iconeTopo, { backgroundColor: t.primariaSuave }]}>
            <Ionicons name="notifications-outline" size={19} color={t.primaria} />
            {naoLidasNotificacoes > 0 ? <View style={[estilos.badge, { backgroundColor: t.perigo }]}><Text style={estilos.badgeTexto}>{naoLidasNotificacoes}</Text></View> : null}
          </Pressable>
          <Pressable onPress={() => setSecao('config')} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginLeft: 6 }}>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: t.texto, fontSize: 13, fontWeight: '700' }}>{app.utilizador?.nome}</Text>
              <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>{app.utilizador ? nomePapel(app.utilizador.papel) : ''}</Text>
            </View>
            <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: t.primaria, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#F7F5EE', fontWeight: '700', fontSize: 12 }}>
                {(app.utilizador?.nome || 'CR').split(' ').map((p) => p[0]).slice(0, 2).join('')}
              </Text>
            </View>
          </Pressable>
        </View>
      ) : null}

      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ flex: 1, width: '100%', maxWidth: 1180 }}>
          <ComponenteSecao />
        </View>
      </View>

      {/* ------------------------------------------------ BARRA INFERIOR MOBILE */}
      {!desktop ? (
        <View style={[estilos.tabBar, { paddingBottom: Math.max(insets.bottom, 10), borderTopColor: t.linha, backgroundColor: t.superficie }]}>
          {destaquesAtivos.map((id) => {
            const s = seccaoPorId(id);
            const ativo = seccao === id;
            return (
              <Pressable key={id} onPress={() => setSecao(id)} style={estilos.tabItem}>
                <Ionicons name={(ativo ? s.iconeAtivo : s.icone) as any} size={21} color={ativo ? t.primaria : t.textoFraca} />
                <Text style={{ color: ativo ? t.primaria : t.textoFraca, fontSize: 10.5, fontWeight: ativo ? '700' : '600', marginTop: 3 }}>{s.titulo}</Text>
                {ativo ? <View style={{ position: 'absolute', top: -10, width: 26, height: 3, borderRadius: 2, backgroundColor: t.primaria }} /> : null}
              </Pressable>
            );
          })}
          <Pressable onPress={() => setMenuAberto(true)} style={estilos.tabItem}>
            <View style={{ position: 'relative' }}>
              <Ionicons name="menu-outline" size={22} color={t.textoFraca} />
              {naoLidasNotificacoes > 0 ? <View style={[estilos.badge, { backgroundColor: t.perigo, top: -6, right: -8 }]}><Text style={estilos.badgeTexto}>{naoLidasNotificacoes}</Text></View> : null}
            </View>
            <Text style={{ color: t.textoFraca, fontSize: 10.5, fontWeight: '600', marginTop: 3 }}>Menu</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  /* --------------------------------------------------------------- MENU MOBILE */
  const menuMobile = (
    <Modal visible={menuAberto} animationType="slide" onRequestClose={() => setMenuAberto(false)}>
      <LinearGradient colors={[cores.verdeEscuro, cores.verdeEscuro2]} style={{ flex: 1 }}>
        <View style={{ paddingTop: insets.top + 14, paddingHorizontal: 20, paddingBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Logotipo tamanho={40} tom="claro" />
            <Pressable onPress={() => setMenuAberto(false)} style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(243,235,218,0.16)', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="close" size={20} color="#F3EBDA" />
            </Pressable>
          </View>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}>
          {GRUPOS.map((grupo) => {
            const itens = permitidas.filter((s) => s.grupo === grupo);
            if (!itens.length) return null;
            return (
              <View key={grupo} style={{ marginBottom: 18 }}>
                <Text style={{ color: 'rgba(243,235,218,0.55)', fontSize: 11, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase', paddingHorizontal: 10, marginBottom: 8 }}>{grupo}</Text>
                {itens.map((s) => {
                  const ativo = seccao === s.id;
                  const badge = badgeSecao(s.id);
                  return (
                    <Pressable
                      key={s.id}
                      onPress={() => nav.irParaSecao(s.id)}
                      style={{
                        flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 12,
                        borderRadius: raio.md, backgroundColor: ativo ? 'rgba(231,220,198,0.18)' : 'transparent',
                      }}
                    >
                      <Ionicons name={(ativo ? s.iconeAtivo : s.icone) as any} size={19} color={ativo ? cores.bege : 'rgba(243,235,218,0.85)'} />
                      <Text style={{ flex: 1, color: '#F3EBDA', fontSize: 14.5, fontWeight: ativo ? '700' : '500' }}>{s.titulo}</Text>
                      {badge > 0 ? (
                        <View style={{ minWidth: 20, height: 20, borderRadius: 10, backgroundColor: cores.bege, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 }}>
                          <Text style={{ color: cores.verdeEscuro, fontSize: 10.5, fontWeight: '800' }}>{badge}</Text>
                        </View>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, paddingBottom: Math.max(insets.bottom, 16), backgroundColor: 'rgba(10,25,18,0.92)' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: cores.bege, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: cores.verdeEscuro, fontWeight: '800' }}>
                {(app.utilizador?.nome || 'CR').split(' ').map((p) => p[0]).slice(0, 2).join('')}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#F3EBDA', fontWeight: '700', fontSize: 14 }}>{app.utilizador?.nome}</Text>
              <Text style={{ color: 'rgba(243,235,218,0.7)', fontSize: 12 }}>{app.utilizador ? nomePapel(app.utilizador.papel) : ''}</Text>
            </View>
            <Pressable onPress={app.sair} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(243,235,218,0.14)', paddingHorizontal: 12, paddingVertical: 9, borderRadius: raio.md }}>
              <Ionicons name="log-out-outline" size={16} color="#F3EBDA" />
              <Text style={{ color: '#F3EBDA', fontSize: 12.5, fontWeight: '700' }}>Sair</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </Modal>
  );

  /* --------------------------------------------------------------- LAYOUT */
  if (desktop) {
    return (
      <NavCtx.Provider value={nav}>
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: t.fundo }}>
          <LinearGradient colors={[cores.verdeEscuro, cores.verdeEscuro2]} style={{ width: 274, paddingTop: 26 }}>
            <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
              <Logotipo tamanho={46} tom="claro" />
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
              {GRUPOS.map((grupo) => {
                const itens = permitidas.filter((s) => s.grupo === grupo);
                if (!itens.length) return null;
                return (
                  <View key={grupo} style={{ marginBottom: 16 }}>
                    <Text style={{ color: 'rgba(243,235,218,0.5)', fontSize: 10.5, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase', paddingHorizontal: 12, marginBottom: 6 }}>{grupo}</Text>
                    {itens.map((s) => {
                      const ativo = seccao === s.id;
                      const badge = badgeSecao(s.id);
                      return (
                        <Pressable
                          key={s.id}
                          onPress={() => setSecao(s.id)}
                          style={{
                            flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 10, paddingHorizontal: 12,
                            borderRadius: raio.md, marginBottom: 2, backgroundColor: ativo ? 'rgba(231,220,198,0.16)' : 'transparent',
                          }}
                        >
                          <Ionicons name={(ativo ? s.iconeAtivo : s.icone) as any} size={18} color={ativo ? cores.bege : 'rgba(243,235,218,0.78)'} />
                          <Text style={{ flex: 1, color: '#F3EBDA', fontSize: 13.5, fontWeight: ativo ? '700' : '500' }} numberOfLines={1}>{s.titulo}</Text>
                          {badge > 0 ? (
                            <View style={{ minWidth: 19, height: 19, borderRadius: 10, backgroundColor: cores.bege, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 }}>
                              <Text style={{ color: cores.verdeEscuro, fontSize: 10, fontWeight: '800' }}>{badge}</Text>
                            </View>
                          ) : null}
                        </Pressable>
                      );
                    })}
                  </View>
                );
              })}
            </ScrollView>
            <View style={{ padding: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(243,235,218,0.2)', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#F3EBDA', fontSize: 13, fontWeight: '700' }} numberOfLines={1}>{app.utilizador?.nome}</Text>
                <Text style={{ color: 'rgba(243,235,218,0.65)', fontSize: 11 }}>{app.utilizador ? nomePapel(app.utilizador.papel) : ''}</Text>
              </View>
              <Pressable onPress={app.sair} style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(243,235,218,0.14)', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="log-out-outline" size={18} color="#F3EBDA" />
              </Pressable>
            </View>
          </LinearGradient>
          <View style={{ flex: 1 }}>{conteudo}</View>
        </View>
      </NavCtx.Provider>
    );
  }

  return (
    <NavCtx.Provider value={nav}>
      <View style={{ flex: 1, backgroundColor: t.fundo }}>{conteudo}{menuMobile}</View>
    </NavCtx.Provider>
  );
}

const estilos = StyleSheet.create({
  topoMobile: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topoDesktop: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 28, paddingTop: 18, paddingBottom: 18, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pesquisaDesktop: {
    flexDirection: 'row', alignItems: 'center', width: 250, paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: raio.md, borderWidth: StyleSheet.hairlineWidth,
  },
  iconeTopo: { width: 40, height: 40, borderRadius: raio.md, alignItems: 'center', justifyContent: 'center' },
  avatarTopo: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute', top: -4, right: -4, minWidth: 17, height: 17, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  badgeTexto: { color: '#fff', fontSize: 9.5, fontWeight: '800' },
  tabBar: {
    flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10,
    paddingHorizontal: 6,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 2 },
});
