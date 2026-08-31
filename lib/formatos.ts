export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export const MESES_CURTO = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
export const DIAS_CURTO = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function dataDe(offset: number): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
}

export function isoDe(offset: number): string {
  const d = dataDe(offset);
  const mes = `${d.getMonth() + 1}`.padStart(2, '0');
  const dia = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export function offsetDeIso(iso: string): number {
  const partes = iso.split('-').map(Number);
  const alvo = new Date(partes[0], partes[1] - 1, partes[2], 12, 0, 0, 0);
  return Math.round((alvo.getTime() - dataDe(0).getTime()) / 86400000);
}

export function formatarData(iso: string, comAno = false): string {
  const p = iso.split('-').map(Number);
  return `${p[2]} ${MESES_CURTO[p[1] - 1]}${comAno ? ` ${p[0]}` : ''}`;
}

export function formatarDataLonga(iso: string): string {
  const p = iso.split('-').map(Number);
  const dt = new Date(p[0], p[1] - 1, p[2]);
  return `${DIAS[dt.getDay()]}, ${p[2]} de ${MESES[p[1] - 1]} de ${p[0]}`;
}

export function formatarHora(hora: string): string {
  return hora.replace(':', 'h');
}

export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export function idadeDe(anoNascimento: number): number {
  return new Date().getFullYear() - anoNascimento;
}

export function saudacao(): string {
  const h = new Date().getHours();
  if (h < 13) return 'Bom dia';
  if (h < 19) return 'Boa tarde';
  return 'Boa noite';
}

export function minutosParaTexto(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h${`${m}`.padStart(2, '0')}` : `${h}h`;
}

export function semanaAtual(): { iso: string; dia: string; numero: number; offset: number }[] {
  const base = dataDe(0);
  const diffSegunda = (base.getDay() + 6) % 7;
  const segunda = dataDe(-diffSegunda);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(segunda.getTime());
    d.setDate(segunda.getDate() + i);
    const mes = `${d.getMonth() + 1}`.padStart(2, '0');
    const dia = `${d.getDate()}`.padStart(2, '0');
    const iso = `${d.getFullYear()}-${mes}-${dia}`;
    return { iso, dia: DIAS_CURTO[d.getDay()], numero: d.getDate(), offset: offsetDeIso(iso) };
  });
}
