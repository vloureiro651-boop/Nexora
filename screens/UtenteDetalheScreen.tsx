import React, { useEffect, useMemo, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Avatar, Botao, BotaoIcone, Cabecalho, Cartao, Chip, Etiqueta, ModalBase, Progresso, Sparkline, useTema,
} from '../components/ui';
import { ModalUtente } from '../components/FormUtente';
import { useApp } from '../lib/store';
import { PLANOS, profPorId, Risco } from '../lib/data';
import { formatarData, idadeDe, isoDe, minutosParaTexto } from '../lib/formatos';
import { serif } from '../lib/theme';

type Aba = 'resumo' | 'sinais' | 'feridas' | 'medicacao' | 'plano';

const TOM_RISCO: Record<Risco, string> = { Alto: 'perigo', 'Médio': 'alerta', Baixo: 'verde' };

export function UtenteDetalheScreen({ utenteId, voltar }: { utenteId: string; voltar: () => void }) {
  const t = useTema();
  const app = useApp();
  const insets = useSafeAreaInsets();
  const [aba, setAba] = useState<Aba>('resumo');
  const [modalEdicao, setModalEdicao] = useState(false);
  const [confirmarRemocao, setConfirmarRemocao] = useState(false);
  const utente = app.obterUtente(utenteId);
  const existe = app.utentes.some((u) => u.id === utenteId);

  useEffect(() => {
    if (!existe) voltar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existe]);

  const visitas = useMemo(
    () => app.visitas.filter((v) => v.utenteId === utenteId).sort((a, b) => b.data.localeCompare(a.data)),
    [app.visitas, utenteId],
  );
  const sinais = useMemo(() => app.sinais.filter((s) => s.utenteId === utenteId), [app.sinais, utenteId]);
  const feridas = app.feridas.filter((f) => f.utenteId === utenteId);
  const meds = app.medicacao.filter((m) => m.utenteId === utenteId);
  const plano = PLANOS.filter((p) => p.utenteId === utenteId)[0];
  const prof = profPorId(utente.profissionalId);
  const hoje = isoDe(0);

  const ligar = (num: string) => Linking.openURL(`tel:${num.replace(/\s/g, '')}`).catch(() => undefined);

  return (
    <View style={{ flex: 1, backgroundColor: t.fundo }}>
      <View style={[estilos.topo, { paddingTop: insets.top + 12, borderBottomColor: t.linha, backgroundColor: t.superficie }]}>
        <BotaoIcone icone="arrow-back" onPress={voltar} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ color: t.texto, fontFamily: serif, fontSize: 17, fontWeight: '700' }} numberOfLines={1}>{utente.nome}</Text>
          <Text style={{ color: t.textoMedia, fontSize: 12, marginTop: 1 }}>{idadeDe(utente.nascimento)} anos · {utente.concelho}</Text>
        </View>
        <Etiqueta texto={`Risco ${utente.risco.toLowerCase()}`} tom={TOM_RISCO[utente.risco]} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* ---------------------------------------------------------- IDENTIDADE */}
        <Cartao style={{ marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar nome={utente.nome} tamanho={54} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: t.texto, fontFamily: serif, fontSize: 18, fontWeight: '700' }}>{utente.nome}</Text>
              <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 3, lineHeight: 18 }}>{utente.diagnostico}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            <Botao titulo="Ligar" icone="call-outline" pequeno tipo="secundario" onPress={() => ligar(utente.telefone)} />
            <Botao titulo="Emergência" icone="alert-circle-outline" pequeno tipo="fantasma" onPress={() => ligar('912 445 118')} />
            <View style={{ flex: 1 }} />
          </View>
          <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.linha, gap: 7 }}>
            {[
              ['home-outline', utente.morada],
              ['call-outline', `${utente.telefone} · Contacto de emergência: ${utente.emergencia} (${utente.parentesco})`],
              ['medkit-outline', `Alergias: ${utente.alergias}`],
              ['person-outline', `Cuidador principal: ${utente.cuidador}`],
            ].map(([ic, txt]) => (
              <View key={txt} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <Ionicons name={ic as any} size={14} color={t.textoFraca} style={{ marginTop: 2 }} />
                <Text style={{ color: t.textoMedia, fontSize: 12.5, flex: 1, lineHeight: 18 }}>{txt}</Text>
              </View>
            ))}
          </View>
        </Cartao>

        {/* ------------------------------------------------- GESTÃO DO UTENTE */}
        <Cartao style={{ marginBottom: 14 }}>
          <Text style={[estilos.titulo, { color: t.texto }]}>Gestão do utente</Text>
          <Text style={{ color: t.textoMedia, fontSize: 12.5, lineHeight: 18, marginBottom: 12 }}>
            Edite os dados da ficha ou remova o doente da plataforma. A remoção apaga também as visitas, sinais, feridas e medicação associados.
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
            <Botao titulo="Editar ficha" icone="create-outline" pequeno tipo="secundario" onPress={() => setModalEdicao(true)} />
            <Botao titulo="Remover utente" icone="trash-outline" pequeno tipo="perigo" onPress={() => setConfirmarRemocao(true)} />
          </View>
        </Cartao>

        {/* ---------------------------------------------------------------- ABAS */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {([
            ['resumo', 'Resumo'], ['sinais', 'Sinais'], ['feridas', 'Feridas'], ['medicacao', 'Medicação'], ['plano', 'Plano'],
          ] as [Aba, string][]).map(([id, rot]) => (
            <Chip key={id} rotulo={rot} ativo={aba === id} onPress={() => setAba(id)} />
          ))}
        </View>

        {aba === 'resumo' ? (
          <View style={{ gap: 12 }}>
            <Cartao>
              <Text style={[estilos.titulo, { color: t.texto }]}>Últimas visitas</Text>
              {visitas.slice(0, 4).map((v, i) => (
                <View key={v.id}>
                  {i > 0 ? <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.linha }} /> : null}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 }}>
                    <View style={{ width: 44 }}>
                      <Text style={{ color: t.texto, fontSize: 12.5, fontWeight: '700' }}>{formatarData(v.data)}</Text>
                      <Text style={{ color: t.textoFraca, fontSize: 11 }}>{v.inicio.replace(':', 'h')}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: t.texto, fontSize: 13.5, fontWeight: '600' }}>{v.tipo}</Text>
                      <Text style={{ color: t.textoFraca, fontSize: 11.5, marginTop: 2 }}>{profPorId(v.profissionalId).nome} · {minutosParaTexto(v.duracao)}</Text>
                    </View>
                    <Etiqueta texto={v.estado === 'concluida' ? 'Concluída' : v.estado === 'em_curso' ? 'Em curso' : v.data >= hoje ? 'Planeada' : 'Planeada'} tom={v.estado === 'concluida' ? 'verde' : 'bege'} />
                  </View>
                </View>
              ))}
            </Cartao>
            <Cartao>
              <Text style={[estilos.titulo, { color: t.texto }]}>Observações de enfermagem</Text>
              <Text style={{ color: t.textoMedia, fontSize: 13, lineHeight: 20 }}>{utente.observacoes}</Text>
            </Cartao>
            <Cartao>
              <Text style={[estilos.titulo, { color: t.texto }]}>Equipa atribuída</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Avatar nome={prof.nome} tamanho={38} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: t.texto, fontSize: 13.5, fontWeight: '700' }}>{prof.nome}</Text>
                  <Text style={{ color: t.textoMedia, fontSize: 12, marginTop: 2 }}>{prof.especialidade}</Text>
                </View>
                <Botao titulo="Ligar" icone="call-outline" pequeno tipo="fantasma" onPress={() => ligar(prof.telefone)} />
              </View>
            </Cartao>
          </View>
        ) : null}

        {aba === 'sinais' ? (
          <View style={{ gap: 12 }}>
            <Cartao>
              <Text style={[estilos.titulo, { color: t.texto }]}>Tendência do pulso</Text>
              <Sparkline dados={[...sinais].reverse().map((s) => s.pulso)} cor={t.perigo} altura={54} />
              <Text style={{ color: t.textoFraca, fontSize: 11.5, marginTop: 6 }}>{sinais.length} registos clínicos</Text>
            </Cartao>
            {sinais.slice(0, 5).map((s) => (
              <Cartao key={s.id} style={{ paddingVertical: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: t.texto, fontWeight: '700', fontSize: 13.5, flex: 1 }}>{formatarData(s.data, true)} · {s.hora.replace(':', 'h')}</Text>
                  <Text style={{ color: t.textoFraca, fontSize: 11 }}>{s.autor}</Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                  {[
                    ['PA', `${s.paSis}/${s.paDia}`], ['Pulso', `${s.pulso}`], ['Temp', `${s.temp.toFixed(1)}º`],
                    ['SatO₂', `${s.spo2}%`], ['Glic.', `${s.glicemia}`], ['Peso', `${s.peso} kg`],
                  ].map(([r, v]) => (
                    <View key={r} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: t.escuro ? t.superficieAlta : '#F5F2E9' }}>
                      <Text style={{ color: t.textoFraca, fontSize: 10 }}>{r}</Text>
                      <Text style={{ color: t.texto, fontSize: 13, fontWeight: '800', marginTop: 1 }}>{v}</Text>
                    </View>
                  ))}
                </View>
              </Cartao>
            ))}
          </View>
        ) : null}

        {aba === 'feridas' ? (
          <View style={{ gap: 12 }}>
            {feridas.length === 0 ? (
              <Cartao>
                <Text style={{ color: t.textoMedia, fontSize: 13 }}>Sem feridas registadas para este utente.</Text>
              </Cartao>
            ) : feridas.map((f) => (
              <Cartao key={f.id}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: t.texto, fontFamily: serif, fontSize: 15, fontWeight: '700', flex: 1 }}>{f.local}</Text>
                  <Etiqueta texto={f.situacao} tom={f.situacao === 'Em melhoria' ? 'verde' : f.situacao === 'Estável' ? 'alerta' : 'perigo'} />
                </View>
                <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 6 }}>{f.classificacao} · {f.dimensao}</Text>
                <Sparkline dados={f.evolucao} cor={f.situacao === 'Agravada' ? t.perigo : t.primaria} altura={40} />
                <Text style={{ color: t.textoMedia, fontSize: 12, marginTop: 6, fontStyle: 'italic', lineHeight: 18 }}>{f.observacao}</Text>
              </Cartao>
            ))}
          </View>
        ) : null}

        {aba === 'medicacao' ? (
          <View style={{ gap: 12 }}>
            {meds.length === 0 ? (
              <Cartao>
                <Text style={{ color: t.textoMedia, fontSize: 13 }}>Sem medicação ativa prescrita.</Text>
              </Cartao>
            ) : meds.map((m) => {
              const pendentes = m.tomes.filter((x) => !x).length;
              return (
                <Cartao key={m.id}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ color: t.texto, fontFamily: serif, fontSize: 15, fontWeight: '700', flex: 1 }}>{m.nome}</Text>
                    {m.altoRisco ? <Etiqueta texto="Alto risco" tom="perigo" /> : null}
                  </View>
                  <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 4 }}>{m.dose} · {m.via} · {m.horarios.map((h) => h.replace(':', 'h')).join(', ')}</Text>
                  <View style={{ marginTop: 10 }}>
                    <Progresso valor={((m.tomes.length - pendentes) / m.tomes.length) * 100} />
                  </View>
                  <Text style={{ color: pendentes ? t.alerta : t.primaria, fontSize: 11.5, fontWeight: '700', marginTop: 6 }}>
                    {pendentes ? `${pendentes} toma(s) por administrar` : 'Dia completamente administrado'}
                  </Text>
                </Cartao>
              );
            })}
          </View>
        ) : null}

        {aba === 'plano' ? (
          <View style={{ gap: 12 }}>
            {plano ? (
              <Cartao>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: t.texto, fontFamily: serif, fontSize: 16, fontWeight: '700', flex: 1 }}>{plano.titulo}</Text>
                  <Etiqueta texto={plano.estado} tom={plano.estado === 'Ativo' ? 'verde' : 'alerta'} />
                </View>
                <View style={{ marginTop: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>Progresso</Text>
                    <Text style={{ color: t.primaria, fontSize: 11.5, fontWeight: '800' }}>{plano.progresso}%</Text>
                  </View>
                  <Progresso valor={plano.progresso} />
                </View>
                <Text style={{ color: t.textoMedia, fontSize: 11.5, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 14, marginBottom: 6 }}>Objetivos</Text>
                {plano.objetivos.map((o) => (
                  <View key={o} style={{ flexDirection: 'row', gap: 8, marginBottom: 5 }}>
                    <Ionicons name="ellipse" size={6} color={t.primaria} style={{ marginTop: 6 }} />
                    <Text style={{ color: t.textoMedia, fontSize: 12.5, flex: 1, lineHeight: 18 }}>{o}</Text>
                  </View>
                ))}
                <Text style={{ color: t.textoMedia, fontSize: 11.5, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 12, marginBottom: 6 }}>Intervenções</Text>
                {plano.intervencoes.map((o) => (
                  <View key={o} style={{ flexDirection: 'row', gap: 8, marginBottom: 5 }}>
                    <Ionicons name="ellipse" size={6} color={t.bege} style={{ marginTop: 6 }} />
                    <Text style={{ color: t.textoMedia, fontSize: 12.5, flex: 1, lineHeight: 18 }}>{o}</Text>
                  </View>
                ))}
                <Text style={{ color: t.textoFraca, fontSize: 11.5, marginTop: 12 }}>
                  Revisão prevista para {formatarData(plano.revisao, true)}
                </Text>
              </Cartao>
            ) : (
              <Cartao>
                <Text style={{ color: t.textoMedia, fontSize: 13 }}>Este utente ainda não tem plano de cuidados associado.</Text>
              </Cartao>
            )}
          </View>
        ) : null}
      </ScrollView>

      <ModalUtente visivel={modalEdicao} fechar={() => setModalEdicao(false)} utente={utente} />

      <ModalBase
        visivel={confirmarRemocao}
        fechar={() => setConfirmarRemocao(false)}
        titulo="Remover utente"
        subtitulo="Esta ação é definitiva e remove todos os registos clínicos associados."
      >
        <View style={{ backgroundColor: '#F6E2DC', borderRadius: 14, padding: 14, marginBottom: 16, flexDirection: 'row', gap: 10 }}>
          <Ionicons name="warning-outline" size={20} color="#8E3423" />
          <Text style={{ color: '#8E3423', fontSize: 12.5, flex: 1, lineHeight: 18 }}>
            Vai remover <Text style={{ fontWeight: '800' }}>{utente.nome}</Text> da plataforma, juntamente com {visitas.length} visita(s), {sinais.length} registo(s) de sinais vitais e {feridas.length} ferida(s) registada(s).
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Botao titulo="Manter utente" tipo="secundario" onPress={() => setConfirmarRemocao(false)} />
          <Botao
            titulo="Remover"
            icone="trash-outline"
            tipo="perigo"
            onPress={() => {
              app.removerUtente(utenteId);
              setConfirmarRemocao(false);
              voltar();
            }}
          />
        </View>
      </ModalBase>
    </View>
  );
}

const estilos = StyleSheet.create({
  topo: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  titulo: { fontFamily: serif, fontSize: 15, fontWeight: '700', marginBottom: 8 },
});
