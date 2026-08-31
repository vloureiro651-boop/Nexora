import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { cores, serif } from '../lib/theme';

/**
 * Logótipo oficial CUIDADOS DE RAIZ.
 * Marca: casa com telhado em folha e raízes — lar, natureza e cuidado.
 */
export function Marca({ tamanho = 48 }: { tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 64 64">
      <Defs>
        <LinearGradient id="fundo" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#16503A" />
          <Stop offset="1" stopColor="#0F3B2A" />
        </LinearGradient>
        <LinearGradient id="folha" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#6BB98A" />
          <Stop offset="1" stopColor="#2E7D5B" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="64" height="64" rx="17" fill="url(#fundo)" />
      <Path d="M32 11 C 43 18 50 26 50 33 L 14 33 C 14 26 21 18 32 11 Z" fill="url(#folha)" />
      <Path d="M32 13 L32 33" stroke="#F3EBDA" strokeOpacity="0.7" strokeWidth="1.6" strokeLinecap="round" />
      <Path d="M32 20 L25.5 25.5 M32 20 L38.5 25.5" stroke="#F3EBDA" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" />
      <Rect x="18" y="33" width="28" height="17" rx="2.5" fill="#F3EBDA" fillOpacity="0.96" />
      <Path
        d="M28 50 L28 43.2 C 28 40.6 29.8 38.7 32 38.7 C 34.2 38.7 36 40.6 36 43.2 L 36 50 Z"
        fill="#0F3B2A"
      />
      <Path
        d="M26 50 C 25 54 22 56 19.5 57.4 M32 50 L32 58.6 M38 50 C 39 54 42 56 44.5 57.4"
        stroke={cores.begeEscuro}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

type Props = {
  tamanho?: number;
  texto?: boolean;
  tom?: 'claro' | 'escuro';
  centralizado?: boolean;
  slogan?: boolean;
};

export function Logotipo({ tamanho = 44, texto = true, tom = 'escuro', centralizado = false, slogan = true }: Props) {
  const corTexto = tom === 'claro' ? '#F3EBDA' : cores.verdeEscuro;
  const corSlogan = tom === 'claro' ? cores.bege : cores.begeEscuro2;
  const escala = tamanho / 44;

  return (
    <View style={[estilos.linha, centralizado && estilos.centralizado]}>
      <Marca tamanho={tamanho} />
      {texto ? (
        <View style={[estilos.textos, centralizado && { alignItems: 'center' }]}>
          <Text
            style={{
              fontFamily: serif,
              color: corTexto,
              fontSize: Math.max(12, 16 * escala),
              fontWeight: '700',
              letterSpacing: 1.6 * escala,
            }}
          >
            CUIDADOS DE RAIZ
          </Text>
          {slogan ? (
            <Text
              style={{
                color: corSlogan,
                fontSize: Math.max(9, 10.5 * escala),
                letterSpacing: 0.6 * escala,
                marginTop: 2,
              }}
            >
              Cuidado no conforto do lar
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  centralizado: { flexDirection: 'column', justifyContent: 'center' },
  textos: { justifyContent: 'center' },
});

export default Logotipo;
