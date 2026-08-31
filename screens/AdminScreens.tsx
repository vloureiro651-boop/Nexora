import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import {
  Avatar, Botao, Cabecalho, Cartao, Campo, Chave, Etiqueta, ModalBase, Segmentado, useTema, Vazio,
} from '../components/ui';
import { Logotipo } from '../components/Logo';
import { useApp, OPCOES_FOCO, PreFoco, TemaPreferencia } from '../lib/store';
import { PAPEIS, Papel, nomePapel } from '../lib/data';
import { SECCOES, SecId } from '../lib/seccoes';
import { formatarData } from '../lib/formatos';
import { serif } from '../lib/theme';

/* ----------------------------------------------------------- ADMINISTRAÇÃO */
export function AdministracaoScreen() {
  const t = useTema();
  const app = useApp();
  const [aba, setAba] = useState<'utilizadores' | 'permissoes' | 'convites'>('utilizadores');
  const [modalConvite, setModalConvite] = useState(false);
  const [utilizadorEditar, setUtilizadorEditar] = useState<string | null>(null);
  const [novoConvite, setNovoConvite] = useState<{ papel: Papel; nome: string; email: string }>({ papel: 'enfermeiro', nome: '', email: '' });
  const [codigoGerado, setCodigoGerado] = useState<string | null>(null);
  const [erroConvite, setErroConvite] = useState<string | null>(null);
  const [papelPermissoes, setPapelPermissoes] = useState<Papel>('enfermeiro');

  const criar = () => {
    if (!novoConvite.nome.trim() || !novoConvite.email.trim()) {
      setErroConvite('Indique o nome e o email do profissional a convidar.');
      return;
    }
    const codigo = app.criarConvite(novoConvite.papel, novoConvite.nome, novoConvite.email);
    setCodigoGerado(codigo);
    setErroConvite(null);
    setNovoConvite({ papel: 'enfermeiro', nome: '', email: '' });
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={aba === 'utilizadores' ? app.utilizadores.map((u) => u.id) : aba === 'convites' ? app.convites.map((c) => c.codigo) : SECCOES.map((s) => s.id)}
        keyExtractor={(x) => String(x)}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListHeaderComponent={
          <View>
            <Cabecalho
              titulo="Administração"
              subtitulo="Utilizadores, permissões por perfil e convites de acesso."
              acoes={aba === 'convites' ? <Botao titulo="Novo convite" icone="add" pequeno onPress={() => setModalConvite(true)} /> : undefined}
            />
            <Segmentado
              valor={aba}
              onChange={setAba}
              opcoes={[
                { id: 'utilizadores', rotulo: 'Utilizadores', icone: 'people-outline' },
                { id: 'permissoes', rotulo: 'Permissões', icone: 'lock-closed-outline' },
                { id: 'convites', rotulo: 'Convites', icone: 'mail-outline' },
              ]}
            />
          </View>
        }
        renderItem={({ item }) => {
          /* ---------------------------------------------------- UTILIZADORES */
          if (aba === 'utilizadores') {
            const u = app.utilizadores.filter((x) => x.id === item)[0];
            if (!u) return null;
            return (
              <Cartao style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Avatar nome={u.nome} tamanho={44} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: t.texto, fontSize: 14.5, fontWeight: '700' }}>{u.nome}</Text>
                    <Text style={{ color: t.textoMedia, fontSize: 12, marginTop: 2 }}>{u.email}</Text>
                  </View>
                  <Etiqueta texto={nomePapel(u.papel)} tom={u.papel === 'administrador' ? 'verde' : u.papel === 'gestor' ? 'info' : 'bege'} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.linha }}>
                  <Botao titulo="Gerir perfil" icone="person-outline" pequeno tipo="secundario" onPress={() => setUtilizadorEditar(u.id)} />
                  <View style={{ flex: 1 }} />
                  <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>{u.ativo ? 'Ativo' : 'Inativo'}</Text>
                  <Chave ativo={u.ativo} onToggle={() => app.alternarUtilizadorAtivo(u.id)} rotulo="" />
                </View>
              </Cartao>
            );
          }

          /* ------------------------------------------------------- CONVITES */
          if (aba === 'convites') {
            const c = app.convites.filter((x) => x.codigo === item)[0];
            if (!c) return null;
            return (
              <Cartao style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: t.primariaSuave }}>
                    <Text style={{ color: t.primaria, fontFamily: serif, fontSize: 13, fontWeight: '800', letterSpacing: 1 }}>{c.codigo}</Text>
                  </View>
                  <View style={{ flex: 1 }} />
                  <Etiqueta texto={c.usado ? 'Utilizado' : 'Ativo'} tom={c.usado ? 'neutro' : 'verde'} />
                </View>
                <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 10 }}>{c.nome} · {c.email}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}>
                  <Etiqueta texto={nomePapel(c.papel)} tom="bege" />
                  <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>Emitido em {formatarData(c.criadoEm, true)}</Text>
                </View>
              </Cartao>
            );
          }

          /* ----------------------------------------------------- PERMISSOES */
          const seccao = SECCOES.filter((s) => s.id === item)[0];
          if (!seccao) return null;
          const ativo = app.permissoes[papelPermissoes][seccao.id];
          const fixo = seccao.id === 'dashboard' || seccao.id === 'config';
          return (
            <Cartao style={{ marginBottom: 8, paddingVertical: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: `${seccao.cor}1A`, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={seccao.icone as any} size={16} color={seccao.cor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: t.texto, fontSize: 14, fontWeight: '700' }}>{seccao.titulo}</Text>
                  <Text style={{ color: t.textoFraca, fontSize: 11.5, marginTop: 1 }}>{seccao.grupo}</Text>
                </View>
                {fixo ? (
                  <Etiqueta texto="Sempre ativo" tom="neutro" />
                ) : (
                  <Chave ativo={ativo} onToggle={() => app.alternarPermissao(papelPermissoes, seccao.id)} rotulo="" />
                )}
              </View>
            </Cartao>
          );
        }}
        ListFooterComponent={
          aba === 'permissoes' ? (
            <View style={{ marginTop: 14 }}>
              <Text style={{ color: t.textoMedia, fontSize: 12, marginBottom: 8, lineHeight: 18 }}>
                O administrador gere o acesso de cada perfil às secções da aplicação. As alterações são aplicadas de imediato.
              </Text>
            </View>
          ) : null
        }
      />

      {/* ------------------------------------------------------- MODAL PERFIL */}
      <ModalBase visivel={!!utilizadorEditar} fechar={() => setUtilizadorEditar(null)} titulo="Gerir perfil" subtitulo="Ajuste as permissões alterando o tipo de utilizador.">
        {PAPEIS.map((p) => (
          <Cartao
            key={p.id}
            style={{ marginBottom: 10, borderColor: utilizadorEditar && app.utilizadores.filter((u) => u.id === utilizadorEditar)[0]?.papel === p.id ? t.primaria : 'transparent', borderWidth: 1.5 }}
            onPress={() => {
              if (utilizadorEditar) app.alterarPapel(utilizadorEditar, p.id);
              setUtilizadorEditar(null);
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: t.primariaSuave, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={p.icone as any} size={18} color={t.primaria} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.texto, fontSize: 14, fontWeight: '700' }}>{p.nome}</Text>
                <Text style={{ color: t.textoMedia, fontSize: 12, marginTop: 2, lineHeight: 17 }}>{p.descricao}</Text>
              </View>
            </View>
          </Cartao>
        ))}
      </ModalBase>

      {/* ------------------------------------------------------- MODAL CONVITE */}
      <ModalBase visivel={modalConvite} fechar={() => setModalConvite(false)} titulo="Convites de acesso" subtitulo="O registo de contas faz-se exclusivamente por convite do administrador.">
        <Text style={{ color: t.textoMedia, fontSize: 12.5, fontWeight: '700', marginBottom: 8 }}>Perfil a conceder</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {PAPEIS.map((p) => (
            <Etiqueta key={p.id} texto={p.nome} tom={novoConvite.papel === p.id ? 'verde' : 'neutro'} icone={p.icone} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {PAPEIS.map((p) => (
            <Botao
              key={p.id}
              titulo={p.nome}
              pequeno
              tipo={novoConvite.papel === p.id ? 'primario' : 'secundario'}
              onPress={() => setNovoConvite({ ...novoConvite, papel: p.id })}
            />
          ))}
        </View>
        <Campo rotulo="Nome do profissional" valor={novoConvite.nome} onChangeText={(v) => setNovoConvite({ ...novoConvite, nome: v })} icone="person-outline" placeholder="Ex.: Diogo Salgado" />
        <Campo rotulo="Email profissional" valor={novoConvite.email} onChangeText={(v) => setNovoConvite({ ...novoConvite, email: v })} icone="mail-outline" teclado="email-address" autoCapitalize="none" placeholder="nome@cuidadosderaiz.pt" />
        {erroConvite ? (
          <View style={{ backgroundColor: '#F6E2DC', borderRadius: 12, padding: 10, marginBottom: 12 }}>
            <Text style={{ color: '#8E3423', fontSize: 12.5 }}>{erroConvite}</Text>
          </View>
        ) : null}
        <Botao titulo="Emitir convite" icone="send-outline" full onPress={criar} />
        {codigoGerado ? (
          <Cartao style={{ marginTop: 14, backgroundColor: t.primariaSuave }}>
            <Text style={{ color: t.primaria, fontSize: 12, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' }}>Convite emitido</Text>
            <Text style={{ color: t.texto, fontFamily: serif, fontSize: 20, fontWeight: '700', marginTop: 6, letterSpacing: 1.5 }}>{codigoGerado}</Text>
            <Text style={{ color: t.textoMedia, fontSize: 12, marginTop: 6, lineHeight: 18 }}>
              Partilhe este código. A pessoa usa-o no ecrã «Registo por convite» para criar a conta com o perfil atribuído.
            </Text>
          </Cartao>
        ) : null}
        <View style={{ height: 12 }} />
        <Text style={{ color: t.textoFraca, fontSize: 11.5, lineHeight: 17 }}>
          Convites existentes: {app.convites.filter((c) => !c.usado).map((c) => c.codigo).join(' · ') || 'nenhum'}
        </Text>
      </ModalBase>
    </View>
  );
}

/* ----------------------------------------------------------- CONFIGURAÇÕES */
export function ConfiguracoesScreen() {
  const t = useTema();
  const app = useApp();
  const esquema = useColorScheme();
  const [confirmarRepor, setConfirmarRepor] = useState(false);

  const destaquesDisponiveis: SecId[] = ['utentes', 'agenda', 'visitas', 'sinais', 'medicacao', 'mensagens', 'feridas', 'relatorios'];
  const destaques = app.definicoes.destaqueMobile;

  const alternarDestaque = (id: SecId) => {
    const jaTem = destaques.includes(id);
    if (jaTem) {
      if (destaques.length <= 1) return;
      app.definirDefinicoes({ destaqueMobile: destaques.filter((d) => d !== id) });
    } else if (destaques.length < 3) {
      app.definirDefinicoes({ destaqueMobile: [...destaques, id] });
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <Cabecalho titulo="Configurações" subtitulo="Preferências da conta, da aplicação e dos destaque mobile." />

      {/* ------------------------------------------------------------- CONTA */}
      <Cartao style={{ marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Avatar nome={app.utilizador?.nome || 'Convidado'} tamanho={52} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: t.texto, fontFamily: serif, fontSize: 17, fontWeight: '700' }}>{app.utilizador?.nome}</Text>
            <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 2 }}>{app.utilizador?.email}</Text>
          </View>
          <Etiqueta texto={app.utilizador ? nomePapel(app.utilizador.papel) : ''} tom="verde" />
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <Botao titulo="Terminar sessão" icone="log-out-outline" pequeno tipo="secundario" onPress={app.sair} />
        </View>
      </Cartao>

      {/* --------------------------------------------------------------- TEMA */}
      <Text style={[estilos.titulo, { color: t.texto }]}>Aparência</Text>
      <Cartao style={{ marginBottom: 14 }}>
        <Segmentado
          valor={app.definicoes.tema}
          onChange={(v) => app.definirDefinicoes({ tema: v as TemaPreferencia })}
          opcoes={[
            { id: 'claro', rotulo: 'Claro', icone: 'sunny-outline' },
            { id: 'escuro', rotulo: 'Escuro', icone: 'moon-outline' },
            { id: 'sistema', rotulo: 'Sistema', icone: 'phone-portrait-outline' },
          ]}
        />
        <Text style={{ color: t.textoFraca, fontSize: 11.5 }}>
          Tema ativo: {app.definicoes.tema === 'sistema' ? `sistema (${esquema === 'dark' ? 'escuro' : 'claro'})` : app.definicoes.tema}.
        </Text>
      </Cartao>

      {/* ---------------------------------------------------------------- FOCO */}
      <Text style={[estilos.titulo, { color: t.texto }]}>Foco da plataforma</Text>
      {OPCOES_FOCO.map((o) => {
        const ativo = app.definicoes.foco === o.id;
        return (
          <Cartao
            key={o.id}
            style={{ marginBottom: 10, borderWidth: 1.6, borderColor: ativo ? t.primaria : 'transparent' }}
            onPress={() => app.definirDefinicoes({ foco: o.id as PreFoco })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name={ativo ? 'radio-button-on' : 'radio-button-off'} size={19} color={ativo ? t.primaria : t.textoFraca} />
              <Text style={{ color: t.texto, fontFamily: serif, fontSize: 16, fontWeight: '700', flex: 1 }}>{o.titulo}</Text>
              {o.id === 'equilibrada' ? <Etiqueta texto="Recomendado" tom="verde" /> : null}
            </View>
            <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 8, lineHeight: 18 }}>{o.descricao}</Text>
          </Cartao>
        );
      })}

      {/* ------------------------------------------------------------- DESTAQUES */}
      <Text style={[estilos.titulo, { color: t.texto }]}>Destaques na versão mobile</Text>
      <Cartao style={{ marginBottom: 14 }}>
        <Text style={{ color: t.textoMedia, fontSize: 12.5, lineHeight: 18, marginBottom: 12 }}>
          Escolha até 3 secções para a barra inferior do telemóvel. Por omissão ficam destacadas <Text style={{ fontWeight: '700' }}>Utentes</Text>, <Text style={{ fontWeight: '700' }}>Agenda</Text> e <Text style={{ fontWeight: '700' }}>Visitas</Text>.
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {destaquesDisponiveis.map((id) => {
            const s = SECCOES.filter((x) => x.id === id)[0];
            const ativo = destaques.includes(id);
            return (
              <Botao
                key={id}
                titulo={s.titulo}
                icone={ativo ? 'checkmark-circle' : s.icone}
                pequeno
                tipo={ativo ? 'primario' : 'secundario'}
                onPress={() => alternarDestaque(id)}
              />
            );
          })}
        </View>
      </Cartao>

      {/* -------------------------------------------------------- NOTIFICAÇÕES */}
      <Text style={[estilos.titulo, { color: t.texto }]}>Notificações</Text>
      <Cartao style={{ marginBottom: 14 }}>
        <Chave ativo={app.definicoes.notificacoesPush} onToggle={() => app.definirDefinicoes({ notificacoesPush: !app.definicoes.notificacoesPush })} rotulo="Notificações no dispositivo" subtitulo="Alertas de visitas, medicação e mensagens." />
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.linha }} />
        <Chave ativo={app.definicoes.resumoDiario} onToggle={() => app.definirDefinicoes({ resumoDiario: !app.definicoes.resumoDiario })} rotulo="Resumo diário" subtitulo="Receber às 8h o plano do dia." />
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.linha }} />
        <Chave ativo={app.definicoes.alertasClinicos} onToggle={() => app.definirDefinicoes({ alertasClinicos: !app.definicoes.alertasClinicos })} rotulo="Alertas clínicos prioritários" subtitulo="Valores fora de faixa e feridas a agravar." />
      </Cartao>

      {/* --------------------------------------------------------------- DADOS */}
      <Text style={[estilos.titulo, { color: t.texto }]}>Dados e sessão</Text>
      <Cartao style={{ marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name="cloud-done-outline" size={18} color={t.primaria} />
          <Text style={{ color: t.textoMedia, fontSize: 12.5, flex: 1, lineHeight: 18 }}>
            Os registos ficam guardados no dispositivo e sincronizam entre web e mobile com a mesma conta.
          </Text>
        </View>
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.linha, marginVertical: 10 }} />
        <Botao titulo="Repor dados de demonstração" icone="refresh-outline" pequeno tipo="fantasma" onPress={() => setConfirmarRepor(true)} />
      </Cartao>

      {/* ---------------------------------------------------------------- SOBRE */}
      <Cartao style={{ alignItems: 'center', paddingVertical: 26 }}>
        <Logotipo tamanho={62} tom="escuro" centralizado />
        <Text style={{ color: t.textoFraca, fontSize: 11.5, marginTop: 16 }}>Versão 1.0.0 · Plataforma de cuidados de enfermagem ao domicílio</Text>
        <Text style={{ color: t.textoFraca, fontSize: 11.5, marginTop: 4 }}>Cuidado no conforto do lar</Text>
      </Cartao>

      <ModalBase visivel={confirmarRepor} fechar={() => setConfirmarRepor(false)} titulo="Repor demonstração" subtitulo="Esta ação repõe todos os dados de exemplo.">
        <Text style={{ color: t.textoMedia, fontSize: 13, lineHeight: 20, marginBottom: 16 }}>
          Vai apagar as alterações feitas (visitas criadas, sinais registados, convites e permissões) e voltar ao estado inicial da aplicação.
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Botao titulo="Manter dados" tipo="secundario" onPress={() => setConfirmarRepor(false)} />
          <Botao titulo="Repor" icone="refresh" tipo="perigo" onPress={() => { app.reporDemo(); setConfirmarRepor(false); }} />
        </View>
      </ModalBase>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  titulo: { fontFamily: serif, fontSize: 16, fontWeight: '700', marginBottom: 10, marginTop: 6 },
});
