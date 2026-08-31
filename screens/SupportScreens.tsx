import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Avatar, BarraPesquisa, Botao, Cabecalho, Cartao, Chip, Etiqueta, GraficoBarras, ModalBase, useTema, Vazio,
} from '../components/ui';
import { useApp } from '../lib/store';
import { useNav } from '../lib/nav';
import { SecId } from '../lib/seccoes';
import { DOCUMENTOS, PROFISSIONAIS, RELATORIOS, Relatorio } from '../lib/data';
import { formatarData } from '../lib/formatos';
import { serif } from '../lib/theme';

const ICONE_TIPO: Record<string, string> = {
  Relatório: 'document-text-outline',
  Receita: 'medkit-outline',
  Consentimento: 'shield-checkmark-outline',
  Imagem: 'image-outline',
  Plano: 'clipboard-outline',
};

/* --------------------------------------------------------------- DOCUMENTOS */
export function DocumentosScreen() {
  const t = useTema();
  const app = useApp();
  const nav = useNav();
  const [pesquisa, setPesquisa] = useState('');
  const [tipo, setTipo] = useState('Todos');
  const [aberto, setAberto] = useState<string | null>(null);

  const tipos = ['Todos', ...Array.from(new Set(DOCUMENTOS.map((d) => d.tipo)))];
  const lista = DOCUMENTOS.filter((d) => (tipo === 'Todos' ? true : d.tipo === tipo))
    .filter((d) => {
      const q = pesquisa.trim().toLowerCase();
      return !q || d.titulo.toLowerCase().includes(q) || app.obterUtente(d.utenteId).nome.toLowerCase().includes(q);
    });
  const documento = DOCUMENTOS.filter((d) => d.id === aberto)[0] || null;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={lista}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListHeaderComponent={
          <View>
            <Cabecalho titulo="Documentos" subtitulo="Arquivo clínico digital de cada domicílio." />
            <BarraPesquisa valor={pesquisa} onChangeText={setPesquisa} placeholder="Pesquisar documento ou utente…" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {tipos.map((x) => (
                <Chip key={x} rotulo={x} ativo={tipo === x} onPress={() => setTipo(x)} />
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={<Vazio icone="document-text-outline" titulo="Sem documentos" texto="Nenhum documento corresponde a esta pesquisa." />}
        renderItem={({ item }) => (
          <Cartao style={{ marginBottom: 10 }} onPress={() => setAberto(item.id)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: t.primariaSuave, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={(ICONE_TIPO[item.tipo] || 'document-outline') as any} size={19} color={t.primaria} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.texto, fontSize: 14, fontWeight: '700' }} numberOfLines={2}>{item.titulo}</Text>
                <Text style={{ color: t.textoMedia, fontSize: 12, marginTop: 3 }}>
                  {app.obterUtente(item.utenteId).nome} · {item.autor}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Etiqueta texto={item.tipo} tom="bege" />
                <Text style={{ color: t.textoFraca, fontSize: 11, marginTop: 6 }}>{formatarData(item.data, true)}</Text>
              </View>
            </View>
          </Cartao>
        )}
      />
      <ModalBase visivel={!!documento} fechar={() => setAberto(null)} titulo={documento ? documento.titulo : ''} subtitulo={documento ? app.obterUtente(documento.utenteId).nome : ''}>
        {documento ? (
          <View>
            <View style={{ backgroundColor: t.begeSuave, borderRadius: 16, padding: 18, alignItems: 'center', marginBottom: 16 }}>
              <Ionicons name={(ICONE_TIPO[documento.tipo] || 'document-outline') as any} size={40} color={t.primaria} />
              <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 10, textAlign: 'center' }}>
                {documento.tipo} · {documento.tamanho}
              </Text>
            </View>
            {[
              ['Utente', app.obterUtente(documento.utenteId).nome],
              ['Autor', documento.autor],
              ['Data', formatarData(documento.data, true)],
              ['Dimensão', documento.tamanho],
            ].map(([r, v]) => (
              <View key={r} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.linha }}>
                <Text style={{ color: t.textoMedia, fontSize: 12.5 }}>{r}</Text>
                <Text style={{ color: t.texto, fontSize: 12.5, fontWeight: '600' }}>{v}</Text>
              </View>
            ))}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <Botao titulo="Abrir documento" icone="open-outline" onPress={() => undefined} />
              <Botao titulo="Partilhar" icone="share-outline" tipo="secundario" onPress={() => undefined} />
            </View>
          </View>
        ) : null}
      </ModalBase>
    </View>
  );
}

/* --------------------------------------------------------------- RELATÓRIOS */
export function RelatoriosScreen() {
  const t = useTema();
  const app = useApp();
  const [estados, setEstados] = useState<Record<string, Relatorio['estado']>>({});
  const [gerado, setGerado] = useState<string | null>(null);

  const dadosEquipa = PROFISSIONAIS.filter((p) => p.visitasHoje > 0).map((p) => ({
    rotulo: p.nome.split(' ')[0],
    valor: p.visitasHoje,
  }));

  const gerar = (r: Relatorio) => {
    setEstados((e) => ({ ...e, [r.id]: 'Em processamento' }));
    setTimeout(() => {
      setEstados((e) => ({ ...e, [r.id]: 'Disponível' }));
      setGerado(r.titulo);
    }, 1300);
  };

  return (
    <FlatList
      data={RELATORIOS}
      keyExtractor={(r) => r.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      ListHeaderComponent={
        <View>
          <Cabecalho titulo="Relatórios" subtitulo="Indicadores de atividade, qualidade e conformidade." />
          <Cartao style={{ marginBottom: 14 }}>
            <Text style={{ color: t.texto, fontFamily: serif, fontSize: 15.5, fontWeight: '700', marginBottom: 4 }}>Visitas por profissional hoje</Text>
            <Text style={{ color: t.textoFraca, fontSize: 11.5, marginBottom: 12 }}>Distribuição equilibrada — foco «Equilibrada».</Text>
            <GraficoBarras dados={dadosEquipa} cor={t.primaria} altura={110} />
          </Cartao>
          {gerado ? (
            <View style={{ backgroundColor: t.primariaSuave, borderRadius: 14, padding: 12, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="checkmark-circle" size={18} color={t.primaria} />
              <Text style={{ color: t.primaria, fontSize: 12.5, flex: 1, fontWeight: '600' }}>«{gerado}» gerado e disponível para descarregar.</Text>
            </View>
          ) : null}
        </View>
      }
      renderItem={({ item }) => {
        const estado = estados[item.id] || item.estado;
        const emCurso = estado === 'Em processamento';
        return (
          <Cartao style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: t.escuro ? t.superficieAlta : '#EFF3EF', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="stats-chart" size={18} color={t.info} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.texto, fontFamily: serif, fontSize: 15, fontWeight: '700' }}>{item.titulo}</Text>
                <Text style={{ color: t.textoMedia, fontSize: 12, marginTop: 3 }}>{item.periodo} · {item.tipo}</Text>
              </View>
              <Etiqueta texto={emCurso ? 'A gerar…' : estado} tom={emCurso ? 'alerta' : 'verde'} />
            </View>
            <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 10, lineHeight: 18 }}>{item.resumo}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.linha }}>
              <Text style={{ color: t.textoFraca, fontSize: 11.5, flex: 1 }}>Gerado em {formatarData(item.geradoEm, true)}</Text>
              <Botao titulo={emCurso ? 'A gerar' : 'Gerar PDF'} icone={emCurso ? 'hourglass-outline' : 'download-outline'} pequeno tipo={emCurso ? 'fantasma' : 'primario'} desativado={emCurso} onPress={() => gerar(item)} />
            </View>
          </Cartao>
        );
      }}
    />
  );
}

/* ---------------------------------------------------------------- MENSAGENS */
export function MensagensScreen() {
  const t = useTema();
  const app = useApp();
  const nav = useNav();
  const [filtro, setFiltro] = useState<'todas' | 'naoLidas'>('todas');

  const lista = app.conversas.filter((c) => (filtro === 'naoLidas' ? c.naoLidas > 0 : true));

  return (
    <FlatList
      data={lista}
      keyExtractor={(c) => c.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      ListHeaderComponent={
        <View>
          <Cabecalho titulo="Mensagens" subtitulo="Comunicação segura com a equipa e com as famílias." />
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
            <Chip rotulo="Todas" ativo={filtro === 'todas'} onPress={() => setFiltro('todas')} />
            <Chip rotulo="Por ler" icone="mail-unread-outline" ativo={filtro === 'naoLidas'} onPress={() => setFiltro('naoLidas')} />
          </View>
        </View>
      }
      ListEmptyComponent={<Vazio icone="chatbubbles-outline" titulo="Sem mensagens" texto="Não existem conversas por ler. A equipa está ao dia." />}
      renderItem={({ item }) => {
        const ultima = item.mensagens[item.mensagens.length - 1];
        return (
          <Cartao style={{ marginBottom: 10 }} onPress={() => nav.irParaConversa(item.id)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Avatar nome={item.nome} tamanho={44} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: t.texto, fontSize: 14.5, fontWeight: '700', flex: 1 }}>{item.nome}</Text>
                  <Text style={{ color: t.textoFraca, fontSize: 11 }}>{ultima.hora}</Text>
                </View>
                <Text style={{ color: t.textoFraca, fontSize: 11.5, marginTop: 1 }}>{item.papel}</Text>
                <Text style={{ color: item.naoLidas ? t.texto : t.textoMedia, fontSize: 12.5, marginTop: 4 }} numberOfLines={2}>
                  {ultima.de === 'eu' ? 'Você: ' : ''}{ultima.texto}
                </Text>
              </View>
              {item.naoLidas ? (
                <View style={{ minWidth: 22, height: 22, borderRadius: 11, backgroundColor: t.primaria, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>{item.naoLidas}</Text>
                </View>
              ) : null}
            </View>
          </Cartao>
        );
      }}
    />
  );
}

/* ----------------------------------------------------------- NOTIFICAÇÕES */
const ICONE_NOTIF: Record<string, { icone: string; cor: string }> = {
  visita: { icone: 'calendar', cor: '#2E7D5B' },
  cuidado: { icone: 'bandage', cor: '#C9822B' },
  sinal: { icone: 'heart', cor: '#B3452F' },
  mensagem: { icone: 'chatbubble', cor: '#3E6D8E' },
  sistema: { icone: 'information-circle', cor: '#5C6B63' },
};

export function NotificacoesScreen() {
  const t = useTema();
  const app = useApp();
  const nav = useNav();
  const [filtro, setFiltro] = useState<'todas' | 'porLer'>('todas');

  const lista = app.notificacoes.filter((n) => (filtro === 'porLer' ? !n.lida : true));
  const porLer = app.notificacoes.filter((n) => !n.lida).length;

  return (
    <FlatList
      data={lista}
      keyExtractor={(n) => n.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      ListHeaderComponent={
        <View>
          <Cabecalho
            titulo="Notificações"
            subtitulo={`${porLer} notificações por ler.`}
            acoes={porLer ? <Botao titulo="Marcar todas" icone="checkmark-done" pequeno tipo="secundario" onPress={app.marcarTodasLidas} /> : undefined}
          />
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
            <Chip rotulo="Todas" ativo={filtro === 'todas'} onPress={() => setFiltro('todas')} />
            <Chip rotulo="Por ler" ativo={filtro === 'porLer'} onPress={() => setFiltro('porLer')} />
          </View>
        </View>
      }
      ListEmptyComponent={<Vazio icone="notifications-off-outline" titulo="Tudo tratado" texto="Não existem notificações por ler." />}
      renderItem={({ item }) => {
        const meta = ICONE_NOTIF[item.tipo] || ICONE_NOTIF.sistema;
        return (
          <Cartao
            style={{ marginBottom: 10, opacity: item.lida ? 0.75 : 1 }}
            onPress={() => {
              app.marcarLida(item.id);
              const destino = item.seccao as SecId;
              if (destino) nav.irParaSecao(destino);
            }}
          >
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ width: 38, height: 38, borderRadius: 13, backgroundColor: `${meta.cor}1A`, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={meta.icone as any} size={18} color={meta.cor} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: t.texto, fontSize: 14, fontWeight: '700', flex: 1 }}>{item.titulo}</Text>
                  {!item.lida ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.primaria }} /> : null}
                </View>
                <Text style={{ color: t.textoMedia, fontSize: 12.5, marginTop: 3, lineHeight: 18 }}>{item.texto}</Text>
                <Text style={{ color: t.textoFraca, fontSize: 11, marginTop: 6 }}>{item.hora}</Text>
              </View>
            </View>
          </Cartao>
        );
      }}
    />
  );
}

export const estilos = StyleSheet.create({ paddingConteudo: { padding: 16 } });
