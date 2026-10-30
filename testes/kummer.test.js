import test from 'node:test';
import assert from 'node:assert/strict';
import { vaiUns, potenciaPorKummer, potenciaPorForca } from '../src/kummer.js';
import { lucas } from '../src/lucas.js';
import { binomial } from '../src/binomial.js';

const PRIMOS = [2, 3, 5, 7, 11, 13];

test('somar sem passar da base nao da vai um', () => {
  assert.equal(vaiUns(1, 1, 10), 0);
  assert.equal(vaiUns(12, 34, 10), 0);
});

test('somar passando da base da vai um', () => {
  assert.equal(vaiUns(5, 5, 10), 1);
  assert.equal(vaiUns(99, 1, 10), 2);
  assert.equal(vaiUns(999, 1, 10), 3);
});

test('vai um em base 2 e o transporte do somador binario', () => {
  assert.equal(vaiUns(1, 1, 2), 1);
  assert.equal(vaiUns(3, 1, 2), 2);
  assert.equal(vaiUns(7, 1, 2), 3);
  assert.equal(vaiUns(15, 1, 2), 4);
});

test('somar com zero nunca da vai um', () => {
  for (const p of PRIMOS) for (let n = 0; n < 50; n++) assert.equal(vaiUns(n, 0, p), 0);
});

test('vai um e simetrico', () => {
  for (const p of PRIMOS) {
    for (let a = 0; a < 30; a++) for (let b = 0; b < 30; b++) {
      assert.equal(vaiUns(a, b, p), vaiUns(b, a, p), `${a}+${b} base ${p}`);
    }
  }
});

for (const p of PRIMOS) {
  test(`Kummer bate com a divisao na marra em base ${p}, ate a linha 40`, () => {
    for (let n = 0; n <= 40; n++) {
      for (let k = 0; k <= n; k++) {
        assert.equal(potenciaPorKummer(n, k, p), potenciaPorForca(n, k, p), `C(${n},${k}) base ${p}`);
      }
    }
  });
}

test('a potencia e zero exatamente quando o binomial nao e divisivel', () => {
  for (const p of [2, 3, 5]) {
    for (let n = 0; n <= 30; n++) {
      for (let k = 0; k <= n; k++) {
        const divisivel = binomial(n, k) % BigInt(p) === 0n;
        assert.equal(potenciaPorKummer(n, k, p) > 0, divisivel, `C(${n},${k}) base ${p}`);
      }
    }
  }
});

test('Lucas zera exatamente quando Kummer acha um vai um', () => {
  // os dois teoremas, escritos por pessoas diferentes em seculos diferentes,
  // dizendo a mesma coisa sobre a mesma celula
  for (const p of PRIMOS) {
    for (let n = 0; n <= 40; n++) {
      for (let k = 0; k <= n; k++) {
        const zerou = lucas(n, k, p) === 0;
        const temVaiUm = potenciaPorKummer(n, k, p) > 0;
        assert.equal(zerou, temVaiUm, `C(${n},${k}) base ${p}`);
      }
    }
  }
});

test('nas bordas do triangulo a potencia e sempre zero', () => {
  for (const p of PRIMOS) {
    for (let n = 0; n <= 40; n++) {
      assert.equal(potenciaPorKummer(n, 0, p), 0);
      assert.equal(potenciaPorKummer(n, n, p), 0);
    }
  }
});

test('C(2n, n) em base 2 nunca e impar, fora de n=0', () => {
  // somar n com n em binario sempre carrega, menos quando n e zero
  for (let n = 1; n <= 40; n++) assert.ok(potenciaPorKummer(2 * n, n, 2) > 0, `n=${n}`);
  assert.equal(potenciaPorKummer(0, 0, 2), 0);
});

test('a potencia de 2 em C(2n,n) e o numero de bits 1 de n', () => {
  for (let n = 0; n <= 60; n++) {
    let bits = 0;
    for (let x = n; x > 0; x >>= 1) bits += x & 1;
    assert.equal(potenciaPorKummer(2 * n, n, 2), bits, `n=${n}`);
  }
});

test('potenciaPorForca devolve zero para binomial zero', () => {
  assert.equal(potenciaPorForca(3, 9, 2), 0);
});

test('Kummer ERRA quando a base e composta', () => {
  // o teorema tambem exige primo, e o contraexemplo esta medido aqui
  let achou = null;
  for (let n = 0; n <= 20 && !achou; n++) {
    for (let k = 0; k <= n && !achou; k++) {
      if (potenciaPorKummer(n, k, 4) !== potenciaPorForca(n, k, 4)) achou = { n, k };
    }
  }
  assert.notEqual(achou, null, 'esperava achar divergencia em base 4');
});
