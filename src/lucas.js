// O teorema de Lucas (1878):
//
//   C(n, k) mod p = PRODUTO de C(n_i, k_i) mod p
//
// onde n_i e k_i sao os digitos de n e k escritos na base p. Um numero enorme
// vira um punhado de binomiais minusculos, nenhum deles maior que p.
//
// O teorema exige p PRIMO. Este arquivo nao verifica isso de proposito: a
// varredura mede o que acontece quando a hipotese cai.

import { digitos, binomial } from './binomial.js';

/** C(n, k) mod p pelo teorema de Lucas: so olha os digitos. */
export function lucas(n, k, p) {
  if (k < 0 || k > n) return 0;
  const dn = digitos(n, p);
  const dk = digitos(k, p);
  let r = 1;
  for (let i = 0; i < dn.length; i++) {
    const a = dn[i];
    const b = dk[i] ?? 0;
    // se algum digito de k passa o de n, o binomial pequeno zera, e o produto zera
    if (b > a) return 0;
    r = (r * Number(binomial(a, b) % BigInt(p))) % p;
  }
  return r;
}

/**
 * A consequencia mais conhecida: C(n, k) e IMPAR exatamente quando os bits de k
 * cabem dentro dos bits de n. E por isso que o triangulo de Pascal modulo 2
 * desenha o triangulo de Sierpinski.
 */
export function ehImpar(n, k) {
  return (k & ~n) === 0;
}

/** Quantas entradas impares tem a linha n: 2 elevado ao numero de bits 1 de n. */
export function imparesNaLinha(n) {
  let bits = 0;
  let x = n;
  while (x > 0) {
    bits += x & 1;
    x >>= 1;
  }
  return 2 ** bits;
}

export function primo(x) {
  if (x < 2) return false;
  for (let i = 2; i * i <= x; i++) if (x % i === 0) return false;
  return true;
}
