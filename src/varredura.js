// A varredura: o triangulo de Pascal inteiro ate a linha N, celula por celula,
// com os tres caminhos medidos lado a lado.

import { binomial, binomialModPorForca } from './binomial.js';
import { lucas, ehImpar, imparesNaLinha, primo } from './lucas.js';
import { potenciaPorKummer, potenciaPorForca } from './kummer.js';

/**
 * Varre todas as celulas C(n, k) com n ate `ate` e compara Lucas com o binomial
 * exato reduzido. Devolve tambem o placar de Kummer e o de zeros.
 */
export function varrer(p, ate) {
  let celulas = 0;
  let concordam = 0;
  let discordam = 0;
  let zerosPorLucas = 0;
  let zerosDeVerdade = 0;
  let kummerConcorda = 0;
  let kummerDiscorda = 0;
  const primeiraDivergencia = [];

  for (let n = 0; n <= ate; n++) {
    for (let k = 0; k <= n; k++) {
      celulas++;
      const porLucas = lucas(n, k, p);
      const porForca = binomialModPorForca(n, k, p);
      if (porLucas === porForca) concordam++;
      else {
        discordam++;
        if (primeiraDivergencia.length < 5) {
          primeiraDivergencia.push({ n, k, porLucas, porForca });
        }
      }
      if (porLucas === 0) zerosPorLucas++;
      if (porForca === 0) zerosDeVerdade++;

      if (potenciaPorKummer(n, k, p) === potenciaPorForca(n, k, p)) kummerConcorda++;
      else kummerDiscorda++;
    }
  }

  return {
    p,
    ate,
    ehPrimo: primo(p),
    celulas,
    concordam,
    discordam,
    zerosPorLucas,
    zerosDeVerdade,
    kummerConcorda,
    kummerDiscorda,
    primeiraDivergencia,
  };
}

/** Conta as entradas impares da linha n varrendo a linha de verdade. */
export function imparesVarridos(n) {
  let conta = 0;
  for (let k = 0; k <= n; k++) if (binomial(n, k) % 2n === 1n) conta++;
  return conta;
}

/** O mesmo pela regra dos bits, sem calcular binomial nenhum. */
export function imparesPorBits(n) {
  let conta = 0;
  for (let k = 0; k <= n; k++) if (ehImpar(n, k)) conta++;
  return conta;
}

/** E pela formula fechada: 2 elevado ao numero de bits 1. */
export function imparesPorFormula(n) {
  return imparesNaLinha(n);
}

/**
 * O triangulo de Sierpinski desenhado: a linha n com '#' onde o binomial e impar.
 * Serve para o teorema virar imagem, e para o teste conferir o desenho.
 */
export function linhaDeSierpinski(n, largura) {
  const meio = Math.floor(largura / 2);
  const saida = new Array(largura).fill(' ');
  for (let k = 0; k <= n; k++) {
    const coluna = meio - n + 2 * k;
    if (coluna >= 0 && coluna < largura) saida[coluna] = ehImpar(n, k) ? '#' : '.';
  }
  return saida.join('');
}
