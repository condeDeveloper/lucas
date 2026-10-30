// Terceiro caminho, e de outra natureza: o teorema de Kummer (1852).
//
// A maior potencia de p que divide C(n, k) e o numero de "vai um" que aparece ao
// somar k com n-k na base p. Nao e uma formula para o resto da divisao, e sim
// para quantas vezes p cabe dentro do numero. Serve de juiz para o caso em que
// Lucas devolve ZERO: Lucas da zero exatamente quando ha pelo menos um vai um.

import { digitos, binomial } from './binomial.js';

/** Quantos "vai um" aparecem ao somar a com b na base p. */
export function vaiUns(a, b, p) {
  const da = digitos(a, p);
  const db = digitos(b, p);
  const tamanho = Math.max(da.length, db.length) + 1;
  let carrega = 0;
  let conta = 0;
  for (let i = 0; i < tamanho; i++) {
    const soma = (da[i] ?? 0) + (db[i] ?? 0) + carrega;
    if (soma >= p) {
      conta++;
      carrega = 1;
    } else {
      carrega = 0;
    }
  }
  return conta;
}

/** A potencia de p em C(n, k), por Kummer: o numero de vai uns de k + (n-k). */
export function potenciaPorKummer(n, k, p) {
  return vaiUns(k, n - k, p);
}

/** A mesma potencia, contada na marra: divide o numero por p ate nao dar mais. */
export function potenciaPorForca(n, k, p) {
  let x = binomial(n, k);
  if (x === 0n) return 0;
  const P = BigInt(p);
  let conta = 0;
  while (x % P === 0n) {
    x /= P;
    conta++;
  }
  return conta;
}

/**
 * A ponte entre os dois teoremas: Lucas devolve zero se e so se Kummer encontra
 * pelo menos um vai um. Isto existe para a afirmacao poder ser medida.
 */
export function zeroPorLucasEVaiUm(n, k, p, valorDeLucas) {
  return { lucasZerou: valorDeLucas === 0, temVaiUm: potenciaPorKummer(n, k, p) > 0 };
}
