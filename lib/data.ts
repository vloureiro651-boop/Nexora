import { isoDe } from './formatos';

export type Papel = 'administrador' | 'enfermeiro' | 'profissional' | 'gestor';
export type Risco = 'Alto' | 'Médio' | 'Baixo';
export type EstadoVisita = 'planeada' | 'em_curso' | 'concluida' | 'cancelada';

export const PAPEIS: { id: Papel; nome: string; descricao: string; icone: string }[] = [
  { id: 'administrador', nome: 'Administrador', descricao: 'Acesso total, permissões e convites de conta', icone: 'shield-checkmark-outline' },
  { id: 'enfermeiro', nome: 'Enfermeiro', descricao: 'Planos, diagnósticos, avaliações e visitas clínicas', icone: 'medkit-outline' },
  { id: 'profissional', nome: 'Profissional de saúde', descricao: 'Aplicação de cuidados e registo de sinais e feridas', icone: 'heart-outline' },
  { id: 'gestor', nome: 'Gestor', descricao: 'Indicadores, relatórios e coordenação da equipa', icone: 'briefcase-outline' },
];

export function nomePapel(p: Papel): string {
  return (PAPEIS.find((x) => x.id === p) || {}).nome || p;
}

export type Utente = {
  id: string; nome: string; nascimento: number; sexo: 'F' | 'M';
  morada: string; concelho: string; telefone: string; emergencia: string; parentesco: string;
  diagnostico: string; alergias: string; risco: Risco; cuidador: string; profissionalId: string;
  observacoes: string;
};

export type Tarefa = { texto: string; feito: boolean };

export type Visita = {
  id: string; utenteId: string; profissionalId: string; tipo: string;
  data: string; inicio: string; duracao: number; estado: EstadoVisita;
  tarefas: Tarefa[]; notas: string;
};

export type Sinal = {
  id: string; utenteId: string; data: string; hora: string; autor: string;
  paSis: number; paDia: number; pulso: number; temp: number; spo2: number; glicemia: number; peso: number;
};

export type Ferida = {
  id: string; utenteId: string; local: string; classificacao: string; dimensao: string;
  exsudato: string; situacao: 'Em melhoria' | 'Estável' | 'Agravada';
  dataUltima: string; proxima: string; observacao: string; evolucao: number[];
};

export type Medicamento = {
  id: string; utenteId: string; nome: string; dose: string; via: string;
  horarios: string[]; tomes: boolean[]; altoRisco: boolean; inicio: string; fim: string;
};

export type Cuidado = {
  id: string; nome: string; categoria: string; icone: string; descricao: string;
  frequencia: string; duracao: string; utentes: string[];
};

export type Plano = {
  id: string; utenteId: string; titulo: string; estado: 'Ativo' | 'A rever' | 'Concluído';
  inicio: string; revisao: string; objetivos: string[]; intervencoes: string[]; progresso: number;
};

export type Avaliacao = {
  id: string; utenteId: string; escala: string; score: number; maximo: number;
  data: string; classificacao: string; historico: number[];
};

export type Diagnostico = {
  id: string; utenteId: string; codigo: string; descricao: string; fatores: string;
  relacionados: string; confianca: 'Alta' | 'Média' | 'Baixa'; estado: 'Ativo' | 'Resolvido';
};

export type Intervencao = {
  id: string; utenteId: string; tipo: string; descricao: string; objetivo: string;
  resultado: string; data: string; profissionalId: string;
};

export type Documento = {
  id: string; titulo: string; tipo: string; utenteId: string; data: string; tamanho: string; autor: string;
};

export type Relatorio = {
  id: string; titulo: string; periodo: string; tipo: string; resumo: string; geradoEm: string; estado: 'Disponível' | 'Em processamento';
};

export type Mensagem = { id: string; de: 'eu' | 'outro'; texto: string; hora: string };
export type Conversa = { id: string; nome: string; papel: string; profissionalId: string; naoLidas: number; mensagens: Mensagem[] };

export type Notificacao = {
  id: string; tipo: 'visita' | 'cuidado' | 'sinal' | 'sistema' | 'mensagem';
  titulo: string; texto: string; hora: string; lida: boolean; seccao: string;
};

export type Profissional = {
  id: string; nome: string; papel: Papel; especialidade: string; telefone: string; email: string;
  visitasHoje: number; disponivel: boolean;
};

export type Utilizador = { id: string; nome: string; email: string; senha: string; papel: Papel; ativo: boolean; profissionalId: string };
export type Convite = { codigo: string; papel: Papel; nome: string; email: string; criadoEm: string; usado: boolean };

/* ---------------------------------------------------------------- UTENTES */
export const UTENTES: Utente[] = [
  { id: 'u1', nome: 'Amália Fernandes', nascimento: 1943, sexo: 'F', morada: 'Rua das Flores, 12', concelho: 'Lisboa', telefone: '912 445 118', emergencia: 'Paulo Fernandes', parentesco: 'Filho', diagnostico: 'Sequelas de AVC hemorrágico — hemiparesia esquerda', alergias: 'Penicilina', risco: 'Alto', cuidador: 'Filho (reside)', profissionalId: 'p2', observacoes: 'Mobilidade muito reduzida. Refere dor no ombro esquerdo ao transferir.' },
  { id: 'u2', nome: 'Joaquim Andrade', nascimento: 1949, sexo: 'M', morada: 'Travessa do Sol, 4', concelho: 'Sintra', telefone: '934 220 771', emergencia: 'Marta Andrade', parentesco: 'Nora', diagnostico: 'Diabetes mellitus tipo 2 — ferida pé diabético', alergias: 'Sem conhecimento', risco: 'Alto', cuidador: 'Esposa', profissionalId: 'p3', observacoes: 'Glicemias caprichosas. Apoio da nutricionista iniciado.' },
  { id: 'u3', nome: 'Maria de Lurdes Pinho', nascimento: 1934, sexo: 'F', morada: 'Avenida da República, 88', concelho: 'Almada', telefone: '212 998 340', emergencia: 'Helena Pinho', parentesco: 'Filha', diagnostico: 'Demência moderada — incontinência urinária', alergias: 'Iodo', risco: 'Médio', cuidador: 'Apa (turno diurno)', profissionalId: 'p2', observacoes: 'Orientação temporal alterada. Responde bem a rotinas fixas.' },
  { id: 'u4', nome: 'António Varela', nascimento: 1957, sexo: 'M', morada: 'Rua Nova, 23', concelho: 'Oeiras', telefone: '966 310 245', emergencia: 'Sofia Varela', parentesco: 'Filha', diagnostico: 'Pós-cirúrgico — hernioplastia abdominal', alergias: 'Sem conhecimento', risco: 'Baixo', cuidador: 'Esposa', profissionalId: 'p4', observacoes: 'Curativo diário. Ferida com bordos aproxima­dos, sem sinais de infeção.' },
  { id: 'u5', nome: 'Beatriz Lopes', nascimento: 1980, sexo: 'F', morada: 'Rua do Mar, 7', concelho: 'Cascais', telefone: '915 774 902', emergencia: 'Miguel Lopes', parentesco: 'Irmão', diagnostico: 'Esclerose múltipla — fadiga crónica', alergias: 'Sem conhecimento', risco: 'Baixo', cuidador: 'Autónoma', profissionalId: 'p4', observacoes: 'Programa de conservação de energia com registo diário de fadiga.' },
  { id: 'u6', nome: 'Fernando Dias', nascimento: 1937, sexo: 'M', morada: 'Largo da Igreja, 2', concelho: 'Loures', telefone: '219 447 120', emergencia: 'Rita Dias', parentesco: 'Neta', diagnostico: 'Insuficiência cardíaca III — sonda vesical em demora', alergias: 'Sulfitos', risco: 'Alto', cuidador: 'Filha (fins-de-semana)', profissionalId: 'p3', observacoes: 'Sondagem com troca quinzenal. Vigiar balanço hídrico.' },
  { id: 'u7', nome: 'Rosa Maria Teixeira', nascimento: 1946, sexo: 'F', morada: 'Rua da Escola, 15', concelho: 'Amadora', telefone: '962 003 815', emergencia: 'Hugo Teixeira', parentesco: 'Filho', diagnostico: 'Artrose bilateral de joelho — mobilidade reduzida', alergias: 'Sem conhecimento', risco: 'Médio', cuidador: 'Vizinha apoio', profissionalId: 'p2', observacoes: 'Reeducação funcional em domicílio, três sessões semanais.' },
  { id: 'u8', nome: 'Carlos Alberto Moura', nascimento: 1954, sexo: 'M', morada: 'Rua do Pinhal, 40', concelho: 'Odivelas', telefone: '917 228 664', emergencia: 'Ana Moura', parentesco: 'Esposa', diagnostico: 'EPOC estádio III — oxigenoterapia domiciliária', alergias: 'Aspirina', risco: 'Médio', cuidador: 'Esposa', profissionalId: 'p4', observacoes: 'Técnicas de economia respiratória e uso correto da máscara.' },
];

export function utentePorId(id: string): Utente {
  return UTENTES.filter((u) => u.id === id)[0] || UTENTES[0];
}

/* ------------------------------------------------------------ PROFISSIONAIS */
export const PROFISSIONAIS: Profissional[] = [
  { id: 'p1', nome: 'Marta Sequeira', papel: 'administrador', especialidade: 'Coordenação de cuidados', telefone: '913 000 111', email: 'marta@cuidadosderaiz.pt', visitasHoje: 0, disponivel: true },
  { id: 'p2', nome: 'Rui Barbosa', papel: 'enfermeiro', especialidade: 'Enfermagem medicalizada', telefone: '913 222 333', email: 'rui@cuidadosderaiz.pt', visitasHoje: 4, disponivel: true },
  { id: 'p3', nome: 'Sofia Marques', papel: 'enfermeiro', especialidade: 'Cuidados paliativos e feridas', telefone: '914 555 666', email: 'sofia@cuidadosderaiz.pt', visitasHoje: 3, disponivel: true },
  { id: 'p4', nome: 'Inês Carvalho', papel: 'profissional', especialidade: 'Técnica de enfermagem', telefone: '915 777 888', email: 'ines@cuidadosderaiz.pt', visitasHoje: 5, disponivel: true },
  { id: 'p5', nome: 'Nuno Ferreira', papel: 'profissional', especialidade: 'Assistente operacional', telefone: '916 999 000', email: 'nuno@cuidadosderaiz.pt', visitasHoje: 2, disponivel: false },
  { id: 'p6', nome: 'Carla Nogueira', papel: 'gestor', especialidade: 'Direção de serviços', telefone: '917 121 321', email: 'carla@cuidadosderaiz.pt', visitasHoje: 0, disponivel: true },
];

export function profPorId(id: string): Profissional {
  return PROFISSIONAIS.filter((p) => p.id === id)[0] || PROFISSIONAIS[1];
}

/* -------------------------------------------------------------- UTILIZADORES */
export const UTILIZADORES: Utilizador[] = [
  { id: 'a1', nome: 'Marta Sequeira', email: 'marta@cuidadosderaiz.pt', senha: '123456', papel: 'administrador', ativo: true, profissionalId: 'p1' },
  { id: 'a2', nome: 'Rui Barbosa', email: 'rui@cuidadosderaiz.pt', senha: '123456', papel: 'enfermeiro', ativo: true, profissionalId: 'p2' },
  { id: 'a3', nome: 'Sofia Marques', email: 'sofia@cuidadosderaiz.pt', senha: '123456', papel: 'enfermeiro', ativo: true, profissionalId: 'p3' },
  { id: 'a4', nome: 'Inês Carvalho', email: 'ines@cuidadosderaiz.pt', senha: '123456', papel: 'profissional', ativo: true, profissionalId: 'p4' },
  { id: 'a5', nome: 'Nuno Ferreira', email: 'nuno@cuidadosderaiz.pt', senha: '123456', papel: 'profissional', ativo: true, profissionalId: 'p5' },
  { id: 'a6', nome: 'Carla Nogueira', email: 'carla@cuidadosderaiz.pt', senha: '123456', papel: 'gestor', ativo: true, profissionalId: 'p6' },
];

export const CONVITES: Convite[] = [
  { codigo: 'RAIZ-ENF-2025', papel: 'enfermeiro', nome: 'Diogo Salgado', email: 'diogo@cuidadosderaiz.pt', criadoEm: isoDe(-4), usado: false },
  { codigo: 'RAIZ-PRO-2025', papel: 'profissional', nome: 'Ana Ribeiro', email: 'ana@cuidadosderaiz.pt', criadoEm: isoDe(-2), usado: false },
  { codigo: 'RAIZ-GES-2025', papel: 'gestor', nome: 'Pedro Antunes', email: 'pedro@cuidadosderaiz.pt', criadoEm: isoDe(-9), usado: true },
];

/* ------------------------------------------------------------------ VISITAS */
const tarefas = (a: string, b: string, c: string): Tarefa[] => [
  { texto: a, feito: true },
  { texto: b, feito: false },
  { texto: c, feito: false },
];

const tarefasFeitas = (a: string, b: string, c: string): Tarefa[] => [
  { texto: a, feito: true },
  { texto: b, feito: true },
  { texto: c, feito: true },
];

export const VISITAS: Visita[] = [
  { id: 'v1', utenteId: 'u1', profissionalId: 'p2', tipo: 'Cuidados de enfermagem', data: isoDe(0), inicio: '09:00', duracao: 45, estado: 'planeada', tarefas: tarefas('Avaliação neurológica rápida', 'Transferência para cadeira com apoio', 'Exercícios passivos ao membro superior esquerdo'), notas: 'Reforçar analgesia pré-transferência.' },
  { id: 'v2', utenteId: 'u2', profissionalId: 'p3', tipo: 'Curativo ferida', data: isoDe(0), inicio: '10:30', duracao: 40, estado: 'planeada', tarefas: tarefas('Remoção de cobertura e limpeza', 'Aplicação de cobertura de colágeno', 'Medição e registo da dimensão'), notas: 'Verificar glicemia pré-curativo.' },
  { id: 'v3', utenteId: 'u6', profissionalId: 'p3', tipo: 'Sondagem vesical', data: isoDe(0), inicio: '12:00', duracao: 30, estado: 'planeada', tarefas: tarefas('Higiene peri-uretral', 'Troca de sistema fechado', 'Registo de balanço hídrico'), notas: '' },
  { id: 'v4', utenteId: 'u4', profissionalId: 'p4', tipo: 'Curativo cirúrgico', data: isoDe(0), inicio: '14:30', duracao: 25, estado: 'planeada', tarefas: tarefas('Desinfecção da zona', 'Revisão de pontos', 'Ensino do cuidador'), notas: '' },
  { id: 'v5', utenteId: 'u3', profissionalId: 'p2', tipo: 'Higiene e conforto', data: isoDe(0), inicio: '16:00', duracao: 50, estado: 'planeada', tarefas: tarefas('Banho completo com segurança', 'Mudança de roupa de cama', 'Estimulação cognitiva leve'), notas: 'Usar comunicação simples e repetitiva.' },
  { id: 'v6', utenteId: 'u7', profissionalId: 'p4', tipo: 'Reeducação funcional', data: isoDe(0), inicio: '17:30', duracao: 35, estado: 'planeada', tarefas: tarefas('Avaliação da dor em repouso', 'Exercícios ativos de joelho', 'Orientação de marcha com canadiana'), notas: '' },
  { id: 'v7', utenteId: 'u5', profissionalId: 'p4', tipo: 'Acompanhamento', data: isoDe(-1), inicio: '11:00', duracao: 30, estado: 'concluida', tarefas: tarefasFeitas('Registo de fadiga', 'Revisão do plano de energia', 'Hidratação e dieta'), notas: 'Fadiga 4/10, melhoria face à semana anterior.' },
  { id: 'v8', utenteId: 'u8', profissionalId: 'p4', tipo: 'Oxigenoterapia', data: isoDe(-1), inicio: '15:00', duracao: 30, estado: 'concluida', tarefas: tarefasFeitas('Verificação do concentrador', 'Troca de câmaras', 'Ensinamento da esposa'), notas: 'SatO2 93% em ar ambiente.' },
  { id: 'v9', utenteId: 'u1', profissionalId: 'p2', tipo: 'Cuidados de enfermagem', data: isoDe(-2), inicio: '09:30', duracao: 45, estado: 'concluida', tarefas: tarefasFeitas('Avaliação de sinais vitais', 'Higiene parcial', 'Registo de dor'), notas: '' },
  { id: 'v10', utenteId: 'u2', profissionalId: 'p3', tipo: 'Curativo ferida', data: isoDe(-3), inicio: '10:00', duracao: 40, estado: 'concluida', tarefas: tarefasFeitas('Desbridamento suave', 'Cobertura secundária', 'Registo fotográfico de evolução'), notas: 'Redução do exsudato.' },
  { id: 'v11', utenteId: 'u6', profissionalId: 'p3', tipo: 'Medicação', data: isoDe(-1), inicio: '18:30', duracao: 20, estado: 'concluida', tarefas: tarefasFeitas('Administração de diurético', 'Pesagem e balanço', 'Registo de diurese'), notas: '' },
  { id: 'v12', utenteId: 'u3', profissionalId: 'p2', tipo: 'Higiene e conforto', data: isoDe(1), inicio: '09:00', duracao: 50, estado: 'planeada', tarefas: tarefas('Banho e hidratação', 'Mudança de posicionamento', 'Reflorescer rotina diária'), notas: '' },
  { id: 'v13', utenteId: 'u4', profissionalId: 'p4', tipo: 'Curativo cirúrgico', data: isoDe(1), inicio: '11:30', duracao: 25, estado: 'planeada', tarefas: tarefas('Higiene da ferida', 'Revisão do aspeto', 'Drenagem linfática manual'), notas: '' },
  { id: 'v14', utenteId: 'u8', profissionalId: 'p4', tipo: 'Oxigenoterapia', data: isoDe(1), inicio: '15:00', duracao: 30, estado: 'planeada', tarefas: tarefas('Verificação de saturação', 'Revisão da prescrição', 'Economia respiratória'), notas: '' },
  { id: 'v15', utenteId: 'u7', profissionalId: 'p2', tipo: 'Reeducação funcional', data: isoDe(2), inicio: '10:00', duracao: 35, estado: 'planeada', tarefas: tarefas('Avaliação de marcha', 'Exercícios de fortalecimento', 'Adaptar casa de banho'), notas: '' },
  { id: 'v16', utenteId: 'u5', profissionalId: 'p3', tipo: 'Acompanhamento', data: isoDe(2), inicio: '16:30', duracao: 30, estado: 'planeada', tarefas: tarefas('Escuta e apoio emocional', 'Registo de sintomas', 'Revisão de medicação'), notas: '' },
  { id: 'v17', utenteId: 'u2', profissionalId: 'p3', tipo: 'Curativo ferida', data: isoDe(3), inicio: '10:30', duracao: 40, estado: 'planeada', tarefas: tarefas('Limpeza e desbridamento', 'Mudança de cobertura', 'Aferição de dimensões'), notas: '' },
  { id: 'v18', utenteId: 'u6', profissionalId: 'p2', tipo: 'Sondagem vesical', data: isoDe(3), inicio: '12:00', duracao: 30, estado: 'planeada', tarefas: tarefas('Higiene peri-uretral', 'Troca quinzenal', 'Registo de cor e quantidade'), notas: '' },
];

/* ------------------------------------------------------------ SINAIS VITAIS */
export const SINAIS: Sinal[] = [
  { id: 's1', utenteId: 'u1', data: isoDe(0), hora: '09:20', autor: 'Rui Barbosa', paSis: 138, paDia: 84, pulso: 78, temp: 36.6, spo2: 96, glicemia: 112, peso: 62 },
  { id: 's2', utenteId: 'u1', data: isoDe(-3), hora: '09:15', autor: 'Rui Barbosa', paSis: 145, paDia: 88, pulso: 82, temp: 36.8, spo2: 95, glicemia: 120, peso: 62.5 },
  { id: 's3', utenteId: 'u1', data: isoDe(-7), hora: '09:40', autor: 'Sofia Marques', paSis: 152, paDia: 92, pulso: 88, temp: 37.0, spo2: 94, glicemia: 126, peso: 63 },
  { id: 's4', utenteId: 'u2', data: isoDe(0), hora: '10:45', autor: 'Sofia Marques', paSis: 132, paDia: 80, pulso: 74, temp: 36.5, spo2: 97, glicemia: 168, peso: 78 },
  { id: 's5', utenteId: 'u2', data: isoDe(-3), hora: '10:30', autor: 'Sofia Marques', paSis: 136, paDia: 82, pulso: 76, temp: 36.7, spo2: 97, glicemia: 194, peso: 78.4 },
  { id: 's6', utenteId: 'u6', data: isoDe(0), hora: '12:20', autor: 'Sofia Marques', paSis: 124, paDia: 76, pulso: 88, temp: 36.4, spo2: 93, glicemia: 104, peso: 71 },
  { id: 's7', utenteId: 'u6', data: isoDe(-5), hora: '18:40', autor: 'Sofia Marques', paSis: 128, paDia: 78, pulso: 92, temp: 36.6, spo2: 92, glicemia: 108, peso: 72.2 },
  { id: 's8', utenteId: 'u4', data: isoDe(-1), hora: '14:40', autor: 'Inês Carvalho', paSis: 126, paDia: 78, pulso: 70, temp: 36.9, spo2: 98, glicemia: 98, peso: 81 },
  { id: 's9', utenteId: 'u8', data: isoDe(-1), hora: '15:20', autor: 'Inês Carvalho', paSis: 134, paDia: 82, pulso: 84, temp: 36.7, spo2: 93, glicemia: 110, peso: 69 },
  { id: 's10', utenteId: 'u3', data: isoDe(-2), hora: '09:30', autor: 'Rui Barbosa', paSis: 142, paDia: 86, pulso: 76, temp: 36.5, spo2: 96, glicemia: 118, peso: 55 },
  { id: 's11', utenteId: 'u7', data: isoDe(-1), hora: '17:40', autor: 'Inês Carvalho', paSis: 130, paDia: 80, pulso: 72, temp: 36.6, spo2: 97, glicemia: 102, peso: 66 },
  { id: 's12', utenteId: 'u5', data: isoDe(-1), hora: '11:20', autor: 'Inês Carvalho', paSis: 118, paDia: 74, pulso: 68, temp: 36.4, spo2: 98, glicemia: 92, peso: 58 },
];

/* ------------------------------------------------------------------ FERIDAS */
export const FERIDAS: Ferida[] = [
  { id: 'f1', utenteId: 'u2', local: 'Pé direito — região plantar', classificacao: 'Pressão III / Wagner 2', dimensao: '3,2 × 2,1 cm', exsudato: 'Moderado, seroso', situacao: 'Em melhoria', dataUltima: isoDe(-3), proxima: isoDe(0), observacao: 'Desbridamento quinzenal e offloading obrigatório.', evolucao: [4.6, 4.2, 3.9, 3.5, 3.2] },
  { id: 'f2', utenteId: 'u4', local: 'Ferida cirúrgica — flanco esquerdo', classificacao: 'Incisional, bordos aproxima­dos', dimensao: '8,0 × 1,2 cm', exsudato: 'Escasso', situacao: 'Em melhoria', dataUltima: isoDe(-1), proxima: isoDe(1), observacao: 'Sem sinais flogísticos. Retirada de pontos ao 10.º dia.', evolucao: [9.4, 9.0, 8.6, 8.3, 8.0] },
  { id: 'f3', utenteId: 'u1', local: 'Zona sacral — maior pressão', classificacao: 'Pressão II superficial', dimensao: '2,4 × 2,0 cm', exsudato: 'Pouco exsudativa', situacao: 'Estável', dataUltima: isoDe(0), proxima: isoDe(1), observacao: 'Mudança de decúbito de 2 em 2 horas. Colchão antiescaras solicitado.', evolucao: [2.2, 2.4, 2.3, 2.4, 2.4] },
  { id: 'f4', utenteId: 'u6', local: 'Calcanhar direito — ponto de apoio', classificacao: 'Pressão I', dimensao: '1,8 × 1,5 cm', exsudato: 'Mínimo', situacao: 'Agravada', dataUltima: isoDe(-2), proxima: isoDe(0), observacao: 'Imobilidade prolongada. Iniciar almofada flutuante e troca reforçada de posição.', evolucao: [1.0, 1.2, 1.4, 1.6, 1.8] },
];

/* -------------------------------------------------------------- MEDICAÇÃO */
export const MEDICACAO: Medicamento[] = [
  { id: 'm1', utenteId: 'u1', nome: 'Enalapril', dose: '10 mg', via: 'Oral', horarios: ['08:00', '20:00'], tomes: [true, false], altoRisco: false, inicio: isoDe(-60), fim: isoDe(30) },
  { id: 'm2', utenteId: 'u1', nome: 'Enoxaparina', dose: '40 mg', via: 'Subcutânea', horarios: ['20:00'], tomes: [false], altoRisco: true, inicio: isoDe(-12), fim: isoDe(6) },
  { id: 'm3', utenteId: 'u2', nome: 'Metformina', dose: '850 mg', via: 'Oral', horarios: ['08:30', '20:30'], tomes: [true, false], altoRisco: false, inicio: isoDe(-120), fim: isoDe(60) },
  { id: 'm4', utenteId: 'u2', nome: 'Insulina NPH', dose: '18 UI', via: 'Subcutânea', horarios: ['22:00'], tomes: [false], altoRisco: true, inicio: isoDe(-45), fim: isoDe(45) },
  { id: 'm5', utenteId: 'u6', nome: 'Furosemida', dose: '40 mg', via: 'Oral', horarios: ['08:00'], tomes: [true], altoRisco: false, inicio: isoDe(-90), fim: isoDe(90) },
  { id: 'm6', utenteId: 'u6', nome: 'Digoxina', dose: '0,25 mg', via: 'Oral', horarios: ['08:00'], tomes: [true], altoRisco: true, inicio: isoDe(-90), fim: isoDe(30) },
  { id: 'm7', utenteId: 'u3', nome: 'Risperidona', dose: '1 mg', via: 'Oral', horarios: ['21:00'], tomes: [false], altoRisco: false, inicio: isoDe(-30), fim: isoDe(30) },
  { id: 'm8', utenteId: 'u3', nome: 'Paracetamol', dose: '1 g', via: 'Oral', horarios: ['12:00', '20:00'], tomes: [true, false], altoRisco: false, inicio: isoDe(-5), fim: isoDe(2) },
  { id: 'm9', utenteId: 'u4', nome: 'Amoxicilina + Clavulanato', dose: '1 g', via: 'Oral', horarios: ['08:00', '20:00'], tomes: [true, false], altoRisco: false, inicio: isoDe(-6), fim: isoDe(1) },
  { id: 'm10', utenteId: 'u8', nome: 'Formoterol', dose: '12 µg', via: 'Inalatória', horarios: ['08:00', '20:00'], tomes: [true, false], altoRisco: false, inicio: isoDe(-200), fim: isoDe(30) },
  { id: 'm11', utenteId: 'u7', nome: 'Paracetamol', dose: '1 g', via: 'Oral', horarios: ['12:00', '22:00'], tomes: [true, false], altoRisco: false, inicio: isoDe(-20), fim: isoDe(10) },
  { id: 'm12', utenteId: 'u5', nome: 'Amantadina', dose: '100 mg', via: 'Oral', horarios: ['09:00'], tomes: [true], altoRisco: false, inicio: isoDe(-40), fim: isoDe(50) },
];

/* ---------------------------------------------------------------- CUIDADOS */
export const CUIDADOS: Cuidado[] = [
  { id: 'c1', nome: 'Higiene completa em domicílio', categoria: 'Conforto', icone: 'water-outline', descricao: 'Banho seguro com preservação da dignidade, hidratação da pele e mudança de roupa.', frequencia: 'Diária', duracao: '45 min', utentes: ['u3', 'u1', 'u7'] },
  { id: 'c2', nome: 'Tratamento de feridas e curativos', categoria: 'Clínico', icone: 'bandage-outline', descricao: 'Limpeza, desbridamento, medida da ferida e escolha da cobertura adequada.', frequencia: 'Conforme prescrição', duracao: '30-40 min', utentes: ['u2', 'u4', 'u1', 'u6'] },
  { id: 'c3', nome: 'Administração de medicação', categoria: 'Clínico', icone: 'medical-outline', descricao: 'Administração nas 5 certas com verificação de via, dose e resposta do utente.', frequencia: '1-2 ×/dia', duracao: '15 min', utentes: ['u1', 'u2', 'u6', 'u3'] },
  { id: 'c4', nome: 'Sondagem vesical e balanço hídrico', categoria: 'Clínico', icone: 'flask-outline', descricao: 'Troca de sistema fechado, higiene peri-uretral e registo de diurese.', frequencia: 'Quinzenal', duracao: '30 min', utentes: ['u6'] },
  { id: 'c5', nome: 'Mobilização e prevenção de úlceras', categoria: 'Reabilitação', icone: 'walk-outline', descricao: 'Mudanças de decúbito, exercícios passivos e ensino de transferências à família.', frequencia: '3 ×/dia', duracao: '20 min', utentes: ['u1', 'u6', 'u7'] },
  { id: 'c6', nome: 'Reeducação respiratória', categoria: 'Reabilitação', icone: 'fitness-outline', descricao: 'Economia respiratória, uso correto da máscara e tosse assistida.', frequencia: 'Diária', duracao: '25 min', utentes: ['u8'] },
  { id: 'c7', nome: 'Apoio cognitivo e estimulação', categoria: 'Psicossocial', icone: 'sparkles-outline', descricao: 'Rotinas, rememoração e atividades simples para preservar a orientação.', frequencia: 'Diária', duracao: '20 min', utentes: ['u3'] },
  { id: 'c8', nome: 'Ensino da família e cuidador', categoria: 'Formação', icone: 'school-outline', descricao: 'Capacitar a família em curativos, medicação e sinais de alarme.', frequencia: 'Semanal', duracao: '30 min', utentes: ['u2', 'u4', 'u8'] },
];

/* ------------------------------------------------------- PLANOS DE CUIDADOS */
export const PLANOS: Plano[] = [
  { id: 'pl1', utenteId: 'u1', titulo: 'Recuperação funcional pós-AVC', estado: 'Ativo', inicio: isoDe(-28), revisao: isoDe(7), objetivos: ['Ganho de força no membro superior esquerdo', 'Prevenção de contraturas', 'Independência parcial em cadeira de rodas'], intervencoes: ['Exercícios passivos 2 ×/dia', 'Alongamento de grupos musculares', 'Treino de transferências com dois apoios'], progresso: 62 },
  { id: 'pl2', utenteId: 'u2', titulo: 'Cicatrização da ferida do pé diabético', estado: 'Ativo', inicio: isoDe(-18), revisao: isoDe(4), objetivos: ['Redução de 50% da dimensão da ferida', 'Glicemia capilar inferior a 180 mg/dL', 'Zero episódios de infeção'], intervencoes: ['Curativo com cobertura de colágeno', 'Offloading com calçado ortopédico', 'Educação em vigilância diária do pé'], progresso: 55 },
  { id: 'pl3', utenteId: 'u6', titulo: 'Estabilização da insuficiência cardíaca', estado: 'A rever', inicio: isoDe(-45), revisao: isoDe(2), objetivos: ['Ausência de edemas de membros inferiores', 'Peso estável (±1 kg)', 'Sem dispneia em repouso'], intervencoes: ['Balanço hídrico diário', 'Sondagem com registo de diurese', 'Dieta hipossódica supervisionada'], progresso: 74 },
  { id: 'pl4', utenteId: 'u3', titulo: 'Conforto e integridade cutânea na demência', estado: 'Ativo', inicio: isoDe(-21), revisao: isoDe(10), objetivos: ['Pele íntegra', 'Rotina diária preservada', 'Redução da agitação noturna'], intervencoes: ['Hidratação diária', 'Mudança de decúbito de 2 em 2 horas', 'Estimulação cognitiva ao final do dia'], progresso: 80 },
  { id: 'pl5', utenteId: 'u4', titulo: 'Recuperação pós-cirúrgica abdominal', estado: 'Concluído', inicio: isoDe(-14), revisao: isoDe(5), objetivos: ['Ferida cirúrgica sem infeção', 'Retoma da marcha autónoma'], intervencoes: ['Curativo diário', 'Mobilização precoce', 'Ensinamento de cuidados à família'], progresso: 100 },
];

/* -------------------------------------------------------------- AVALIAÇÕES */
export const AVALIACOES: Avaliacao[] = [
  { id: 'av1', utenteId: 'u1', escala: 'Índice de Barthel', score: 35, maximo: 100, data: isoDe(-3), classificacao: 'Dependência grave', historico: [28, 30, 33, 35] },
  { id: 'av2', utenteId: 'u3', escala: 'Escala de Norton', score: 12, maximo: 20, data: isoDe(-2), classificacao: 'Risco de úlcera', historico: [15, 14, 13, 12] },
  { id: 'av3', utenteId: 'u2', escala: 'Escala de dor (EVA)', score: 4, maximo: 10, data: isoDe(-3), classificacao: 'Dor moderada', historico: [6, 5, 5, 4] },
  { id: 'av4', utenteId: 'u6', escala: 'Escala de Katz', score: 3, maximo: 6, data: isoDe(-5), classificacao: 'Dependência moderada', historico: [2, 2, 3, 3] },
  { id: 'av5', utenteId: 'u7', escala: 'Índice de Barthel', score: 55, maximo: 100, data: isoDe(-1), classificacao: 'Dependência moderada', historico: [48, 50, 53, 55] },
  { id: 'av6', utenteId: 'u8', escala: 'Escala MRC de dispneia', score: 3, maximo: 5, data: isoDe(-1), classificacao: 'Dispneia ao deslocar', historico: [4, 4, 3, 3] },
];

/* ----------------------------------------------------------- DIAGNÓSTICOS */
export const DIAGNOSTICOS: Diagnostico[] = [
  { id: 'd1', utenteId: 'u1', codigo: '00085', descricao: 'Mobilidade física imparcial', fatores: 'Hemiparesia esquerda, fraqueza muscular', relacionados: 'Sequelas de AVC hemorrágico', confianca: 'Alta', estado: 'Ativo' },
  { id: 'd2', utenteId: 'u2', codigo: '00046', descricao: 'Integridade da pele prejudicada', fatores: 'Hiperglicemia, neuropatia periférica, pressão plantar', relacionados: 'Pé diabético', confianca: 'Alta', estado: 'Ativo' },
  { id: 'd3', utenteId: 'u3', codigo: '00160', descricao: 'Risco de lesão por pressão', fatores: 'Imobilidade, incontinência, nutrição deficiente', relacionados: 'Demência moderada', confianca: 'Alta', estado: 'Ativo' },
  { id: 'd4', utenteId: 'u6', codigo: '00045', descricao: 'Déficit de débito cardíaco', fatores: 'Insuficiência miocárdica, sobrecarga de líquidos', relacionados: 'Insuficiência cardíaca III', confianca: 'Alta', estado: 'Ativo' },
  { id: 'd5', utenteId: 'u8', codigo: '00032', descricao: 'Padrão respiratório ineficaz', fatores: 'Obstrução bronquial, hiperinsuflação', relacionados: 'EPOC estádio III', confianca: 'Média', estado: 'Ativo' },
  { id: 'd6', utenteId: 'u4', codigo: '00073', descricao: 'Risco de infeção', fatores: 'Ferida cirúrgica, procedimentos invasivos', relacionados: 'Pós-operatório de hernioplastia', confianca: 'Baixa', estado: 'Resolvido' },
];

/* ----------------------------------------------------------- INTERVENÇÕES */
export const INTERVENCOES: Intervencao[] = [
  { id: 'i1', utenteId: 'u1', tipo: 'Reabilitação', descricao: 'Exercícios passivos de membros superiores e inferiores', objetivo: 'Prevenir contraturas e manter amplitude articular', resultado: 'Amplitude mantida sem sinais de contratura', data: isoDe(0), profissionalId: 'p2' },
  { id: 'i2', utenteId: 'u2', tipo: 'Curativos', descricao: 'Hidroterapia com solução salina e cobertura de colágeno', objetivo: 'Reduzir exsudato e favorecer granulação', resultado: 'Granulação rosada, exsudato moderado', data: isoDe(-3), profissionalId: 'p3' },
  { id: 'i3', utenteId: 'u6', tipo: 'Farmacologia', descricao: 'Administração de diurético de alça com pesagem prévia', objetivo: 'Controlo da sobrecarga hídrica', resultado: 'Diurese de 1 600 mL, perda de 0,8 kg', data: isoDe(-1), profissionalId: 'p3' },
  { id: 'i4', utenteId: 'u3', tipo: 'Higiene e conforto', descricao: 'Banho completo com hidratação e mudança de roupa', objetivo: 'Manter integridade cutânea e dignidade', resultado: 'Pele íntegra, utente colaboradora', data: isoDe(0), profissionalId: 'p2' },
  { id: 'i5', utenteId: 'u8', tipo: 'Educação', descricao: 'Ensino de técnicas de economia respiratória', objetivo: 'Reduzir dispneia nas atividades diárias', resultado: 'Família autónoma no uso da máscara', data: isoDe(-1), profissionalId: 'p4' },
  { id: 'i6', utenteId: 'u4', tipo: 'Mobilização', descricao: 'Mobilização precoce com apoio e treino de marcha', objetivo: 'Prevenir complicações tromboembólicas', resultado: 'Marcha autónoma com bengala ao 6.º dia', data: isoDe(-1), profissionalId: 'p4' },
  { id: 'i7', utenteId: 'u7', tipo: 'Reabilitação', descricao: 'Fortalecimento de quadríceps e treino de escadas', objetivo: 'Melhorar autonomia na deambulação', resultado: 'Dor 3/10 ao fim da sessão', data: isoDe(-1), profissionalId: 'p4' },
  { id: 'i8', utenteId: 'u5', tipo: 'Apoio psicossocial', descricao: 'Escuta ativa e plano de gestão de energia', objetivo: 'Reduzir impacto da fadiga nas atividades', resultado: 'Adesão ao plano, fadiga 4/10', data: isoDe(-1), profissionalId: 'p4' },
];

/* ------------------------------------------------------------- DOCUMENTOS */
export const DOCUMENTOS: Documento[] = [
  { id: 'doc1', titulo: 'Relatório de enfermagem — evolução mensal', tipo: 'Relatório', utenteId: 'u1', data: isoDe(-1), tamanho: '240 KB', autor: 'Rui Barbosa' },
  { id: 'doc2', titulo: 'Prescrição médica — Enalapril 10 mg', tipo: 'Receita', utenteId: 'u1', data: isoDe(-6), tamanho: '96 KB', autor: 'Dr.ª Helena Pinheiro' },
  { id: 'doc3', titulo: 'Termo de consentimento de cuidados domiciliários', tipo: 'Consentimento', utenteId: 'u2', data: isoDe(-18), tamanho: '180 KB', autor: 'Marta Sequeira' },
  { id: 'doc4', titulo: 'Registo fotográfico da ferida plantar', tipo: 'Imagem', utenteId: 'u2', data: isoDe(-3), tamanho: '1,2 MB', autor: 'Sofia Marques' },
  { id: 'doc5', titulo: 'Plano de cuidados de enfermagem assinado', tipo: 'Plano', utenteId: 'u6', data: isoDe(-9), tamanho: '310 KB', autor: 'Sofia Marques' },
  { id: 'doc6', titulo: 'Receituário de reaproveitamento', tipo: 'Receita', utenteId: 'u6', data: isoDe(-4), tamanho: '88 KB', autor: 'Dr. Rui Antunes' },
  { id: 'doc7', titulo: 'Autorização de acesso a dados clínicos', tipo: 'Consentimento', utenteId: 'u3', data: isoDe(-21), tamanho: '150 KB', autor: 'Marta Sequeira' },
  { id: 'doc8', titulo: 'Relatório de oxigenoterapia domiciliária', tipo: 'Relatório', utenteId: 'u8', data: isoDe(-2), tamanho: '205 KB', autor: 'Inês Carvalho' },
];

/* -------------------------------------------------------------- RELATÓRIOS */
export const RELATORIOS: Relatorio[] = [
  { id: 'r1', titulo: 'Atividade da equipa — semana corrente', periodo: 'Seg - Dom', tipo: 'Operacional', resumo: '42 visitas realizadas, 3 canceladas, tempo médio de 37 min.', geradoEm: isoDe(0), estado: 'Disponível' },
  { id: 'r2', titulo: 'Evolução de feridas por utente', periodo: 'Últimos 90 dias', tipo: 'Clínico', resumo: '83% das feridas em melhoria; 1 caso a exigir reavaliação.', geradoEm: isoDe(-1), estado: 'Disponível' },
  { id: 'r3', titulo: 'Adesão à medicação em domicílio', periodo: 'Mês corrente', tipo: 'Clínico', resumo: 'Taxa global de adesão de 94%, 6 reforços educativos realizados.', geradoEm: isoDe(-2), estado: 'Disponível' },
  { id: 'r4', titulo: 'Indicadores de qualidade assistencial', periodo: 'Trimestre', tipo: 'Gestão', resumo: 'Satisfação das famílias 4,7/5; 100% das visitas registadas no dia.', geradoEm: isoDe(-5), estado: 'Disponível' },
  { id: 'r5', titulo: 'Carga de trabalho por profissional', periodo: 'Últimos 30 dias', tipo: 'Gestão', resumo: 'Distribuição equilibrada — média de 4,2 visitas/dia por profissional.', geradoEm: isoDe(-7), estado: 'Disponível' },
  { id: 'r6', titulo: 'Mapa de resíduos clínicos domiciliários', periodo: 'Mês corrente', tipo: 'Regulamentar', resumo: 'Recolha certificada e conformidade com o RGRRS.', geradoEm: isoDe(-3), estado: 'Disponível' },
];

/* --------------------------------------------------------------- MENSAGENS */
export const CONVERSAS: Conversa[] = [
  {
    id: 'cv1', nome: 'Sofia Marques', papel: 'Enfermeira — Feridas', profissionalId: 'p3', naoLidas: 2,
    mensagens: [
      { id: 'ms1', de: 'outro', texto: 'Bom dia! A ferida do senhor Joaquim apresenta menos exsudato. Deixei o registo na secção de Feridas.', hora: '08:42' },
      { id: 'ms2', de: 'eu', texto: 'Excelente notícia. Vou reforçar o offloading com a família hoje.', hora: '08:50' },
      { id: 'ms3', de: 'outro', texto: 'Perfeito. Sugiro manter a cobertura de colágeno até quinta-feira.', hora: '09:05' },
    ],
  },
  {
    id: 'cv2', nome: 'Rui Barbosa', papel: 'Enfermeiro — Visitas', profissionalId: 'p2', naoLidas: 0,
    mensagens: [
      { id: 'ms4', de: 'outro', texto: 'Consegues cobrir a visita das 16h à Amália? Tenho de ficar com o senhor Fernando.', hora: 'Ontem 17:20' },
      { id: 'ms5', de: 'eu', texto: 'Fico eu. Já está na minha agenda.', hora: 'Ontem 17:26' },
    ],
  },
  {
    id: 'cv3', nome: 'Dr.ª Helena Pinheiro', papel: 'Médica prescritora', profissionalId: 'p2', naoLidas: 1,
    mensagens: [
      { id: 'ms6', de: 'outro', texto: 'Bom dia, pode iniciar a profilaxia com enoxaparina à senhora Amália? A prescrição já foi enviada.', hora: '07:55' },
      { id: 'ms7', de: 'eu', texto: 'Bom dia, doutora. Sim, iniciamos hoje e confirmamos alergias antes da administração.', hora: '08:10' },
    ],
  },
  {
    id: 'cv4', nome: 'Carla Nogueira', papel: 'Direção de serviços', profissionalId: 'p6', naoLidas: 0,
    mensagens: [
      { id: 'ms8', de: 'outro', texto: 'Lembro a reunião de coordenação amanhã às 09h30. Trazam o mapa de visitas da semana.', hora: 'Ontem 12:00' },
    ],
  },
  {
    id: 'cv5', nome: 'Família Fernandes', papel: 'Família do utente', profissionalId: 'p2', naoLidas: 3,
    mensagens: [
      { id: 'ms9', de: 'outro', texto: 'Boa noite. A mãe referiu dor no ombro hoje. Devo dar alguma coisa?', hora: '21:12' },
      { id: 'ms10', de: 'eu', texto: 'Boa noite, Paulo. Pode administrar paracetamol 1 g caso a dor persista. Estaremos lá amanhã às 9h.', hora: '21:20' },
      { id: 'ms11', de: 'outro', texto: 'Muito obrigado, são sempre tão atenciosos.', hora: '21:22' },
    ],
  },
];

/* ----------------------------------------------------------- NOTIFICAÇÕES */
export const NOTIFICACOES: Notificacao[] = [
  { id: 'n1', tipo: 'visita', titulo: 'Visita iniciada em breve', texto: 'Visita à Amália Fernandes às 09h00 com Rui Barbosa.', hora: 'há 10 min', lida: false, seccao: 'agenda' },
  { id: 'n2', tipo: 'cuidado', titulo: 'Ferida a agravar', texto: 'Ferida do calcanhar de Fernando Dias registou aumento de dimensão.', hora: 'há 1 h', lida: false, seccao: 'feridas' },
  { id: 'n3', tipo: 'sinal', titulo: 'Glicemia elevada', texto: 'Joaquim Andrade — glicemia capilar de 168 mg/dL registada.', hora: 'há 2 h', lida: false, seccao: 'sinais' },
  { id: 'n4', tipo: 'sistema', titulo: 'Convite criado', texto: 'O convite RAIZ-PRO-2025 está disponível para Ana Ribeiro.', hora: 'hoje', lida: true, seccao: 'admin' },
  { id: 'n5', tipo: 'mensagem', titulo: 'Nova mensagem da família', texto: 'Paulo Fernandes respondeu sobre a analgesia da mãe.', hora: 'ontem', lida: false, seccao: 'mensagens' },
  { id: 'n6', tipo: 'cuidado', titulo: 'Revisão de plano', texto: 'O plano do senhor Fernando Dias deve ser revisto em 2 dias.', hora: 'ontem', lida: true, seccao: 'planos' },
  { id: 'n7', tipo: 'visita', titulo: 'Visita concluída', texto: 'Inês Carvalho concluiu a oxigenoterapia ao senhor Carlos Moura.', hora: 'ontem', lida: true, seccao: 'visitas' },
  { id: 'n8', tipo: 'sistema', titulo: 'Backup clínico concluído', texto: 'Cópia de segurança dos registos clínicos efetuada com sucesso.', hora: 'há 2 dias', lida: true, seccao: 'config' },
];

export const TIPOS_VISITA = [
  'Cuidados de enfermagem', 'Curativo ferida', 'Curativo cirúrgico', 'Medicação',
  'Sondagem vesical', 'Higiene e conforto', 'Reeducação funcional', 'Oxigenoterapia',
  'Acompanhamento', 'Avaliação clínica',
];
