import { Platform, TextStyle, ViewStyle } from 'react-native';

/** Paleta oficial da marca CUIDADOS DE RAIZ — verde, verde escuro, bege e tons naturais. */
export const cores = {
  verdeEscuro: '#0F3B2A',
  verdeEscuro2: '#16503A',
  verde: '#2E7D5B',
  verdeClaro: '#5AA87B',
  verdeMuitoClaro: '#E9F2EC',
  bege: '#E7DCC6',
  begeEscuro: '#C9B48A',
  begeEscuro2: '#A98C58',
  creme: '#F7F4EC',
  branco: '#FFFFFF',
  tinta: '#16241D',
  tintaMedia: '#5C6B63',
  tintaFraca: '#8A978F',
  linha: '#E4E0D4',
  alerta: '#C9822B',
  perigo: '#B3452F',
  info: '#3E6D8E',
};

export type Tema = {
  escuro: boolean;
  fundo: string;
  superficie: string;
  superficieAlta: string;
  texto: string;
  textoMedia: string;
  textoFraca: string;
  linha: string;
  primaria: string;
  primariaClara: string;
  primariaSuave: string;
  bege: string;
  begeSuave: string;
  alerta: string;
  perigo: string;
  info: string;
  sucesso: string;
  sombra: ViewStyle;
};

export const temaClaro: Tema = {
  escuro: false,
  fundo: cores.creme,
  superficie: cores.branco,
  superficieAlta: '#FDFCF8',
  texto: cores.tinta,
  textoMedia: cores.tintaMedia,
  textoFraca: cores.tintaFraca,
  linha: cores.linha,
  primaria: cores.verde,
  primariaClara: cores.verdeClaro,
  primariaSuave: cores.verdeMuitoClaro,
  bege: cores.bege,
  begeSuave: '#F3EDE0',
  alerta: cores.alerta,
  perigo: cores.perigo,
  info: cores.info,
  sucesso: cores.verde,
  sombra: {
    shadowColor: '#16241D',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
};

export const temaEscuro: Tema = {
  escuro: true,
  fundo: '#0D1512',
  superficie: '#16211C',
  superficieAlta: '#1C2A23',
  texto: '#EDF3EF',
  textoMedia: '#A9B8AF',
  textoFraca: '#7E8E85',
  linha: '#27352E',
  primaria: '#4E9E6B',
  primariaClara: '#6BB98A',
  primariaSuave: '#1D3128',
  bege: '#C9B48A',
  begeSuave: '#232E27',
  alerta: '#D89A48',
  perigo: '#D06A50',
  info: '#5A8FAE',
  sucesso: '#4E9E6B',
  sombra: {
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
};

export const raio = { sm: 10, md: 14, lg: 20, xl: 28, pilula: 999 };

export const espaco = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

/** Tipografia serifada usada no logótipo e nos títulos premium. */
export const serif = (Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, "Times New Roman", serif',
  default: 'serif',
}) || 'serif') as string;

export const sans = (Platform.select({
  ios: 'System',
  android: 'sans-serif',
  web: 'System, -apple-system, "Segoe UI", Roboto, sans-serif',
  default: 'System',
}) || 'System') as string;

export const tipoTitulo: TextStyle = { fontFamily: serif, fontWeight: '700', letterSpacing: 0.2 };
