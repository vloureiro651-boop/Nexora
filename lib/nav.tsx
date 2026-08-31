import { createContext, useContext } from 'react';
import { SecId } from './seccoes';

export type NavApp = {
  irParaSecao: (seccao: SecId) => void;
  irParaUtente: (utenteId: string) => void;
  irParaConversa: (conversaId: string) => void;
  novaVisita: (utenteId?: string) => void;
  voltar: () => void;
  seccaoAtual: SecId;
};

export const NavCtx = createContext<NavApp>({
  irParaSecao: () => undefined,
  irParaUtente: () => undefined,
  irParaConversa: () => undefined,
  novaVisita: () => undefined,
  voltar: () => undefined,
  seccaoAtual: 'dashboard',
});

export function useNav(): NavApp {
  return useContext(NavCtx);
}
