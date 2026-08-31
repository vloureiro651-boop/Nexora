import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Botao, Cabecalho, Cartao, Campo, Chip, Etiqueta, ModalBase, Progresso, Sparkline, useTema, Vazio,
} from '../components/ui';
import { useApp } from '../lib/store';
import { useNav } from '../lib/nav';
import { FERIDAS } from '../lib/data';
import { formatarData, isoDe } from '../lib/formatos';
import { serif, cores } from '../lib/theme';

/* ------------------------------------------------------------- SINAIS VITAIS */
export function SinaisScreen() {
  const t = useTema();
  const app = useApp();
  const nav = useNav();
  const [utente, setUtente] = useState<string>('todos');
  const [modal, setModal] = useState(false);
  const [actualizar, setActualizar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [form, setForm] = useState({
    utenteId: app.utentes[0]?.id || 'u1', paSis: '', paDia: '', pulso: '', temp: '', spo2: '', glicemia: '', peso: '',
  });

  const registos = useMemo(() => {
    const base = app.sinais.filter((s) => (utente === 'todos' ? true : s.utenteId === utente));
    return [...base].sort((a, b) => (a.data === b.data ? b.hora.localeCompare(a.hora) : b.data.localeCompare(a.data)));
  }, [app.sinais, utente]);

  const serie = (campo: 'pulso' | 'paSis' | 'temp' | 'spo2' | 'glicemia') =>
    [...registos].reverse().map((s) => s[campo]);

  const ultimo = registos[0];

  const guardar = () => {
    if (!form.paSis || !form.pulso) {
      setErro('Indique pelo menos a pressão arterial e o pulso.');
      return;
    }
    app.adicionarSinal({
      utenteId: form.utenteId,
      data: isoDe(0),
      hora: new Date().toTimeString().slice(0, 5),
      autor: app.utilizador?.nome || 'Profissional',
      paSis: Number(form.paSis) || 0,
      paDia: Number(form.paDia) || 0,
      pulso: Number(form.pulso) || 0,
      temp: Number(form.temp.replace(',', '.')) || 0,
      spo2: Number(form.spo2) || 0,
      glicemia: Number(form.glicemia) || 0,
      peso: Number(form.peso.replace(',', '.')) || 0,
    });
    setForm({ utenteId: app.utentes[0]?.id || 'u1', paSis: '', paDia: '', pulso: '', temp: '', spo2: '', glicemia: '', peso: '' });
    setErro(null);
    setModal(false);
  };

  const carregar = () => {
    setActualizar(true);
    setTimeout(() => setActualizar(false), 900);
  };

  const metricas = [
    { rotulo: 'Pulso', valor: ultimo ? `${ultimo.pulso} bpm` : '—', campo: 'pulso' as const, cor: t.perigo, icone: 'pulse' },
    { rotulo: 'PA máx', valor: ultimo ? `${ultimo.paSis} mmHg` : '—', campo: 'paSis' as const, cor: t.info, icone: 'heart' },
    { rotulo: 'Temperatura', valor: ultimo ? `${ultimo.temp.toFixed(1)} °C` : '—', campo: 'temp' as const, cor: t.alerta, icone: 'thermometer' },
    { rotulo: 'SatO₂', valor: ultimo ? `${ultimo.spo2} %` : '—', campo: 'spo2' as const, cor: t.primaria, icone: 'water' },
    { rotulo: 'Glicemia', valor: ultimo ? `${ultimo.glicemia} mg/dL` : '—', campo: 'glicemia' as const, cor: cores.begeEscuro2, icone: 'flask' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={registos}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={actualizar} onRefresh={carregar} tintColor={t.primaria} />}
        ListHeaderComponent={
          <View>
            <Cabecalho
              titulo="Sinais vitais"
              subtitulo="Séries clínicas por utente e tendências ao longo do tempo."
              acoes={<Botao titulo="Registar" icone="add" pequeno onPress={() => setModal(true)} />}
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              <Chip rotulo="Todos" ativo={utente === 'todos'} onPress={() => setUtente('todos')} />
              {app.utentes.map((u) => (
                <Chip key={u.id} rotulo={u.nome.split(' ')[0]} ativo={utente === u.id} onPress={() => setUtente(u.id)} />
              ))}
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
              {metricas.map((m) => (
                <Cartao key={m.rotulo} style={{ width: 158, flexGrow: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name={m.icone as any} size={14} color={m.cor} />
                    <Text style={{ color: t.textoMedia, fontSize: 12, fontWeight: '700' }}>{m.rotulo}</Text>
                  </View>
                  <Text style={{ color: t.texto, fontFamily: serif, fontSize: 20, fontWeight: '700', marginTop: 6 }}>{m.valor}</Text>
                  <View style={{ marginTop: 6 }}>
                    <Sparkline dados={serie(m.campo)} cor={m.cor} altura={38} />
                  </View>
                </Cartao>
              ))}
            </View>

            <Text style={{ color: t.textoMedia, fontSize: 12, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
              Registos recentes
            </Text>
          </View>
        }
        ListEmptyComponent={<Vazio icone="heart-outline" titulo="Sem registos" texto="Ainda não existem sinais vitais registados para este utente." />}
        renderItem={({ item }) => {
          const u = app.obterUtente(item.utenteId);
          return (
            <Cartao style={{ marginBottom: 10 }} onPress={() => nav.irParaUtente(item.utenteId)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ color: t.texto, fontWeight: '700', fontSize: 14, flex: 1 }}>{u.nome}</Text>
                <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>{formatarData(item.data)} · {item.hora.replace(':', 'h')}</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {[
                  { r: 'PA', v: `${item.paSis}/${item.paDia}`, alerta: item.paSis >= 145 },
                  { r: 'Pulso', v: `${item.pulso}`, alerta: item.pulso > 100 },
                  { r: 'Temp', v: `${item.temp.toFixed(1)}º`, alerta: item.temp >= 37.5 },
                  { r: 'SatO₂', v: `${item.spo2}%`, alerta: item.spo2 < 94 },
                  { r: 'Glic.', v: `${item.glicemia}`, alerta: item.glicemia > 160 },
                  { r: 'Peso', v: `${item.peso} kg`, alerta: false },
                ].map((c) => (
                  <View key={c.r} style={[estilos.celula, { backgroundColor: c.alerta ? '#F6E2DC' : t.escuro ? t.superficieAlta : '#F5F2E9' }]}>
                    <Text style={{ color: t.textoFraca, fontSize: 10 }}>{c.r}</Text>
                    <Text style={{ color: c.alerta ? t.perigo : t.texto, fontSize: 13.5, fontWeight: '800', marginTop: 2 }}>{c.v}</Text>
                  </View>
                ))}
              </View>
              <Text style={{ color: t.textoFraca, fontSize: 11, marginTop: 8 }}>Registado por {item.autor}</Text>
            </Cartao>
          );
        }}
      />

      <ModalBase visivel={modal} fechar={() => setModal(false)} titulo="Registar sinais vitais" subtitulo="Os valores ficam disponíveis de imediato no histórico clínico.">
        <Text style={{ color: t.textoMedia, fontSize: 12.5, fontWeight: '700', marginBottom: 8 }}>Utente</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {app.utentes.map((u) => (
            <Chip key={u.id} rotulo={u.nome.split(' ')[0]} ativo={form.utenteId === u.id} onPress={() => setForm({ ...form, utenteId: u.id })} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Campo rotulo="PA sistólica" valor={form.paSis} onChangeText={(v) => setForm({ ...form, paSis: v })} teclado="number-pad" placeholder="120" icone="heart-outline" />
          </View>
          <View style={{ flex: 1 }}>
            <Campo rotulo="PA diastólica" valor={form.paDia} onChangeText={(v) => setForm({ ...form, paDia: v })} teclado="number-pad" placeholder="80" icone="heart-outline" />
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Campo rotulo="Pulso (bpm)" valor={form.pulso} onChangeText={(v) => setForm({ ...form, pulso: v })} teclado="number-pad" placeholder="72" icone="pulse-outline" />
          </View>
          <View style={{ flex: 1 }}>
            <Campo rotulo="Temperatura (°C)" valor={form.temp} onChangeText={(v) => setForm({ ...form, temp: v })} teclado="numeric" placeholder="36,6" icone="thermometer-outline" />
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Campo rotulo="Saturação (%)" valor={form.spo2} onChangeText={(v) => setForm({ ...form, spo2: v })} teclado="number-pad" placeholder="97" icone="water-outline" />
          </View>
          <View style={{ flex: 1 }}>
            <Campo rotulo="Glicemia (mg/dL)" valor={form.glicemia} onChangeText={(v) => setForm({ ...form, glicemia: v })} teclado="number-pad" placeholder="110" icone="flask-outline" />
          </View>
        </View>
        <Campo rotulo="Peso (kg)" valor={form.peso} onChangeText={(v) => setForm({ ...form, peso: v })} teclado="numeric" placeholder="62,5" icone="speedometer-outline" />
        {erro ? (
          <View style={{ backgroundColor: '#F6E2DC', borderRadius: 12, padding: 10, marginBottom: 12 }}>
            <Text style={{ color: '#8E3423', fontSize: 12.5 }}>{erro}</Text>
          </View>
        ) : null}
        <Botao titulo="Guardar registo" icone="checkmark" full onPress={guardar} />
      </ModalBase>
    </View>
  );
}

/* ------------------------------------------------------------------- FERIDAS */
export function FeridasScreen() {
  const t = useTema();
  const app = useApp();
  const nav = useNav();
  const [filtro, setFiltro] = useState<'todas' | 'melhoria' | 'vigilancia'>('todas');

  const lista = app.feridas.filter((f) => {
    if (filtro === 'melhoria') return f.situacao === 'Em melhoria';
    if (filtro === 'vigilancia') return f.situacao !== 'Em melhoria';
    return true;
  });

  return (
    <FlatList
      data={lista}
      keyExtractor={(f) => f.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      ListHeaderComponent={
        <View>
          <Cabecalho titulo="Feridas" subtitulo="Mapeamento das lesões, classificação e evolução da dimensão." />
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
            <Chip rotulo="Todas" ativo={filtro === 'todas'} onPress={() => setFiltro('todas')} />
            <Chip rotulo="Em melhoria" ativo={filtro === 'melhoria'} onPress={() => setFiltro('melhoria')} />
            <Chip rotulo="Sob vigilância" ativo={filtro === 'vigilancia'} onPress={() => setFiltro('vigilancia')} />
          </View>
        </View>
      }
      ListEmptyComponent={<Vazio icone="bandage-outline" titulo="Sem feridas" texto="Não existem feridas registadas com este critério." />}
      renderItem={({ item }) => {
        const u = app.obterUtente(item.utenteId);
        const tom = item.situacao === 'Em melhoria' ? 'verde' : item.situacao === 'Estável' ? 'alerta' : 'perigo';
        const corFerida = item.situacao === 'Agravada' ? '#B3452F' : '#C9822B';
        return (
          <Cartao style={{ marginBottom: 12 }} onPress={() => nav.irParaUtente(item.utenteId)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: `${corFerida}1A`, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="bandage-outline" size={19} color={corFerida} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.texto, fontFamily: serif, fontSize: 15.5, fontWeight: '700' }}>{item.local}</Text>
                <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 2 }}>{u.nome}</Text>
              </View>
              <Etiqueta texto={item.situacao} tom={tom} />
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
              <View style={{ flex: 1, minWidth: 110 }}>
                <Text style={{ color: t.textoFraca, fontSize: 11 }}>Classificação</Text>
                <Text style={{ color: t.texto, fontSize: 12.5, fontWeight: '600', marginTop: 2 }}>{item.classificacao}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 110 }}>
                <Text style={{ color: t.textoFraca, fontSize: 11 }}>Dimensão</Text>
                <Text style={{ color: t.texto, fontSize: 12.5, fontWeight: '600', marginTop: 2 }}>{item.dimensao}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 110 }}>
                <Text style={{ color: t.textoFraca, fontSize: 11 }}>Exsudato</Text>
                <Text style={{ color: t.texto, fontSize: 12.5, fontWeight: '600', marginTop: 2 }}>{item.exsudato}</Text>
              </View>
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={{ color: t.textoMedia, fontSize: 11.5, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>
                Evolução da dimensão (cm)
              </Text>
              <Sparkline dados={item.evolucao} cor={item.situacao === 'Agravada' ? t.perigo : t.primaria} altura={44} />
            </View>

            <Text style={{ color: t.textoMedia, fontSize: 12, marginTop: 8, lineHeight: 18, fontStyle: 'italic' }}>{item.observacao}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.linha }}>
              <Ionicons name="time-outline" size={13} color={t.textoFraca} />
              <Text style={{ color: t.textoFraca, fontSize: 11.5, flex: 1 }}>Última avaliação {formatarData(item.dataUltima)}</Text>
              <Etiqueta texto={`Próxima ${formatarData(item.proxima)}`} tom={item.situacao === 'Agravada' ? 'perigo' : 'neutro'} />
            </View>
          </Cartao>
        );
      }}
    />
  );
}

/* --------------------------------------------------------------- MEDICAÇÃO */
export function MedicacaoScreen() {
  const t = useTema();
  const app = useApp();
  const nav = useNav();
  const [filtro, setFiltro] = useState<'todas' | 'pendentes' | 'altoRisco'>('todas');

  const lista = app.medicacao.filter((m) => {
    if (filtro === 'pendentes') return m.tomes.some((x) => !x);
    if (filtro === 'altoRisco') return m.altoRisco;
    return true;
  });

  const totalTomes = app.medicacao.reduce((s, m) => s + m.tomes.length, 0);
  const feitas = app.medicacao.reduce((s, m) => s + m.tomes.filter(Boolean).length, 0);
  const percentagem = totalTomes ? Math.round((feitas / totalTomes) * 100) : 0;

  return (
    <FlatList
      data={lista}
      keyExtractor={(m) => m.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      ListHeaderComponent={
        <View>
          <Cabecalho titulo="Medicação" subtitulo="Administração nas 5 certas, com registo de tomes do dia." />
          <Cartao style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: t.textoMedia, fontSize: 12.5, fontWeight: '700' }}>Tomes administradas hoje</Text>
              <Text style={{ color: t.primaria, fontSize: 12.5, fontWeight: '800' }}>{percentagem}%</Text>
            </View>
            <Progresso valor={percentagem} />
            <Text style={{ color: t.textoFraca, fontSize: 11.5, marginTop: 8 }}>{feitas} de {totalTomes} administrações registadas.</Text>
          </Cartao>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
            <Chip rotulo="Todas" ativo={filtro === 'todas'} onPress={() => setFiltro('todas')} />
            <Chip rotulo="Pendentes" icone="time-outline" ativo={filtro === 'pendentes'} onPress={() => setFiltro('pendentes')} />
            <Chip rotulo="Alto risco" icone="alert-circle-outline" ativo={filtro === 'altoRisco'} onPress={() => setFiltro('altoRisco')} />
          </View>
        </View>
      }
      ListEmptyComponent={<Vazio icone="medical-outline" titulo="Tudo administrado" texto="Não há medicação pendente neste momento." />}
      renderItem={({ item }) => {
        const u = app.obterUtente(item.utenteId);
        const pendentes = item.tomes.filter((x) => !x).length;
        return (
          <Cartao style={{ marginBottom: 12 }} onPress={() => nav.irParaUtente(item.utenteId)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: item.altoRisco ? '#F6E2DC' : t.primariaSuave, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="medical-outline" size={19} color={item.altoRisco ? t.perigo : t.primaria} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.texto, fontFamily: serif, fontSize: 15.5, fontWeight: '700' }}>{item.nome}</Text>
                <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 2 }}>{item.dose} · {item.via} · {u.nome}</Text>
              </View>
              {item.altoRisco ? <Etiqueta texto="Alto risco" tom="perigo" icone="alert-circle" /> : null}
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
              {item.horarios.map((h, i) => (
                <Pressable
                  key={h}
                  onPress={() => app.alternarTome(item.id, i)}
                  style={[estilos.toma, { backgroundColor: item.tomes[i] ? t.primaria : t.escuro ? t.superficieAlta : '#F2EFE5', borderColor: item.tomes[i] ? t.primaria : t.linha }]}
                >
                  <Ionicons name={item.tomes[i] ? 'checkmark' : 'time-outline'} size={13} color={item.tomes[i] ? '#fff' : t.textoFraca} />
                  <Text style={{ color: item.tomes[i] ? '#fff' : t.textoMedia, fontSize: 12, fontWeight: '700' }}>{h.replace(':', 'h')}</Text>
                </Pressable>
              ))}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.linha }}>
              <Ionicons name={pendentes ? 'hourglass-outline' : 'checkmark-circle-outline'} size={14} color={pendentes ? t.alerta : t.primaria} />
              <Text style={{ color: pendentes ? t.alerta : t.primaria, fontSize: 11.5, fontWeight: '700', flex: 1 }}>
                {pendentes ? `${pendentes} toma(s) por administrar` : 'Todas as tomes do dia administradas'}
              </Text>
              <Text style={{ color: t.textoFraca, fontSize: 11 }}>Termina {formatarData(item.fim)}</Text>
            </View>
          </Cartao>
        );
      }}
    />
  );
}

const estilos = StyleSheet.create({
  celula: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, minWidth: 60 },
  toma: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 11, paddingVertical: 7,
    borderRadius: 999, borderWidth: 1.2,
  },
});
