import { Papel } from './data';

export type SecId =
  | 'dashboard' | 'utentes' | 'agenda' | 'visitas' | 'cuidados' | 'planos'
  | 'avaliacoes' | 'diagnosticos' | 'intervencoes' | 'sinais' | 'feridas'
  | 'medicacao' | 'documentos' | 'relatorios' | 'mensagens' | 'notificacoes'
  | 'profissionais' | 'admin' | 'config';

export type Secao = {
  id: SecId;
  titulo: string;
  subtitulo: string;
  icone: string;
  iconeAtivo: string;
  grupo: string;
  cor: string;
};

export const GRUPOS = ['Visão geral', 'Jornada de cuidados', 'Registo clínico', 'Organização', 'Gestão'];

export const SECCOES: Secao[] = [
  { id: 'dashboard', titulo: 'Dashboard', subtitulo: 'Visão geral dos cuidados em curso', icone: 'grid-outline', iconeAtivo: 'grid', grupo: 'Visão geral', cor: '#2E7D5B' },
  { id: 'utentes', titulo: 'Utentes', subtitulo: 'Pessoas sob os nossos cuidados', icone: 'people-outline', iconeAtivo: 'people', grupo: 'Jornada de cuidados', cor: '#2E7D5B' },
  { id: 'agenda', titulo: 'Agenda', subtitulo: 'Planeamento da semana da equipa', icone: 'calendar-outline', iconeAtivo: 'calendar', grupo: 'Jornada de cuidados', cor: '#3E6D8E' },
  { id: 'visitas', titulo: 'Visitas', subtitulo: 'Execução e registo das visitas ao domicílio', icone: 'walk-outline', iconeAtivo: 'walk', grupo: 'Jornada de cuidados', cor: '#4E9E6B' },
  { id: 'cuidados', titulo: 'Cuidados', subtitulo: 'Catálogo de cuidados prestados em casa', icone: 'hand-left-outline', iconeAtivo: 'hand-left', grupo: 'Jornada de cuidados', cor: '#A98C58' },
  { id: 'planos', titulo: 'Planos de cuidados', subtitulo: 'Objetivos, intervenções e revisões', icone: 'clipboard-outline', iconeAtivo: 'clipboard', grupo: 'Jornada de cuidados', cor: '#2E7D5B' },
  { id: 'avaliacoes', titulo: 'Avaliações', subtitulo: 'Escalas validadas e respetiva evolução', icone: 'analytics-outline', iconeAtivo: 'analytics', grupo: 'Registo clínico', cor: '#3E6D8E' },
  { id: 'diagnosticos', titulo: 'Diagnósticos', subtitulo: 'Diagnósticos de enfermagem', icone: 'pulse-outline', iconeAtivo: 'pulse', grupo: 'Registo clínico', cor: '#B3452F' },
  { id: 'intervencoes', titulo: 'Intervenções', subtitulo: 'Ações realizadas e respetivos resultados', icone: 'construct-outline', iconeAtivo: 'construct', grupo: 'Registo clínico', cor: '#A98C58' },
  { id: 'sinais', titulo: 'Sinais vitais', subtitulo: 'Séries e tendências clínicas', icone: 'heart-outline', iconeAtivo: 'heart', grupo: 'Registo clínico', cor: '#B3452F' },
  { id: 'feridas', titulo: 'Feridas', subtitulo: 'Mapeamento e evolução das lesões', icone: 'bandage-outline', iconeAtivo: 'bandage', grupo: 'Registo clínico', cor: '#C9822B' },
  { id: 'medicacao', titulo: 'Medicação', subtitulo: 'Administração nas 5 certas', icone: 'medical-outline', iconeAtivo: 'medical', grupo: 'Registo clínico', cor: '#4E9E6B' },
  { id: 'documentos', titulo: 'Documentos', subtitulo: 'Arquivo clínico do domicílio', icone: 'document-text-outline', iconeAtivo: 'document-text', grupo: 'Organização', cor: '#5C6B63' },
  { id: 'relatorios', titulo: 'Relatórios', subtitulo: 'Indicadores e mapas de atividade', icone: 'stats-chart-outline', iconeAtivo: 'stats-chart', grupo: 'Organização', cor: '#3E6D8E' },
  { id: 'mensagens', titulo: 'Mensagens', subtitulo: 'Comunicação com equipa e famílias', icone: 'chatbubbles-outline', iconeAtivo: 'chatbubbles', grupo: 'Organização', cor: '#2E7D5B' },
  { id: 'notificacoes', titulo: 'Notificações', subtitulo: 'Alertas e acontecimentos recentes', icone: 'notifications-outline', iconeAtivo: 'notifications', grupo: 'Organização', cor: '#C9822B' },
  { id: 'profissionais', titulo: 'Profissionais', subtitulo: 'A equipa que cuida em casa', icone: 'person-add-outline', iconeAtivo: 'person-add', grupo: 'Gestão', cor: '#4E9E6B' },
  { id: 'admin', titulo: 'Administração', subtitulo: 'Utilizadores, permissões e convites', icone: 'key-outline', iconeAtivo: 'key', grupo: 'Gestão', cor: '#0F3B2A' },
  { id: 'config', titulo: 'Configurações', subtitulo: 'Preferências da conta e da aplicação', icone: 'options-outline', iconeAtivo: 'options', grupo: 'Gestão', cor: '#5C6B63' },
];

export function seccaoPorId(id: SecId): Secao {
  return SECCOES.find((s) => s.id === id) ?? SECCOES[0];
}

/** Secções destacadas na barra inferior da versão mobile (foco Equilibrada). */
export const DESTAQUES_MOBILE: SecId[] = ['utentes', 'agenda', 'visitas'];

export type MatrizPermissoes = Record<Papel, Record<SecId, boolean>>;

function base(papel: Papel, exceto: SecId[], comAdmin: boolean): Record<SecId, boolean> {
  const registo = {} as Record<SecId, boolean>;
  SECCOES.forEach((s) => {
    registo[s.id] = true;
  });
  exceto.forEach((id) => {
    registo[id] = false;
  });
  registo.admin = comAdmin;
  return registo;
}

export const PERMISSOES_INICIAIS: MatrizPermissoes = {
  administrador: base('administrador', [], true),
  enfermeiro: base('enfermeiro', ['admin', 'relatorios'], false),
  profissional: base('profissional', ['admin', 'relatorios', 'profissionais', 'planos', 'avaliacoes', 'diagnosticos'], false),
  gestor: base('gestor', ['planos', 'avaliacoes', 'diagnosticos', 'intervencoes', 'sinais', 'feridas', 'medicacao', 'cuidados'], false),
};
