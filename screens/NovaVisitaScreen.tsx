import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Botao, BotaoIcone, Campo, Cartao, Chip, Etiqueta, useTema,
} from '../components/ui';
import { useApp } from '../lib/store';
import { TIPOS_VISITA } from '../lib/data';
import { formatarDataLonga, isoDe, semanaAtual } from '../lib/formatos';
import { serif } from '../lib/theme';

const DURACOES = [20, 30, 45, 60, 90];

export function NovaVisitaScreen({ utenteInicial, voltar }: { utenteInicial?: string; voltar: () => void }) {
  const t = useTema();
  const app = useApp();
  const insets = useSafeAreaInsets();

  const dias = [...semanaAtual().filter((d) => d.offset >= 0).slice(0, 6)];
  if (dias.length < 5) {
    for (let i = dias.length; i < 6; i += 1) dias.push({ iso: isoDe(i), dia: '', numero: 0, offset: i });
  }

  const [utenteId, setUtenteId] = useState(utenteInicial || app.utentes[0]?.id || '');
  const [tipo, setTipo] = useState(TIPOS_VISITA[0]);
  const [data, setData] = useState(isoDe(0));
  const [hora, setHora] = useState('09:00');
  const [duracao, setDuracao] = useState(45);
  const [notas, setNotas] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [feito, setFeito] = useState(false);

  const agendar = () => {
    if (!/^\d{2}:\d{2}$/.test(hora)) {
      setErro('Indique uma hora válida, por exemplo 09:30.');
      return;
    }
    app.adicionarVisita({
      utenteId,
      profissionalId: app.utilizador?.profissionalId || 'p2',
      tipo,
      data,
      inicio: hora,
      duracao,
      estado: 'planeada',
      tarefas: [
        { texto: 'Avaliação inicial ao utente', feito: false },
        { texto: tipo, feito: false },
        { texto: 'Registo clínico e orientações à família', feito: false },
      ],
      notas,
    });
    setErro(null);
    setFeito(true);
    setTimeout(voltar, 900);
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.fundo }}>
      <View style={[estilos.topo, { paddingTop: insets.top + 12, borderBottomColor: t.linha, backgroundColor: t.superficie }]}>
        <BotaoIcone icone="close" onPress={voltar} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ color: t.texto, fontFamily: serif, fontSize: 17, fontWeight: '700' }}>Nova visita</Text>
          <Text style={{ color: t.textoMedia, fontSize: 12, marginTop: 1 }}>Planeamento ao domicílio</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Cartao style={{ marginBottom: 14 }}>
          <Text style={[estilos.rotulo, { color: t.textoMedia }]}>Utente</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {app.utentes.map((u) => (
              <Chip key={u.id} rotulo={u.nome.split(' ')[0]} ativo={utenteId === u.id} onPress={() => setUtenteId(u.id)} />
            ))}
          </View>

          <Text style={[estilos.rotulo, { color: t.textoMedia }]}>Tipo de cuidado</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {TIPOS_VISITA.map((x) => (
              <Chip key={x} rotulo={x} ativo={tipo === x} onPress={() => setTipo(x)} />
            ))}
          </View>

          <Text style={[estilos.rotulo, { color: t.textoMedia }]}>Data</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {dias.map((d) => (
              <Chip
                key={d.iso}
                rotulo={d.dia ? `${d.dia} ${d.numero}` : formatarDataLonga(d.iso).split(',')[1]?.trim() || d.iso}
                ativo={data === d.iso}
                onPress={() => setData(d.iso)}
              />
            ))}
          </View>
          <Text style={{ color: t.textoFraca, fontSize: 11.5, marginBottom: 14 }}>{formatarDataLonga(data)}</Text>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Campo rotulo="Hora de início" valor={hora} onChangeText={setHora} icone="time-outline" placeholder="09:30" teclado="default" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[estilos.rotulo, { color: t.textoMedia }]}>Duração</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {DURACOES.map((d) => (
                  <Chip key={d} rotulo={`${d}′`} ativo={duracao === d} onPress={() => setDuracao(d)} />
                ))}
              </View>
            </View>
          </View>

          <Campo rotulo="Notas de planeamento (opcional)" valor={notas} onChangeText={setNotas} multiline placeholder="Ex.: reforçar analgesia pré-transferência, levar cobertura de colágeno…" />
        </Cartao>

        {erro ? (
          <View style={{ backgroundColor: '#F6E2DC', borderRadius: 12, padding: 12, marginBottom: 12 }}>
            <Text style={{ color: '#8E3423', fontSize: 12.5 }}>{erro}</Text>
          </View>
        ) : null}

        {feito ? (
          <View style={{ backgroundColor: t.primariaSuave, borderRadius: 14, padding: 14, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Etiqueta texto="Agendada" tom="verde" icone="checkmark-circle" />
            <Text style={{ color: t.primaria, fontSize: 12.5, flex: 1, fontWeight: '600' }}>Visita criada e já visível na agenda.</Text>
          </View>
        ) : null}

        <Botao titulo="Agendar visita" icone="checkmark" full onPress={agendar} carregando={feito} />
        <View style={{ height: 10 }} />
        <Botao titulo="Cancelar" tipo="fantasma" full onPress={voltar} />
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  topo: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rotulo: { fontSize: 12.5, fontWeight: '700', marginBottom: 8, letterSpacing: 0.3 },
});
