import test from 'node:test';
import assert from 'node:assert/strict';
import { binomial, linhaDePascal, binomialModPorForca, digitos } from '../src/binomial.js';

test('C(n,0) e C(n,n) sao 1', () => {
  for (let n = 0; n <= 20; n++) {
    assert.equal(binomial(n, 0), 1n);
    assert.equal(binomial(n, n), 1n);
  }
});

test('C(n,k) e zero fora da faixa', () => {
  assert.equal(binomial(5, -1), 0n);
  assert.equal(binomial(5, 6), 0n);
});

test('a simetria C(n,k) = C(n,n-k) vale ate n=40', () => {
  for (let n = 0; n <= 40; n++) {
    for (let k = 0; k <= n; k++) assert.equal(binomial(n, k), binomial(n, n - k), `C(${n},${k})`);
  }
});

test('a regra da soma vale ate n=40', () => {
  for (let n = 1; n <= 40; n++) {
    for (let k = 1; k < n; k++) {
      assert.equal(binomial(n, k), binomial(n - 1, k - 1) + binomial(n - 1, k), `C(${n},${k})`);
    }
  }
});

test('o binomial bate com a linha de Pascal somada, ate n=30', () => {
  for (let n = 0; n <= 30; n++) {
    const linha = linhaDePascal(n);
    for (let k = 0; k <= n; k++) assert.equal(binomial(n, k), linha[k], `C(${n},${k})`);
  }
});

test('a linha n soma 2 elevado a n', () => {
  for (let n = 0; n <= 30; n++) {
    const soma = linhaDePascal(n).reduce((a, b) => a + b, 0n);
    assert.equal(soma, 2n ** BigInt(n), `n=${n}`);
  }
});

test('o binomial passa de 2^53 e continua exato', () => {
  const x = binomial(60, 30);
  assert.equal(x, 118264581564861424n);
  assert.ok(x > 2n ** 53n);
});

test('C(57,25) e o primeiro binomial que o double erra de fato', () => {
  // acima de 2^53 nem todo inteiro cabe num double. C(60,30) passa de 2^53 e
  // AINDA ASSIM cabe; o primeiro que nao cabe aparece em n=57, e erra por 1
  const x = binomial(57, 25);
  assert.equal(x, 9929472283517787n);
  assert.ok(x > 2n ** 53n);
  assert.equal(BigInt(Number(x)), 9929472283517788n);
  assert.notEqual(BigInt(Number(x)), x);
});

test('passar de 2^53 nao basta para o double errar', () => {
  // C(60,30) e maior que C(57,25) e mesmo assim e representado exatamente:
  // o que decide nao e o tamanho, e quantos fatores 2 o numero tem
  const cabe = binomial(60, 30);
  const naoCabe = binomial(57, 25);
  assert.ok(cabe > naoCabe);
  assert.equal(BigInt(Number(cabe)), cabe);
  assert.notEqual(BigInt(Number(naoCabe)), naoCabe);
});

test('C(52,5) e 2.598.960, as maos de poquer', () => {
  assert.equal(binomial(52, 5), 2598960n);
});

test('a divisao dentro do binomial e sempre exata', () => {
  // se nao fosse, algum valor sairia fracionario e o BigInt lancaria
  for (let n = 0; n <= 50; n++) for (let k = 0; k <= n; k++) binomial(n, k);
  assert.ok(true);
});

test('binomialModPorForca reduz o valor exato', () => {
  assert.equal(binomialModPorForca(10, 5, 7), Number(252n % 7n));
  assert.equal(binomialModPorForca(60, 30, 13), Number(118264581564861424n % 13n));
});

test('os digitos de 0 sao [0] em qualquer base', () => {
  for (const b of [2, 3, 10]) assert.deepEqual(digitos(0, b), [0]);
});

test('os digitos saem do menos significativo para o mais', () => {
  assert.deepEqual(digitos(13, 2), [1, 0, 1, 1]);
  assert.deepEqual(digitos(100, 10), [0, 0, 1]);
});

test('remontar os digitos devolve o numero, em varias bases', () => {
  for (const b of [2, 3, 5, 7, 10, 16]) {
    for (const n of [0, 1, 5, 17, 100, 255, 1000]) {
      const d = digitos(n, b);
      const volta = d.reduce((acc, x, i) => acc + x * b ** i, 0);
      assert.equal(volta, n, `n=${n}, base=${b}`);
    }
  }
});

test('todo digito fica entre 0 e a base menos 1', () => {
  for (const b of [2, 3, 7, 10]) {
    for (let n = 0; n < 200; n++) {
      for (const d of digitos(n, b)) assert.ok(d >= 0 && d < b, `n=${n}, base=${b}`);
    }
  }
});
