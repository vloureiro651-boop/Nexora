import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Botao, Campo, Chip, ModalBase, useTema } from './ui';
import { useApp } from '../lib/store';
import { Risco, Utente } from '../lib/data';
import { idadeDe } from '../lib/formatos';

export type DadosUtente = Omit<Utente, 'id'>;

const ANO_ATUAL = new Date().getFullYear();

const VAZIO: DadosUtente = {
  nome: '',
  nascimento: ANO_ATUAL - 75,
  sexo: 'F',
  morada: '',
  concelho: '',
  telefone: '',
  emergencia: '',
  parentesco: '',
  diagnostico: '',
  alergias: 'Sem conhecimento',
  risco: 'Médio',
  cuidador: 'Familiar',
  observacoes: '',
  profissionalId: 'p2',
};

/**
 * Modal de criação e edição de utentes.
 * O campo de criação é totalmente editável — permite acrescentar doentes reais à plataforma.
 */
export function ModalUtente({
  visivel, fechar, utente, onGuardado,
}: {
  visivel: boolean;
  fechar: () => void;
  utente?: Utente | null;
  onGuardado?: (id: string) => void;
}) {
  const t = useTema();
  const app = useApp();
  const [form, setForm] = useState<DadosUtente>(VAZIO);
  const [ano, setAno] = useState(`${ANO_ATUAL - 75}`);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!visivel) return;
    if (utente) {
      setForm({
        nome: utente.nome,
        nascimento: utente.nascimento,
        sexo: utente.sexo,
        morada: utente.morada,
        concelho: utente.concelho,
        telefone: utente.telefone,
        emergencia: utente.emergencia,
        parentesco: utente.parentesco,
        diagnostico: utente.diagnostico,
        alergias: utente.alergias,
        risco: utente.risco,
        cuidador: utente.cuidador,
        observacoes: utente.observacoes,
        profissionalId: utente.profissionalId,
      });
      setAno(`${utente.nascimento}`);
    } else {
      setForm(VAZIO);
      setAno(`${ANO_ATUAL - 75}`);
    }
    setErro(null);
  }, [visivel, utente]);

  const definir = (patch: Partial<DadosUtente>) => setForm((f) => ({ ...f, ...patch }));

  const guardar = () => {
    const anoNum = Number(ano);
    if (!form.nome.trim()) {
      setErro('Indique o nome completo do utente.');
      return;
    }
    if (!anoNum || anoNum < 1900 || anoNum > ANO_ATUAL) {
      setErro(`Indique um ano de nascimento válido entre 1900 e ${ANO_ATUAL}.`);
      return;
    }
    const dados: DadosUtente = {
      ...form,
      nome: form.nome.trim(),
      nascimento: anoNum,
      morada: form.morada.trim() || 'Sem morada registada',
      concelho: form.concelho.trim() || 'Por confirmar',
      telefone: form.telefone.trim() || 'Por confirmar',
      emergencia: form.emergencia.trim() || 'Por confirmar',
      parentesco: form.parentesco.trim() || 'Familiar',
      diagnostico: form.diagnostico.trim() || 'Em observação — diagnóstico por concretizar',
      alergias: form.alergias.trim() || 'Sem conhecimento',
      cuidador: form.cuidador.trim() || 'Sem cuidador atribuído',
      observacoes: form.observacoes.trim(),
      profissionalId: utente ? utente.profissionalId : app.utilizador?.profissionalId || 'p2',
    };

    if (utente) {
      app.atualizarUtente(utente.id, dados);
      onGuardado?.(utente.id);
    } else {
      const id = app.adicionarUtente(dados);
      onGuardado?.(id);
    }
    fechar();
  };

  return (
    <ModalBase
      visivel={visivel}
      fechar={fechar}
      titulo={utente ? 'Editar ficha do utente' : 'Novo utente'}
      subtitulo={utente ? 'Atualize os dados clínicos e de contacto.' : 'Acrescente um doente à plataforma de cuidados.'}
    >
      <Campo rotulo="Nome completo *" valor={form.nome} onChangeText={(v) => definir({ nome: v })} icone="person-outline" placeholder="Ex.: Amália Fernandes" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Campo rotulo="Ano de nascimento" valor={ano} onChangeText={setAno} icone="calendar-outline" teclado="number-pad" placeholder="1943" />
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
          <Text style={{ color: t.textoMedia, fontSize: 12.5, fontWeight: '700', marginBottom: 6 }}>Sexo</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip rotulo="Feminino" ativo={form.sexo === 'F'} onPress={() => definir({ sexo: 'F' })} />
            <Chip rotulo="Masculino" ativo={form.sexo === 'M'} onPress={() => definir({ sexo: 'M' })} />
          </View>
        </View>
      </View>
      <Text style={{ color: t.textoFraca, fontSize: 11.5, marginTop: -6, marginBottom: 12 }}>
        {Number(ano) && Number(ano) >= 1900 && Number(ano) <= ANO_ATUAL ? `${idadeDe(Number(ano))} anos` : 'Idade calculada automaticamente'}
      </Text>

      <Campo rotulo="Morada" valor={form.morada} onChangeText={(v) => definir({ morada: v })} icone="home-outline" placeholder="Rua, número, andar" />
      <Campo rotulo="Concelho" valor={form.concelho} onChangeText={(v) => definir({ concelho: v })} icone="location-outline" placeholder="Ex.: Lisboa" />
      <Campo rotulo="Telefone" valor={form.telefone} onChangeText={(v) => definir({ telefone: v })} icone="call-outline" teclado="phone-pad" placeholder="912 000 000" />

      <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.linha, marginVertical: 6 }} />

      <Campo rotulo="Diagnóstico principal" valor={form.diagnostico} onChangeText={(v) => definir({ diagnostico: v })} icone="medkit-outline" multiline placeholder="Ex.: Diabetes mellitus tipo 2 — ferida pé diabético" />
      <Campo rotulo="Alergias conhecidas" valor={form.alergias} onChangeText={(v) => definir({ alergias: v })} icone="warning-outline" placeholder="Sem conhecimento" />

      <Text style={{ color: t.textoMedia, fontSize: 12.5, fontWeight: '700', marginBottom: 8 }}>Nível de risco</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        {(['Alto', 'Médio', 'Baixo'] as Risco[]).map((r) => (
          <Chip key={r} rotulo={`Risco ${r.toLowerCase()}`} ativo={form.risco === r} onPress={() => definir({ risco: r })} />
        ))}
      </View>

      <Campo rotulo="Cuidador principal" valor={form.cuidador} onChangeText={(v) => definir({ cuidador: v })} icone="people-outline" placeholder="Ex.: Filho (reside)" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Campo rotulo="Contacto de emergência" valor={form.emergencia} onChangeText={(v) => definir({ emergencia: v })} icone="alert-circle-outline" placeholder="Nome do familiar" />
        </View>
        <View style={{ flex: 1 }}>
          <Campo rotulo="Parentesco" valor={form.parentesco} onChangeText={(v) => definir({ parentesco: v })} icone="git-network-outline" placeholder="Filho" />
        </View>
      </View>
      <Campo rotulo="Observações de enfermagem" valor={form.observacoes} onChangeText={(v) => definir({ observacoes: v })} icone="document-text-outline" multiline placeholder="Condutas relevantes, preferências e particularidades do domicílio…" />

      {erro ? (
        <View style={{ backgroundColor: '#F6E2DC', borderRadius: 12, padding: 11, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="alert-circle" size={16} color="#8E3423" />
          <Text style={{ color: '#8E3423', fontSize: 12.5, flex: 1 }}>{erro}</Text>
        </View>
      ) : null}

      <Botao titulo={utente ? 'Guardar alterações' : 'Criar utente'} icone="checkmark" full onPress={guardar} />
      <View style={{ height: 10 }} />
      <Botao titulo="Cancelar" tipo="fantasma" full onPress={fechar} />
    </ModalBase>
  );
}

export default ModalUtente;
