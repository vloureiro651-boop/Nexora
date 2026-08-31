import { SecId } from './seccoes';
import { DashboardScreen } from '../screens/DashboardScreen';
import { UtentesScreen, ProfissionaisScreen } from '../screens/PeopleScreens';
import { AgendaScreen, VisitasScreen } from '../screens/OperationsScreens';
import {
  CuidadosScreen, PlanosScreen, AvaliacoesScreen, DiagnosticosScreen, IntervencoesScreen,
} from '../screens/CareScreens';
import { SinaisScreen, FeridasScreen, MedicacaoScreen } from '../screens/ClinicalScreens';
import {
  DocumentosScreen, RelatoriosScreen, MensagensScreen, NotificacoesScreen,
} from '../screens/SupportScreens';
import { AdministracaoScreen, ConfiguracoesScreen } from '../screens/AdminScreens';

export const REGISTO_SECCOES: Record<SecId, React.ComponentType> = {
  dashboard: DashboardScreen,
  utentes: UtentesScreen,
  agenda: AgendaScreen,
  visitas: VisitasScreen,
  cuidados: CuidadosScreen,
  planos: PlanosScreen,
  avaliacoes: AvaliacoesScreen,
  diagnosticos: DiagnosticosScreen,
  intervencoes: IntervencoesScreen,
  sinais: SinaisScreen,
  feridas: FeridasScreen,
  medicacao: MedicacaoScreen,
  documentos: DocumentosScreen,
  relatorios: RelatoriosScreen,
  mensagens: MensagensScreen,
  notificacoes: NotificacoesScreen,
  profissionais: ProfissionaisScreen,
  admin: AdministracaoScreen,
  config: ConfiguracoesScreen,
};
