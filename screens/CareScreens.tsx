import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Avatar, BarraPesquisa, Botao, Cabecalho, Cartao, Chip, Etiqueta, Progresso, Sparkline, useTema, Vazio,
} from '../components/ui';
import { useApp } from '../lib/store';
import { useNav } from '../lib/nav';
import { AVALIACOES, CUIDADOS, DIAGNOSTICOS, INTERVENCOES, PLANOS } from '../lib/data';
import { formatarData } from '../lib/formatos';
import { serif } from '../lib/theme';

/* ---------------------------------------------------------------- CUIDADOS */
export function CuidadosScreen() {
  const t = useTema();
  const app = useApp();
  const nav = useNav();
  const [pesquisa, setPesquisa] = useState('');
  const [categoria, setCategoria] = useState('Todas');

  const categorias = useMemo(() => ['Todas', ...Array.from(new Set(CUIDADOS.map((c) => c.categoria)))], []);
  const lista = CUIDADOS.filter((c) => (categoria === 'Todas' ? true : c.categoria === categoria))
    .filter((c) => {
      const q = pesquisa.trim().toLowerCase();
      return !q || c.nome.toLowerCase().includes(q) || c.descricao.toLowerCase().includes(q);
    });

  return (
    <FlatList
      data={lista}
      keyExtractor={(c) => c.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      ListHeaderComponent={
        <View>
          <Cabecalho titulo="Cuidados" subtitulo="Catálogo de cuidados prestados no domicílio, com frequência e duração média." />
          <BarraPesquisa valor={pesquisa} onChangeText={setPesquisa} placeholder="Pesquisar cuidado…" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {categorias.map((c) => (
              <Chip key={c} rotulo={c} ativo={categoria === c} onPress={() => setCategoria(c)} />
            ))}
          </View>
        </View>
      }
      ListEmptyComponent={<Vazio icone="hand-left-outline" titulo="Sem cuidados" texto="Nenhum cuidado corresponde à pesquisa efetuada." />}
      renderItem={({ item }) => (
        <Cartao style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: t.primariaSuave, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={item.icone as any} size={20} color={t.primaria} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: t.texto, fontFamily: serif, fontSize: 15.5, fontWeight: '700' }}>{item.nome}</Text>
              <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 4, lineHeight: 18 }}>{item.descricao}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
            <Etiqueta texto={item.categoria} tom="bege" />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="repeat-outline" size={12} color={t.textoFraca} />
              <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>{item.frequencia}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="time-outline" size={12} color={t.textoFraca} />
              <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>{item.duracao}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.linha }}>
            <Text style={{ color: t.textoFraca, fontSize: 11.5, marginRight: 4 }}>Utentes:</Text>
            {item.utentes.slice(0, 4).map((id) => (
              <Pressable key={id} onPress={() => nav.irParaUtente(id)} style={{ marginHorizontal: 2 }}>
                <Avatar nome={app.obterUtente(id).nome} tamanho={26} />
              </Pressable>
            ))}
            <View style={{ flex: 1 }} />
            <Botao titulo="Abrir ficha" icone="arrow-forward" pequeno tipo="fantasma" onPress={() => nav.irParaUtente(item.utentes[0])} />
          </View>
        </Cartao>
      )}
    />
  );
}

/* --------------------------------------------------------- PLANOS DE CUIDADOS */
export function PlanosScreen() {
  const t = useTema();
  const app = useApp();
  const nav = useNav();
  const [filtro, setFiltro] = useState<'todos' | 'Ativo' | 'A rever' | 'Concluído'>('todos');
  const lista = PLANOS.filter((p) => (filtro === 'todos' ? true : p.estado === filtro));

  const tom = (estado: string) => (estado === 'Ativo' ? 'verde' : estado === 'A rever' ? 'alerta' : 'info');

  return (
    <FlatList
      data={lista}
      keyExtractor={(p) => p.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      ListHeaderComponent={
        <View>
          <Cabecalho titulo="Planos de cuidados" subtitulo="Objetivos, intervenções e datas de revisão por utente." />
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <Chip rotulo="Todos" ativo={filtro === 'todos'} onPress={() => setFiltro('todos')} />
            <Chip rotulo="Ativos" ativo={filtro === 'Ativo'} onPress={() => setFiltro('Ativo')} />
            <Chip rotulo="A rever" ativo={filtro === 'A rever'} onPress={() => setFiltro('A rever')} />
            <Chip rotulo="Concluídos" ativo={filtro === 'Concluído'} onPress={() => setFiltro('Concluído')} />
          </View>
        </View>
      }
      ListEmptyComponent={<Vazio icone="clipboard-outline" titulo="Sem planos" texto="Não existem planos de cuidados neste estado." />}
      renderItem={({ item }) => {
        const utente = app.obterUtente(item.utenteId);
        return (
          <Cartao style={{ marginBottom: 12 }} onPress={() => nav.irParaUtente(item.utenteId)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ color: t.texto, fontFamily: serif, fontSize: 16, fontWeight: '700', flex: 1 }}>{item.titulo}</Text>
              <Etiqueta texto={item.estado} tom={tom(item.estado)} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <Avatar nome={utente.nome} tamanho={22} />
              <Text style={{ color: t.textoMedia, fontSize: 12.5 }}>{utente.nome}</Text>
            </View>

            <View style={{ marginTop: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>Progresso dos objetivos</Text>
                <Text style={{ color: t.primaria, fontSize: 11.5, fontWeight: '800' }}>{item.progresso}%</Text>
              </View>
              <Progresso valor={item.progresso} />
            </View>

            <View style={{ marginTop: 14 }}>
              <Text style={{ color: t.textoMedia, fontSize: 11.5, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Objetivos</Text>
              {item.objetivos.map((o) => (
                <View key={o} style={{ flexDirection: 'row', gap: 8, marginBottom: 5 }}>
                  <Ionicons name="ellipse" size={6} color={t.primaria} style={{ marginTop: 6 }} />
                  <Text style={{ color: t.textoMedia, fontSize: 12.5, flex: 1, lineHeight: 18 }}>{o}</Text>
                </View>
              ))}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.linha, flexWrap: 'wrap' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Ionicons name="flag-outline" size={13} color={t.textoFraca} />
                <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>Início {formatarData(item.inicio)}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Ionicons name="refresh-outline" size={13} color={item.estado === 'A rever' ? t.alerta : t.textoFraca} />
                <Text style={{ color: item.estado === 'A rever' ? t.alerta : t.textoFraca, fontSize: 11.5, fontWeight: item.estado === 'A rever' ? '700' : '400' }}>
                  Revisão {formatarData(item.revisao)}
                </Text>
              </View>
              <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>{item.intervencoes.length} intervenções</Text>
            </View>
          </Cartao>
        );
      }}
    />
  );
}

/* -------------------------------------------------------------- AVALIAÇÕES */
export function AvaliacoesScreen() {
  const t = useTema();
  const app = useApp();
  const nav = useNav();
  return (
    <FlatList
      data={AVALIACOES}
      keyExtractor={(a) => a.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      ListHeaderComponent={
        <Cabecalho titulo="Avaliações" subtitulo="Escalas validadas de autonomia, risco e dor com respetiva evolução." />
      }
      renderItem={({ item }) => {
        const utente = app.obterUtente(item.utenteId);
        const percentagem = Math.round((item.score / item.maximo) * 100);
        const melhora = item.historico[item.historico.length - 1] >= item.historico[0];
        return (
          <Cartao style={{ marginBottom: 12 }} onPress={() => nav.irParaUtente(item.utenteId)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ color: t.texto, fontFamily: serif, fontSize: 15.5, fontWeight: '700', flex: 1 }}>{item.escala}</Text>
              <Etiqueta texto={item.classificacao} tom={melhora ? 'verde' : 'alerta'} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 14, marginTop: 12 }}>
              <View>
                <Text style={{ color: t.texto, fontFamily: serif, fontSize: 30, fontWeight: '700' }}>{item.score}</Text>
                <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>de {item.maximo} pontos</Text>
              </View>
              <View style={{ flex: 1, marginBottom: 6 }}>
                <Progresso valor={percentagem} cor={melhora ? t.primaria : t.alerta} />
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <Sparkline dados={item.historico} cor={melhora ? t.primaria : t.alerta} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.linha }}>
              <Avatar nome={utente.nome} tamanho={22} />
              <Text style={{ color: t.textoMedia, fontSize: 12.5, flex: 1 }}>{utente.nome}</Text>
              <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>{formatarData(item.data, true)}</Text>
            </View>
          </Cartao>
        );
      }}
    />
  );
}

/* ------------------------------------------------------------ DIAGNÓSTICOS */
export function DiagnosticosScreen() {
  const t = useTema();
  const app = useApp();
  const nav = useNav();
  const [apenasAtivos, setApenasAtivos] = useState(true);
  const lista = DIAGNOSTICOS.filter((d) => (apenasAtivos ? d.estado === 'Ativo' : true));

  return (
    <FlatList
      data={lista}
      keyExtractor={(d) => d.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      ListHeaderComponent={
        <View>
          <Cabecalho titulo="Diagnósticos" subtitulo="Diagnósticos de enfermagem, fatores relacionados e grau de confiança." />
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
            <Chip rotulo="Ativos" icone="pulse-outline" ativo={apenasAtivos} onPress={() => setApenasAtivos(true)} />
            <Chip rotulo="Incluir resolvidos" ativo={!apenasAtivos} onPress={() => setApenasAtivos(false)} />
          </View>
        </View>
      }
      ListEmptyComponent={<Vazio icone="pulse-outline" titulo="Sem diagnósticos" texto="Não existem diagnósticos de enfermagem registados." />}
      renderItem={({ item }) => {
        const utente = app.obterUtente(item.utenteId);
        return (
          <Cartao style={{ marginBottom: 12 }} onPress={() => nav.irParaUtente(item.utenteId)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, backgroundColor: t.primariaSuave }}>
                <Text style={{ color: t.primaria, fontSize: 11, fontWeight: '800' }}>NANDA {item.codigo}</Text>
              </View>
              <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>{utente.nome}</Text>
              <View style={{ flex: 1 }} />
              <Etiqueta texto={item.estado} tom={item.estado === 'Ativo' ? 'verde' : 'neutro'} />
            </View>
            <Text style={{ color: t.texto, fontFamily: serif, fontSize: 16, fontWeight: '700', marginTop: 10 }}>{item.descricao}</Text>
            <View style={{ marginTop: 8 }}>
              <Text style={{ color: t.textoMedia, fontSize: 12.5, lineHeight: 18 }}>
                <Text style={{ fontWeight: '700' }}>Fatores: </Text>{item.fatores}
              </Text>
              <Text style={{ color: t.textoMedia, fontSize: 12.5, lineHeight: 18, marginTop: 4 }}>
                <Text style={{ fontWeight: '700' }}>Relacionado com: </Text>{item.relacionados}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.linha }}>
              <Ionicons name="shield-checkmark-outline" size={14} color={t.textoFraca} />
              <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>Confiança {item.confianca.toLowerCase()}</Text>
            </View>
          </Cartao>
        );
      }}
    />
  );
}

/* ------------------------------------------------------------ INTERVENÇÕES */
export function IntervencoesScreen() {
  const t = useTema();
  const app = useApp();
  const nav = useNav();
  const [tipo, setTipo] = useState('Todos');
  const tipos = useMemo(() => ['Todos', ...Array.from(new Set(INTERVENCOES.map((i) => i.tipo)))], []);
  const lista = INTERVENCOES.filter((i) => (tipo === 'Todos' ? true : i.tipo === tipo));

  return (
    <FlatList
      data={lista}
      keyExtractor={(i) => i.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      ListHeaderComponent={
        <View>
          <Cabecalho titulo="Intervenções" subtitulo="Ações de enfermagem realizadas, objetivos e resultados obtidos." />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {tipos.map((x) => (
              <Chip key={x} rotulo={x} ativo={tipo === x} onPress={() => setTipo(x)} />
            ))}
          </View>
        </View>
      }
      ListEmptyComponent={<Vazio icone="construct-outline" titulo="Sem intervenções" texto="Não existem intervenções deste tipo registadas." />}
      renderItem={({ item }) => {
        const utente = app.obterUtente(item.utenteId);
        return (
          <Cartao style={{ marginBottom: 12 }} onPress={() => nav.irParaUtente(item.utenteId)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Etiqueta texto={item.tipo} tom="bege" />
              <Text style={{ color: t.textoFraca, fontSize: 11.5, flex: 1 }}>{utente.nome}</Text>
              <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>{formatarData(item.data)}</Text>
            </View>
            <Text style={{ color: t.texto, fontSize: 14.5, fontWeight: '700', marginTop: 10, lineHeight: 20 }}>{item.descricao}</Text>
            <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 6, lineHeight: 18 }}>
              <Text style={{ fontWeight: '700' }}>Objetivo: </Text>{item.objetivo}
            </Text>
            <View style={{ backgroundColor: t.primariaSuave, borderRadius: 12, padding: 11, marginTop: 10 }}>
              <Text style={{ color: t.primaria, fontSize: 12, fontWeight: '800', marginBottom: 2 }}>Resultado</Text>
              <Text style={{ color: t.texto, fontSize: 12.5, lineHeight: 18 }}>{item.resultado}</Text>
            </View>
          </Cartao>
        );
      }}
    />
  );
}
