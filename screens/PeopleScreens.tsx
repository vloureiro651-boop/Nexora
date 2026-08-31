import React, { useMemo, useState } from 'react';
import { FlatList, Linking, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, BarraPesquisa, Botao, Cabecalho, Cartao, Chip, Etiqueta, ModalBase, useTema, Vazio } from '../components/ui';
import { ModalUtente } from '../components/FormUtente';
import { useApp } from '../lib/store';
import { useNav } from '../lib/nav';
import { PROFISSIONAIS, Risco, UTENTES, Utente, nomePapel } from '../lib/data';
import { formatarData, idadeDe, isoDe } from '../lib/formatos';
import { serif } from '../lib/theme';

const TOM_RISCO: Record<Risco, string> = { Alto: 'perigo', 'Médio': 'alerta', Baixo: 'verde' };

/* ------------------------------------------------------------------ UTENTES */
export function UtentesScreen() {
  const t = useTema();
  const app = useApp();
  const nav = useNav();
  const [pesquisa, setPesquisa] = useState('');
  const [filtro, setFiltro] = useState<'todos' | Risco>('todos');
  const [actualizar, setActualizar] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [emEdicao, setEmEdicao] = useState<Utente | null>(null);
  const [paraRemover, setParaRemover] = useState<Utente | null>(null);

  const hoje = isoDe(0);

  const lista = useMemo(() => {
    const q = pesquisa.trim().toLowerCase();
    return app.utentes
      .filter((u) => (filtro === 'todos' ? true : u.risco === filtro))
      .filter((u) => !q || u.nome.toLowerCase().includes(q) || u.diagnostico.toLowerCase().includes(q) || u.concelho.toLowerCase().includes(q));
  }, [app.utentes, filtro, pesquisa]);

  const proximaVisita = (utenteId: string) => {
    const futuras = app.visitas
      .filter((v) => v.utenteId === utenteId && v.data >= hoje)
      .sort((a, b) => (a.data === b.data ? a.inicio.localeCompare(b.inicio) : a.data.localeCompare(b.data)));
    return futuras[0] || null;
  };

  const carregar = () => {
    setActualizar(true);
    setTimeout(() => setActualizar(false), 900);
  };

  const abrirNovo = () => {
    setEmEdicao(null);
    setModalAberto(true);
  };

  const abrirEdicao = (u: Utente) => {
    setEmEdicao(u);
    setModalAberto(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={lista}
        keyExtractor={(u) => u.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={actualizar} onRefresh={carregar} tintColor={t.primaria} />}
        ListHeaderComponent={
          <View>
            <Cabecalho
              titulo="Utentes"
              subtitulo={`${app.utentes.length} pessoas sob cuidado no domicílio — toque para abrir a ficha clínica.`}
              acoes={<Botao titulo="Novo utente" icone="person-add" pequeno onPress={abrirNovo} />}
            />

            <View style={[estilos.resumo, { backgroundColor: t.primariaSuave }]}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.primaria, fontSize: 12, fontWeight: '800', letterSpacing: 0.4 }}>
                  GESTÃO DE UTENTES
                </Text>
                <Text style={{ color: t.textoMedia, fontSize: 12, marginTop: 3, lineHeight: 18 }}>
                  Crie, edite e remova doentes da plataforma. As alterações ficam guardadas no dispositivo e refletem-se em todas as secções clínicas.
                </Text>
              </View>
              <Pressable onPress={abrirNovo} style={[estilos.botaoResumo, { backgroundColor: t.primaria }]}>
                <Ionicons name="add" size={20} color="#fff" />
              </Pressable>
            </View>

            <BarraPesquisa valor={pesquisa} onChangeText={setPesquisa} placeholder="Pesquisar por nome, diagnóstico ou concelho…" />
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              <Chip rotulo={`Todos (${app.utentes.length})`} ativo={filtro === 'todos'} onPress={() => setFiltro('todos')} />
              <Chip rotulo="Risco alto" ativo={filtro === 'Alto'} onPress={() => setFiltro('Alto')} />
              <Chip rotulo="Risco médio" ativo={filtro === 'Médio'} onPress={() => setFiltro('Médio')} />
              <Chip rotulo="Risco baixo" ativo={filtro === 'Baixo'} onPress={() => setFiltro('Baixo')} />
            </View>
          </View>
        }
        ListEmptyComponent={
          <Vazio
            icone="people-outline"
            titulo={app.utentes.length ? 'Sem resultados' : 'Ainda sem utentes'}
            texto={app.utentes.length
              ? 'Não encontrámos utentes com estes critérios. Ajuste a pesquisa ou o filtro de risco.'
              : 'Comece por acrescentar o primeiro doente à plataforma de cuidados.'}
            acao={!app.utentes.length ? <Botao titulo="Criar primeiro utente" icone="person-add" onPress={abrirNovo} /> : undefined}
          />
        }
        renderItem={({ item }) => {
          const prox = proximaVisita(item.id);
          return (
            <Cartao style={{ marginBottom: 12 }} onPress={() => nav.irParaUtente(item.id)}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Avatar nome={item.nome} tamanho={46} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ color: t.texto, fontFamily: serif, fontSize: 16, fontWeight: '700', flex: 1 }} numberOfLines={1}>{item.nome}</Text>
                    <Etiqueta texto={`Risco ${item.risco.toLowerCase()}`} tom={TOM_RISCO[item.risco]} />
                  </View>
                  <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 3 }}>
                    {idadeDe(item.nascimento)} anos · {item.sexo === 'F' ? 'Feminino' : 'Masculino'} · {item.concelho}
                  </Text>
                  <Text style={{ color: t.textoFraca, fontSize: 12.5, marginTop: 6, lineHeight: 17 }} numberOfLines={2}>
                    {item.diagnostico}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.linha, flexWrap: 'wrap' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1, minWidth: 120 }}>
                  <Ionicons name="home-outline" size={13} color={t.textoFraca} />
                  <Text style={{ color: t.textoFraca, fontSize: 11.5 }} numberOfLines={1}>{item.morada}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Ionicons name="calendar-outline" size={13} color={prox ? t.primaria : t.textoFraca} />
                  <Text style={{ color: prox ? t.primaria : t.textoFraca, fontSize: 11.5, fontWeight: prox ? '700' : '400' }}>
                    {prox ? `${formatarData(prox.data)} · ${prox.inicio.replace(':', 'h')}` : 'Sem visita marcada'}
                  </Text>
                </View>
                <Pressable
                  onPress={() => abrirEdicao(item)}
                  hitSlop={8}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1.2, borderColor: t.linha }}
                >
                  <Ionicons name="create-outline" size={13} color={t.primaria} />
                  <Text style={{ color: t.primaria, fontSize: 11.5, fontWeight: '700' }}>Editar</Text>
                </Pressable>
                <Pressable
                  onPress={() => setParaRemover(item)}
                  hitSlop={8}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1.2, borderColor: '#E3C4BB' }}
                >
                  <Ionicons name="trash-outline" size={13} color={t.perigo} />
                  <Text style={{ color: t.perigo, fontSize: 11.5, fontWeight: '700' }}>Remover</Text>
                </Pressable>
              </View>
            </Cartao>
          );
        }}
      />

      <ModalUtente
        visivel={modalAberto}
        fechar={() => setModalAberto(false)}
        utente={emEdicao}
        onGuardado={() => setActualizar(false)}
      />

      <ModalBase
        visivel={!!paraRemover}
        fechar={() => setParaRemover(null)}
        titulo="Remover utente ativo"
        subtitulo="Confirme a remoção do doente da plataforma."
      >
        {paraRemover ? (
          <View>
            <View style={{ backgroundColor: '#F6E2DC', borderRadius: 14, padding: 14, marginBottom: 16, flexDirection: 'row', gap: 10 }}>
              <Ionicons name="warning-outline" size={20} color="#8E3423" />
              <Text style={{ color: '#8E3423', fontSize: 12.5, flex: 1, lineHeight: 18 }}>
                Vai remover <Text style={{ fontWeight: '800' }}>{paraRemover.nome}</Text> e todos os registos clínicos associados ({app.visitas.filter((v) => v.utenteId === paraRemover.id).length} visita(s), {app.sinais.filter((s) => s.utenteId === paraRemover.id).length} registo(s) de sinais vitais, {app.feridas.filter((f) => f.utenteId === paraRemover.id).length} ferida(s)). Esta ação não pode ser desfeita.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Botao titulo="Manter utente" tipo="secundario" onPress={() => setParaRemover(null)} />
              <Botao
                titulo="Remover"
                icone="trash-outline"
                tipo="perigo"
                onPress={() => {
                  app.removerUtente(paraRemover.id);
                  setParaRemover(null);
                }}
              />
            </View>
          </View>
        ) : null}
      </ModalBase>
    </View>
  );
}

/* ------------------------------------------------------------ PROFISSIONAIS */
export function ProfissionaisScreen() {
  const t = useTema();
  const app = useApp();
  const [actualizar, setActualizar] = useState(false);
  const [disponiveis, setDisponiveis] = useState<Record<string, boolean>>(
    PROFISSIONAIS.reduce((acc, p) => ({ ...acc, [p.id]: p.disponivel }), {}),
  );

  const carregar = () => {
    setActualizar(true);
    setTimeout(() => setActualizar(false), 900);
  };

  const contactar = (telefone: string) => {
    Linking.openURL(`tel:${telefone.replace(/\s/g, '')}`).catch(() => undefined);
  };

  return (
    <FlatList
      data={PROFISSIONAIS}
      keyExtractor={(p) => p.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={actualizar} onRefresh={carregar} tintColor={t.primaria} />}
      ListHeaderComponent={
        <Cabecalho
          titulo="Profissionais"
          subtitulo="A equipa multidisciplinar que leva os cuidados ao domicílio."
        />
      }
      renderItem={({ item }) => {
        const utentesAtribuidos = Array.from(new Set(app.visitas.filter((v) => v.profissionalId === item.id).map((v) => v.utenteId)));
        const ativo = disponiveis[item.id] !== false;
        return (
          <Cartao style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Avatar nome={item.nome} tamanho={46} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.texto, fontFamily: serif, fontSize: 16, fontWeight: '700' }}>{item.nome}</Text>
                <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 2 }}>{item.especialidade}</Text>
              </View>
              <Etiqueta texto={nomePapel(item.papel)} tom={item.papel === 'enfermeiro' ? 'verde' : item.papel === 'gestor' ? 'info' : 'bege'} />
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
              <View style={[estilos.pilulaDado, { backgroundColor: t.primariaSuave }]}>
                <Ionicons name="walk-outline" size={13} color={t.primaria} />
                <Text style={{ color: t.primaria, fontSize: 11.5, fontWeight: '700' }}>{item.visitasHoje} visitas hoje</Text>
              </View>
              <View style={[estilos.pilulaDado, { backgroundColor: t.begeSuave }]}>
                <Ionicons name="people-outline" size={13} color={t.bege} />
                <Text style={{ color: t.textoMedia, fontSize: 11.5, fontWeight: '700' }}>{utentesAtribuidos.length} utentes</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.linha }}>
              <Botao titulo={item.telefone} icone="call-outline" pequeno tipo="fantasma" onPress={() => contactar(item.telefone)} />
              <View style={{ flex: 1 }} />
              <Text style={{ color: t.textoFraca, fontSize: 11.5, marginRight: 6 }}>Disponível</Text>
              <Chip
                rotulo={ativo ? 'Sim' : 'Não'}
                ativo={ativo}
                onPress={() => setDisponiveis((d) => ({ ...d, [item.id]: !d[item.id] }))}
              />
            </View>
          </Cartao>
        );
      }}
    />
  );
}

const estilos = StyleSheet.create({
  pilulaDado: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999,
  },
  resumo: {
    flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 18, padding: 14, marginBottom: 14,
  },
  botaoResumo: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});

export const UTENTES_SEMENTE = UTENTES;
