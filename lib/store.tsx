import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CONVERSAS, CONVITES, FERIDAS, MEDICACAO, NOTIFICACOES, SINAIS, UTENTES, UTILIZADORES, VISITAS,
  Conversa, Convite, Ferida, Medicamento, Notificacao, Papel, Sinal, Utente, Utilizador, Visita,
} from './data';
import { MatrizPermissoes, PERMISSOES_INICIAIS, SecId } from './seccoes';
import { isoDe } from './formatos';

const CHAVE = 'cuidadosderais:v1';

export type PreFoco = 'equilibrada' | 'clinica';
export type TemaPreferencia = 'claro' | 'escuro' | 'sistema';

export type Definicoes = {
  tema: TemaPreferencia;
  foco: PreFoco; // as duas opções: foco clínico equilibrado (por omissão) e foco operacional
  notificacoesPush: boolean;
  resumoDiario: boolean;
  alertasClinicos: boolean;
  destaqueMobile: string[];
};

const DEFINICOES_INICIAIS: Definicoes = {
  tema: 'claro',
  foco: 'equilibrada',
  notificacoesPush: true,
  resumoDiario: true,
  alertasClinicos: true,
  destaqueMobile: ['utentes', 'agenda', 'visitas'],
};

export type DefinicoesFoco = { id: PreFoco; titulo: string; descricao: string };

export const OPCOES_FOCO: DefinicoesFoco[] = [
  {
    id: 'equilibrada',
    titulo: 'Equilibrada',
    descricao: 'Equilíbrio entre tempo clínico e registo. Cada profissional tem, em média, 4 visitas diárias e 30% do dia reservado para documentação.',
  },
  {
    id: 'clinica',
    titulo: 'Clínica reforçada',
    descricao: 'Mais tempo ao lado do utente: menos campos obrigatórios de registo e protocolos clínicos destacados na agenda.',
  },
];

type Estado = {
  utentes: Utente[];
  utilizadores: Utilizador[];
  convites: Convite[];
  permissoes: MatrizPermissoes;
  definicoes: Definicoes;
  visitas: Visita[];
  sinais: Sinal[];
  feridas: Ferida[];
  medicacao: Medicamento[];
  conversas: Conversa[];
  notificacoes: Notificacao[];
  utilizadorSessao: string | null;
  lembrarSessao: boolean;
};

const estadoInicial = (): Estado => ({
  utentes: UTENTES,
  utilizadores: UTILIZADORES,
  convites: CONVITES,
  permissoes: PERMISSOES_INICIAIS,
  definicoes: DEFINICOES_INICIAIS,
  visitas: VISITAS,
  sinais: SINAIS,
  feridas: FERIDAS,
  medicacao: MEDICACAO,
  conversas: CONVERSAS,
  notificacoes: NOTIFICACOES,
  utilizadorSessao: null,
  lembrarSessao: true,
});

type Ctx = Estado & {
  pronto: boolean;
  utilizador: Utilizador | null;
  podeVer: (seccao: SecId) => boolean;
  obterUtente: (id: string) => Utente;
  adicionarUtente: (dados: Omit<Utente, 'id'>) => string;
  atualizarUtente: (id: string, dados: Partial<Utente>) => void;
  removerUtente: (id: string) => void;
  entrar: (email: string, senha: string, lembrar: boolean) => string | null;
  sair: () => void;
  registarPorConvite: (codigo: string, nome: string, email: string, senha: string) => string | null;
  criarConvite: (papel: Papel, nome: string, email: string) => string;
  alternarPermissao: (papel: Papel, seccao: SecId) => void;
  alterarPapel: (utilizadorId: string, papel: Papel) => void;
  alternarUtilizadorAtivo: (utilizadorId: string) => void;
  definirDefinicoes: (patch: Partial<Definicoes>) => void;
  adicionarVisita: (v: Omit<Visita, 'id'>) => void;
  alterarEstadoVisita: (id: string, estado: Visita['estado']) => void;
  alternarTarefa: (visitaId: string, indice: number) => void;
  adicionarSinal: (s: Omit<Sinal, 'id'>) => void;
  alternarTome: (medicamentoId: string, indice: number) => void;
  enviarMensagem: (conversaId: string, texto: string) => void;
  marcarLida: (id: string) => void;
  marcarTodasLidas: () => void;
  reporDemo: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<Estado>(estadoInicial);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const bruto = await AsyncStorage.getItem(CHAVE);
        if (bruto && vivo) {
          const guardado = JSON.parse(bruto) as Partial<Estado>;
          setEstado((e) => ({
            ...e,
            ...guardado,
            permissoes: { ...e.permissoes, ...(guardado.permissoes || {}) },
            definicoes: { ...e.definicoes, ...(guardado.definicoes || {}) },
            utilizadorSessao: guardado.lembrarSessao === false ? null : guardado.utilizadorSessao ?? null,
          }));
        }
      } catch (erro) {
        // em caso de erro mantém os dados de demonstração
      } finally {
        if (vivo) setPronto(true);
      }
    })();
    return () => {
      vivo = false;
    };
  }, []);

  useEffect(() => {
    if (!pronto) return;
    AsyncStorage.setItem(CHAVE, JSON.stringify(estado)).catch(() => undefined);
  }, [estado, pronto]);

  const utilizador = useMemo(
    () => estado.utilizadores.filter((u) => u.id === estado.utilizadorSessao)[0] || null,
    [estado.utilizadores, estado.utilizadorSessao],
  );

  const podeVer = useCallback(
    (seccao: SecId) => {
      if (seccao === 'dashboard' || seccao === 'config') return true;
      if (!utilizador) return false;
      return !!(estado.permissoes[utilizador.papel] && estado.permissoes[utilizador.papel][seccao]);
    },
    [estado.permissoes, utilizador],
  );

  const entrar = useCallback<Ctx['entrar']>((email, senha, lembrar) => {
    const normalizado = email.trim().toLowerCase();
    const encontrado = estado.utilizadores.filter((u) => u.email.toLowerCase() === normalizado)[0];
    if (!encontrado) return 'Não encontrámos nenhuma conta com este email.';
    if (encontrado.senha !== senha) return 'Palavra-passe incorreta. Tente novamente ou recupere o acesso.';
    if (!encontrado.ativo) return 'Esta conta está inativa. Contacte o administrador.';
    setEstado((e) => ({ ...e, utilizadorSessao: encontrado.id, lembrarSessao: lembrar }));
    return null;
  }, [estado.utilizadores]);

  const sair = useCallback(() => {
    setEstado((e) => ({ ...e, utilizadorSessao: null }));
  }, []);

  const registarPorConvite = useCallback<Ctx['registarPorConvite']>((codigo, nome, email, senha) => {
    const limpo = codigo.trim().toUpperCase();
    const convite = estado.convites.filter((c) => c.codigo.toUpperCase() === limpo)[0];
    if (!convite) return 'Código de convite inválido. Peça um novo convite ao administrador.';
    if (convite.usado) return 'Este convite já foi utilizado. Solicite um novo.';
    if (!nome.trim() || !email.trim()) return 'Preencha o nome e o email.';
    if (senha.length < 6) return 'A palavra-passe deve ter pelo menos 6 caracteres.';
    const emailNormalizado = email.trim().toLowerCase();
    if (estado.utilizadores.some((u) => u.email.toLowerCase() === emailNormalizado)) {
      return 'Já existe uma conta com este email.';
    }
    const novo: Utilizador = {
      id: `a${Date.now()}`,
      nome: nome.trim(),
      email: emailNormalizado,
      senha,
      papel: convite.papel,
      ativo: true,
      profissionalId: `p${Date.now()}`,
    };
    setEstado((e) => ({
      ...e,
      utilizadores: [...e.utilizadores, novo],
      convites: e.convites.map((c) => (c.codigo === convite.codigo ? { ...c, usado: true } : c)),
      utilizadorSessao: novo.id,
      lembrarSessao: true,
    }));
    return null;
  }, [estado.convites, estado.utilizadores]);

  const criarConvite = useCallback<Ctx['criarConvite']>((papel, nome, email) => {
    const sufixo = papel === 'administrador' ? 'ADM' : papel === 'enfermeiro' ? 'ENF' : papel === 'gestor' ? 'GES' : 'PRO';
    const codigo = `RAIZ-${sufixo}-${`${Date.now()}`.slice(-4)}`;
    const novo: Convite = { codigo, papel, nome: nome.trim() || 'Novo profissional', email: email.trim(), criadoEm: isoDe(0), usado: false };
    setEstado((e) => ({ ...e, convites: [novo, ...e.convites] }));
    return codigo;
  }, []);

  const alternarPermissao = useCallback<Ctx['alternarPermissao']>((papel, seccao) => {
    setEstado((e) => ({
      ...e,
      permissoes: {
        ...e.permissoes,
        [papel]: { ...e.permissoes[papel], [seccao]: !e.permissoes[papel][seccao] },
      },
    }));
  }, []);

  const alterarPapel = useCallback<Ctx['alterarPapel']>((utilizadorId, papel) => {
    setEstado((e) => ({
      ...e,
      utilizadores: e.utilizadores.map((u) => (u.id === utilizadorId ? { ...u, papel } : u)),
    }));
  }, []);

  const alternarUtilizadorAtivo = useCallback<Ctx['alternarUtilizadorAtivo']>((utilizadorId) => {
    setEstado((e) => ({
      ...e,
      utilizadores: e.utilizadores.map((u) => (u.id === utilizadorId ? { ...u, ativo: !u.ativo } : u)),
    }));
  }, []);

  const definirDefinicoes = useCallback<Ctx['definirDefinicoes']>((patch) => {
    setEstado((e) => ({ ...e, definicoes: { ...e.definicoes, ...patch } }));
  }, []);

  const adicionarVisita = useCallback<Ctx['adicionarVisita']>((v) => {
    setEstado((e) => ({
      ...e,
      visitas: [...e.visitas, { ...v, id: `v${Date.now()}` }],
      notificacoes: [
        {
          id: `n${Date.now()}`,
          tipo: 'visita',
          titulo: 'Nova visita agendada',
          texto: `${v.tipo} — ${v.inicio}h.`,
          hora: 'agora',
          lida: false,
          seccao: 'agenda',
        },
        ...e.notificacoes,
      ],
    }));
  }, []);

  const alterarEstadoVisita = useCallback<Ctx['alterarEstadoVisita']>((id, estadoVisita) => {
    setEstado((e) => ({
      ...e,
      visitas: e.visitas.map((v) => (v.id === id
        ? { ...v, estado: estadoVisita, tarefas: estadoVisita === 'concluida' ? v.tarefas.map((t) => ({ ...t, feito: true })) : v.tarefas }
        : v)),
      notificacoes: estadoVisita === 'concluida'
        ? [
          {
            id: `n${Date.now()}`,
            tipo: 'visita',
            titulo: 'Visita concluída',
            texto: 'Registo clínico disponível na secção de Visitas.',
            hora: 'agora',
            lida: false,
            seccao: 'visitas',
          },
          ...e.notificacoes,
        ]
        : e.notificacoes,
    }));
  }, []);

  const alternarTarefa = useCallback<Ctx['alternarTarefa']>((visitaId, indice) => {
    setEstado((e) => ({
      ...e,
      visitas: e.visitas.map((v) => (v.id === visitaId
        ? { ...v, tarefas: v.tarefas.map((t, i) => (i === indice ? { ...t, feito: !t.feito } : t)) }
        : v)),
    }));
  }, []);

  const adicionarSinal = useCallback<Ctx['adicionarSinal']>((s) => {
    setEstado((e) => ({
      ...e,
      sinais: [{ ...s, id: `s${Date.now()}` }, ...e.sinais],
      notificacoes: [
        {
          id: `n${Date.now() + 1}`,
          tipo: 'sinal',
          titulo: 'Sinais vitais registados',
          texto: `${UTENTES.filter((u) => u.id === s.utenteId)[0]?.nome || 'Utente'} — PA ${s.paSis}/${s.paDia}, pulso ${s.pulso} bpm.`,
          hora: 'agora',
          lida: false,
          seccao: 'sinais',
        },
        ...e.notificacoes,
      ],
    }));
  }, []);

  const alternarTome = useCallback<Ctx['alternarTome']>((medicamentoId, indice) => {
    setEstado((e) => ({
      ...e,
      medicacao: e.medicacao.map((m) => (m.id === medicamentoId
        ? { ...m, tomes: m.tomes.map((t, i) => (i === indice ? !t : t)) }
        : m)),
    }));
  }, []);

  const enviarMensagem = useCallback<Ctx['enviarMensagem']>((conversaId, texto) => {
    const hora = new Date().toTimeString().slice(0, 5);
    setEstado((e) => ({
      ...e,
      conversas: e.conversas.map((c) => (c.id === conversaId
        ? { ...c, mensagens: [...c.mensagens, { id: `ms${Date.now()}`, de: 'eu' as const, texto, hora }] }
        : c)),
    }));
  }, []);

  const marcarLida = useCallback<Ctx['marcarLida']>((id) => {
    setEstado((e) => ({ ...e, notificacoes: e.notificacoes.map((n) => (n.id === id ? { ...n, lida: true } : n)) }));
  }, []);

  const marcarTodasLidas = useCallback(() => {
    setEstado((e) => ({ ...e, notificacoes: e.notificacoes.map((n) => ({ ...n, lida: true })) }));
  }, []);

  const reporDemo = useCallback(() => {
    AsyncStorage.removeItem(CHAVE).catch(() => undefined);
    setEstado(estadoInicial());
  }, []);

  /* ------------------------------------------------------- GESTÃO DE UTENTES */
  const obterUtente = useCallback((id: string) => {
    const encontrado = estado.utentes.filter((u) => u.id === id)[0];
    return encontrado || estado.utentes[0] || { ...UTENTES[0], id: 'sem-registo', nome: 'Utente removido' };
  }, [estado.utentes]);

  const adicionarUtente = useCallback<Ctx['adicionarUtente']>((dados) => {
    const id = `u${Date.now()}`;
    setEstado((e) => ({
      ...e,
      utentes: [{ ...dados, id }, ...e.utentes],
      notificacoes: [
        {
          id: `n${Date.now()}`,
          tipo: 'sistema',
          titulo: 'Novo utente registado',
          texto: `${dados.nome} passou a integrar a lista de cuidados no domicílio.`,
          hora: 'agora',
          lida: false,
          seccao: 'utentes',
        },
        ...e.notificacoes,
      ],
    }));
    return id;
  }, []);

  const atualizarUtente = useCallback<Ctx['atualizarUtente']>((id, dados) => {
    setEstado((e) => ({
      ...e,
      utentes: e.utentes.map((u) => (u.id === id ? { ...u, ...dados } : u)),
    }));
  }, []);

  const removerUtente = useCallback<Ctx['removerUtente']>((id) => {
    setEstado((e) => {
      const alvo = e.utentes.filter((u) => u.id === id)[0];
      return {
        ...e,
        utentes: e.utentes.filter((u) => u.id !== id),
        visitas: e.visitas.filter((v) => v.utenteId !== id),
        sinais: e.sinais.filter((s) => s.utenteId !== id),
        feridas: e.feridas.filter((f) => f.utenteId !== id),
        medicacao: e.medicacao.filter((m) => m.utenteId !== id),
        notificacoes: [
          {
            id: `n${Date.now()}`,
            tipo: 'sistema',
            titulo: 'Utente removido',
            texto: `${alvo ? alvo.nome : 'O utente'} e os respetivos registos foram removidos da plataforma.`,
            hora: 'agora',
            lida: false,
            seccao: 'utentes',
          },
          ...e.notificacoes,
        ],
      };
    });
  }, []);

  const valor: Ctx = {
    ...estado,
    pronto,
    utilizador,
    podeVer,
    obterUtente,
    adicionarUtente,
    atualizarUtente,
    removerUtente,
    entrar,
    sair,
    registarPorConvite,
    criarConvite,
    alternarPermissao,
    alterarPapel,
    alternarUtilizadorAtivo,
    definirDefinicoes,
    adicionarVisita,
    alterarEstadoVisita,
    alternarTarefa,
    adicionarSinal,
    alternarTome,
    enviarMensagem,
    marcarLida,
    marcarTodasLidas,
    reporDemo,
  };

  return <AppCtx.Provider value={valor}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
}
