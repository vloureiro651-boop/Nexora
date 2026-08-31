import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTema, Cartao, Destaque, Botao, Etiqueta, GraficoBarras, Avatar } from '../components/ui';
import { Logotipo } from '../components/Logo';
import { useApp } from '../lib/store';
import { useNav } from '../lib/nav';
import { DIAS_CURTO, formatarData, isoDe, saudacao } from '../lib/formatos';
import { nomePapel, profPorId } from '../lib/data';
import { serif, cores } from '../lib/theme';

export function DashboardScreen() {
  const t = useTema();
  const app = useApp();
  const nav = useNav();
  const [actualizar, setActualizar] = useState(false);

  const hoje = isoDe(0);
  const visitasHoje = app.visitas
    .filter((v) => v.data === hoje)
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
  const concluidas = visitasHoje.filter((v) => v.estado === 'concluida').length;
  const feridasVigiar = app.feridas.filter((f) => f.situacao !== 'Em melhoria').length;
  const naoLidas = app.notificacoes.filter((n) => !n.lida).length;
  const planosRever = 5;

  const semana = [-3, -2, -1, 0, 1, 2, 3].map((off) => {
    const partes = isoDe(off).split('-').map(Number);
    const dia = new Date(partes[0], partes[1] - 1, partes[2]).getDay();
    return {
      rotulo: DIAS_CURTO[dia],
      valor: app.visitas.filter((v) => v.data === isoDe(off)).length,
    };
  });

  const carregar = useCallback(() => {
    setActualizar(true);
    setTimeout(() => setActualizar(false), 900);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={actualizar} onRefresh={carregar} tintColor={t.primaria} />}
    >
      {/* ------------------------------------------------------------- BOAS-VINDAS */}
      <LinearGradient
        colors={[cores.verdeEscuro, cores.verdeEscuro2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={estilos.hero}
      >
        <Logotipo tamanho={44} tom="claro" />
        <Text style={{ color: '#F3EBDA', fontFamily: serif, fontSize: 24, fontWeight: '700', marginTop: 18 }}>
          {saudacao()}, {app.utilizador?.nome?.split(' ')[0] || 'profissional'}
        </Text>
        <Text style={{ color: 'rgba(243,235,218,0.82)', fontSize: 13.5, marginTop: 6, lineHeight: 20 }}>
          {app.utilizador ? nomePapel(app.utilizador.papel) : ''} · {formatarData(hoje, true)}
          {'\n'}
          {visitasHoje.length} visitas agendadas para hoje, {concluidas} já concluídas.
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
          <Botao titulo="Ver agenda de hoje" icone="calendar" onPress={() => nav.irParaSecao('agenda')} style={{ backgroundColor: cores.bege }} />
          <Botao titulo="Nova visita" icone="add" tipo="fantasma" onPress={() => nav.novaVisita()} style={{ backgroundColor: 'rgba(243,235,218,0.16)' }} />
        </View>
      </LinearGradient>

      {/* -------------------------------------------------------------- INDICADORES */}
      <View style={estilos.grelha}>
        <Destaque rotulo="Utentes ativos" valor={`${app.utentes.length}`} icone="people" cor={cores.verde} nota="2 de risco alto" />
        <Destaque rotulo="Visitas hoje" valor={`${visitasHoje.length}`} icone="walk" cor={cores.info} nota={`${concluidas} concluídas`} />
        <Destaque rotulo="Feridas a vigiar" valor={`${feridasVigiar}`} icone="bandage" cor={cores.alerta} nota="1 a agravar" />
        <Destaque rotulo="Planos a rever" valor={`${planosRever}`} icone="clipboard" cor={cores.begeEscuro2} nota="2 esta semana" />
      </View>

      {/* ------------------------------------------------------------------ HOJE */}
      <View style={estilos.linhaTitulo}>
        <Text style={[estilos.tituloSecao, { color: t.texto }]}>Jornada de hoje</Text>
        <Text onPress={() => nav.irParaSecao('visitas')} style={{ color: t.primaria, fontWeight: '700', fontSize: 12.5 }}>
          Ver todas
        </Text>
      </View>

      <Cartao style={{ paddingVertical: 6 }}>
        {visitasHoje.length === 0 ? (
          <Text style={{ color: t.textoMedia, fontSize: 13.5, paddingVertical: 14 }}>
            Não existem visitas agendadas para hoje.
          </Text>
        ) : (
          visitasHoje.slice(0, 5).map((v, i) => {
            const utente = app.obterUtente(v.utenteId);
            const prof = profPorId(v.profissionalId);
            const tom = v.estado === 'concluida' ? 'verde' : v.estado === 'em_curso' ? 'info' : 'neutro';
            return (
              <View key={v.id}>
                {i > 0 ? <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.linha }} /> : null}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
                  <View style={{ width: 52 }}>
                    <Text style={{ color: t.texto, fontFamily: serif, fontSize: 15, fontWeight: '700' }}>{v.inicio.replace(':', 'h')}</Text>
                    <Text style={{ color: t.textoFraca, fontSize: 10.5, marginTop: 2 }}>{v.duracao} min</Text>
                  </View>
                  <View style={{ width: 3, height: 40, borderRadius: 2, backgroundColor: v.estado === 'concluida' ? t.primaria : t.bege }} />
                  <View style={{ flex: 1 }}>
                    <Text onPress={() => nav.irParaUtente(v.utenteId)} style={{ color: t.texto, fontWeight: '700', fontSize: 14 }}>{utente.nome}</Text>
                    <Text style={{ color: t.textoMedia, fontSize: 12, marginTop: 2 }}>
                      {v.tipo} · {prof.nome}
                    </Text>
                  </View>
                  <Etiqueta texto={v.estado === 'concluida' ? 'Concluída' : v.estado === 'em_curso' ? 'Em curso' : 'Planeada'} tom={tom} />
                </View>
              </View>
            );
          })
        )}
      </Cartao>

      {/* ----------------------------------------------------------------- GRÁFICO */}
      <View style={[estilos.linhaTitulo, { marginTop: 22 }]}>
        <Text style={[estilos.tituloSecao, { color: t.texto }]}>Visitas nos últimos 7 dias</Text>
      </View>
      <Cartao>
        <GraficoBarras dados={semana} />
        <Text style={{ color: t.textoFraca, fontSize: 11.5, marginTop: 10 }}>
          Distribuição equilibrada da equipa — foco «Equilibrada» ativo.
        </Text>
      </Cartao>

      {/* ----------------------------------------------------------------- ALERTAS */}
      <View style={[estilos.linhaTitulo, { marginTop: 22 }]}>
        <Text style={[estilos.tituloSecao, { color: t.texto }]}>Alertas e notificações</Text>
        <Text onPress={() => nav.irParaSecao('notificacoes')} style={{ color: t.primaria, fontWeight: '700', fontSize: 12.5 }}>
          {naoLidas} por ler
        </Text>
      </View>
      <Cartao style={{ paddingVertical: 6 }}>
        {app.notificacoes.slice(0, 4).map((n, i) => {
          const icone = n.tipo === 'visita' ? 'calendar' : n.tipo === 'sinal' ? 'heart' : n.tipo === 'cuidado' ? 'bandage' : n.tipo === 'mensagem' ? 'chatbubble' : 'information-circle';
          const cor = n.tipo === 'sinal' ? cores.perigo : n.tipo === 'cuidado' ? cores.alerta : cores.verde;
          return (
            <View key={n.id}>
              {i > 0 ? <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.linha }} /> : null}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
                <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: `${cor}1A`, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={icone as any} size={17} color={cor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: t.texto, fontSize: 13.5, fontWeight: '700' }}>{n.titulo}</Text>
                  <Text style={{ color: t.textoMedia, fontSize: 12, marginTop: 2 }} numberOfLines={2}>{n.texto}</Text>
                </View>
                <Text style={{ color: t.textoFraca, fontSize: 11 }}>{n.hora}</Text>
              </View>
            </View>
          );
        })}
      </Cartao>

      {/* ------------------------------------------------------------- EQUIPA HOJE */}
      <View style={[estilos.linhaTitulo, { marginTop: 22 }]}>
        <Text style={[estilos.tituloSecao, { color: t.texto }]}>Equipa em campo</Text>
        <Text onPress={() => nav.irParaSecao('profissionais')} style={{ color: t.primaria, fontWeight: '700', fontSize: 12.5 }}>
          Ver equipa
        </Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {['p2', 'p3', 'p4'].map((id) => {
          const p = profPorId(id);
          return (
            <Cartao key={id} style={{ width: '100%', maxWidth: 360, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Avatar nome={p.nome} tamanho={40} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.texto, fontWeight: '700', fontSize: 14 }}>{p.nome}</Text>
                <Text style={{ color: t.textoMedia, fontSize: 12, marginTop: 2 }}>{p.especialidade}</Text>
              </View>
              <Etiqueta texto={`${p.visitasHoje} visitas`} tom="info" />
            </Cartao>
          );
        })}
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  hero: { borderRadius: 26, padding: 22, marginBottom: 16 },
  grelha: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  linhaTitulo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, marginBottom: 10 },
  tituloSecao: { fontFamily: serif, fontSize: 18, fontWeight: '700' },
});
