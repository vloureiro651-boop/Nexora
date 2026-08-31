import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Botao, Cabecalho, Cartao, Chave, Etiqueta, Segmentado, useTema, Vazio } from '../components/ui';
import { useApp } from '../lib/store';
import { useNav } from '../lib/nav';
import { Visita, nomePapel, profPorId } from '../lib/data';
import { DIAS_CURTO, MESES, formatarData, formatarDataLonga, isoDe, minutosParaTexto, semanaAtual } from '../lib/formatos';
import { serif } from '../lib/theme';

function tomEstado(estado: Visita['estado']): string {
  if (estado === 'concluida') return 'verde';
  if (estado === 'em_curso') return 'info';
  if (estado === 'cancelada') return 'neutro';
  return 'bege';
}

function rotuloEstado(estado: Visita['estado']): string {
  if (estado === 'concluida') return 'Concluída';
  if (estado === 'em_curso') return 'Em curso';
  if (estado === 'cancelada') return 'Cancelada';
  return 'Planeada';
}

/* ------------------------------------------------------------------- AGENDA */
export function AgendaScreen() {
  const t = useTema();
  const app = useApp();
  const nav = useNav();
  const semana = useMemo(() => semanaAtual(), []);
  const [diaSelecionado, setDiaSelecionado] = useState(isoDe(0));
  const [actualizar, setActualizar] = useState(false);

  const visitasDia = app.visitas
    .filter((v) => v.data === diaSelecionado)
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
  const concluidas = visitasDia.filter((v) => v.estado === 'concluida').length;
  const minutos = visitasDia.filter((v) => v.estado !== 'cancelada').reduce((s, v) => s + v.duracao, 0);
  const partes = diaSelecionado.split('-').map(Number);

  const carregar = () => {
    setActualizar(true);
    setTimeout(() => setActualizar(false), 900);
  };

  return (
    <FlatList
      data={visitasDia}
      keyExtractor={(v) => v.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={actualizar} onRefresh={carregar} tintColor={t.primaria} />}
      ListHeaderComponent={
        <View>
          <Cabecalho
            titulo="Agenda"
            subtitulo="Planeamento semanal da equipa no domicílio."
            acoes={<Botao titulo="Nova visita" icone="add" pequeno onPress={() => nav.novaVisita()} />}
          />

          <Cartao style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ color: t.texto, fontFamily: serif, fontSize: 16, fontWeight: '700' }}>
                {MESES[partes[1] - 1]} {partes[0]}
              </Text>
              <Botao titulo="Hoje" icone="today-outline" pequeno tipo="fantasma" onPress={() => setDiaSelecionado(isoDe(0))} />
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {semana.map((d) => {
                const ativo = d.iso === diaSelecionado;
                const total = app.visitas.filter((v) => v.data === d.iso).length;
                return (
                  <Text
                    key={d.iso}
                    onPress={() => setDiaSelecionado(d.iso)}
                    style={{
                      flex: 1, textAlign: 'center', paddingVertical: 10, borderRadius: 14,
                      backgroundColor: ativo ? t.primaria : t.escuro ? t.superficieAlta : '#F4F1E8',
                      color: ativo ? '#F7F5EE' : t.texto, fontWeight: '700', fontSize: 13, overflow: 'hidden',
                    }}
                  >
                    {d.dia}
                    {'\n'}
                    <Text style={{ color: ativo ? '#F7F5EE' : t.textoFraca, fontSize: 15, fontWeight: '800' }}>{d.numero}</Text>
                    {'\n'}
                    <Text style={{ color: ativo ? coresBege : t.textoFraca, fontSize: 10 }}>{total} vis.</Text>
                  </Text>
                );
              })}
            </View>
          </Cartao>

          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
            <Cartao style={{ flex: 1, paddingVertical: 12 }}>
              <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>Visitas</Text>
              <Text style={{ color: t.texto, fontFamily: serif, fontSize: 20, fontWeight: '700', marginTop: 2 }}>{visitasDia.length}</Text>
            </Cartao>
            <Cartao style={{ flex: 1, paddingVertical: 12 }}>
              <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>Concluídas</Text>
              <Text style={{ color: t.primaria, fontFamily: serif, fontSize: 20, fontWeight: '700', marginTop: 2 }}>{concluidas}</Text>
            </Cartao>
            <Cartao style={{ flex: 1, paddingVertical: 12 }}>
              <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>Carga</Text>
              <Text style={{ color: t.texto, fontFamily: serif, fontSize: 20, fontWeight: '700', marginTop: 2 }}>{minutosParaTexto(minutos)}</Text>
            </Cartao>
          </View>

          <Text style={{ color: t.textoMedia, fontSize: 12.5, marginBottom: 10, fontWeight: '700' }}>
            {formatarDataLonga(diaSelecionado)}
          </Text>
        </View>
      }
      ListEmptyComponent={
        <Vazio
          icone="calendar-outline"
          titulo="Dia livre"
          texto="Não existem visitas agendadas para este dia. Pode planear uma nova visita ao domicílio."
          acao={<Botao titulo="Agendar visita" icone="add" onPress={() => nav.novaVisita()} />}
        />
      }
      renderItem={({ item }) => {
        const utente = app.obterUtente(item.utenteId);
        const prof = profPorId(item.profissionalId);
        return (
          <Cartao style={{ marginBottom: 10 }} onPress={() => nav.irParaUtente(item.utenteId)}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ alignItems: 'center', width: 54 }}>
                <Text style={{ color: t.texto, fontFamily: serif, fontSize: 15.5, fontWeight: '700' }}>{item.inicio.replace(':', 'h')}</Text>
                <Text style={{ color: t.textoFraca, fontSize: 10.5, marginTop: 2 }}>{minutosParaTexto(item.duracao)}</Text>
                <View style={{ width: 2, flex: 1, backgroundColor: t.bege, marginTop: 8, borderRadius: 2, minHeight: 18 }} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: t.texto, fontWeight: '700', fontSize: 14.5, flex: 1 }} numberOfLines={1}>{utente.nome}</Text>
                  <Etiqueta texto={rotuloEstado(item.estado)} tom={tomEstado(item.estado)} />
                </View>
                <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 3 }}>{item.tipo}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <Avatar nome={prof.nome} tamanho={22} />
                  <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>{prof.nome} · {nomePapel(prof.papel)}</Text>
                </View>
              </View>
            </View>
          </Cartao>
        );
      }}
    />
  );
}

const coresBege = '#E7DCC6';

/* ------------------------------------------------------------------ VISITAS */
export function VisitasScreen() {
  const t = useTema();
  const app = useApp();
  const nav = useNav();
  const [filtro, setFiltro] = useState<'hoje' | 'pendentes' | 'curso' | 'concluidas'>('hoje');
  const [aberta, setAberta] = useState<string | null>(null);
  const [actualizar, setActualizar] = useState(false);

  const hoje = isoDe(0);
  const lista = useMemo(() => {
    const base = [...app.visitas].sort((a, b) => (a.data === b.data ? a.inicio.localeCompare(b.inicio) : a.data.localeCompare(b.data)));
    if (filtro === 'hoje') return base.filter((v) => v.data === hoje);
    if (filtro === 'pendentes') return base.filter((v) => v.estado === 'planeada');
    if (filtro === 'curso') return base.filter((v) => v.estado === 'em_curso');
    return base.filter((v) => v.estado === 'concluida');
  }, [app.visitas, filtro, hoje]);

  const carregar = () => {
    setActualizar(true);
    setTimeout(() => setActualizar(false), 900);
  };

  return (
    <FlatList
      data={lista}
      keyExtractor={(v) => v.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={actualizar} onRefresh={carregar} tintColor={t.primaria} />}
      ListHeaderComponent={
        <View>
          <Cabecalho
            titulo="Visitas"
            subtitulo="Execução, checklist e registo clínico de cada visita ao domicílio."
            acoes={<Botao titulo="Nova" icone="add" pequeno onPress={() => nav.novaVisita()} />}
          />
          <Segmentado
            valor={filtro}
            onChange={setFiltro}
            opcoes={[
              { id: 'hoje', rotulo: 'Hoje', icone: 'today-outline' },
              { id: 'pendentes', rotulo: 'Pendentes', icone: 'time-outline' },
              { id: 'curso', rotulo: 'Em curso', icone: 'play-outline' },
              { id: 'concluidas', rotulo: 'Concluídas', icone: 'checkmark-done-outline' },
            ]}
          />
        </View>
      }
      ListEmptyComponent={
        <Vazio
          icone="walk-outline"
          titulo="Sem visitas neste filtro"
          texto="Altere o filtro acima ou agende uma nova visita ao domicílio."
          acao={<Botao titulo="Agendar visita" icone="add" onPress={() => nav.novaVisita()} />}
        />
      }
      renderItem={({ item }) => {
        const utente = app.obterUtente(item.utenteId);
        const prof = profPorId(item.profissionalId);
        const expandida = aberta === item.id;
        const feitas = item.tarefas.filter((x) => x.feito).length;
        return (
          <Cartao style={{ marginBottom: 12 }}>
            <Pressable onPress={() => setAberta(expandida ? null : item.id)} style={{ flexDirection: 'row', gap: 12 }}>
              <Avatar nome={utente.nome} tamanho={44} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: t.texto, fontFamily: serif, fontSize: 15.5, fontWeight: '700', flex: 1 }} numberOfLines={1}>{utente.nome}</Text>
                  <Etiqueta texto={rotuloEstado(item.estado)} tom={tomEstado(item.estado)} />
                </View>
                <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 3 }}>{item.tipo}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="calendar-outline" size={12} color={t.textoFraca} />
                    <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>{formatarData(item.data)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="time-outline" size={12} color={t.textoFraca} />
                    <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>{item.inicio.replace(':', 'h')} · {minutosParaTexto(item.duracao)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="person-outline" size={12} color={t.textoFraca} />
                    <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>{prof.nome}</Text>
                  </View>
                </View>
              </View>
              <Text style={{ color: t.primaria, fontSize: 18, paddingHorizontal: 4 }}>{expandida ? '▾' : '▸'}</Text>
            </Pressable>

            {expandida ? (
              <View style={{ marginTop: 14, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.linha }}>
                <Text style={{ color: t.textoMedia, fontSize: 12, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
                  Checklist da visita · {feitas}/{item.tarefas.length}
                </Text>
                {item.tarefas.map((tf, i) => (
                  <Chave
                    key={tf.texto}
                    rotulo={tf.texto}
                    ativo={tf.feito}
                    onToggle={() => app.alternarTarefa(item.id, i)}
                  />
                ))}
                {item.notas ? (
                  <View style={{ backgroundColor: t.begeSuave, borderRadius: 12, padding: 12, marginTop: 8 }}>
                    <Text style={{ color: t.textoMedia, fontSize: 12, fontStyle: 'italic', lineHeight: 18 }}>{item.notas}</Text>
                  </View>
                ) : null}
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                  {item.estado === 'planeada' ? (
                    <Botao titulo="Iniciar visita" icone="play" pequeno onPress={() => app.alterarEstadoVisita(item.id, 'em_curso')} />
                  ) : null}
                  {item.estado === 'em_curso' ? (
                    <Botao titulo="Concluir visita" icone="checkmark-done" pequeno onPress={() => app.alterarEstadoVisita(item.id, 'concluida')} />
                  ) : null}
                  <Botao titulo="Ficha do utente" icone="person-outline" pequeno tipo="secundario" onPress={() => nav.irParaUtente(item.utenteId)} />
                  <Botao titulo="Registar sinais" icone="heart-outline" pequeno tipo="fantasma" onPress={() => nav.irParaSecao('sinais')} />
                </View>
              </View>
            ) : null}
          </Cartao>
        );
      }}
    />
  );
}
