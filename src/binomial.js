// O binomial calculado de verdade, em inteiro exato. E o juiz: lento, obvio, e
// sem nenhuma esperteza que possa estar errada junto com a formula que ele julga.

/**
 * C(n, k) exato, em BigInt. Multiplica e divide alternando para o numerador nao
 * crescer mais do que precisa; cada divisao e exata porque o produto de i termos
 * consecutivos sempre divide i!.
 */
export function binomial(n, k) {
  if (k < 0 || k > n) return 0n;
  const kk = Math.min(k, n - k);
  let r = 1n;
  for (let i = 0; i < kk; i++) {
    r = (r * BigInt(n - i)) / BigInt(i + 1);
  }
  return r;
}

/** A linha n do triangulo de Pascal, somada pela regra da soma, sem fatorial. */
export function linhaDePascal(n) {
  let linha = [1n];
  for (let i = 0; i < n; i++) {
    const nova = [1n];
    for (let j = 0; j < linha.length - 1; j++) nova.push(linha[j] + linha[j + 1]);
    nova.push(1n);
    linha = nova;
  }
  return linha;
}

/** C(n, k) mod m, pelo caminho caro: calcular o numero inteiro e so entao reduzir. */
export function binomialModPorForca(n, k, m) {
  return Number(binomial(n, k) % BigInt(m));
}

/** Os digitos de n na base b, do menos significativo para o mais. */
export function digitos(n, b) {
  if (n === 0) return [0];
  const saida = [];
  let x = n;
  while (x > 0) {
    saida.push(x % b);
    x = Math.floor(x / b);
  }
  return saida;
}
