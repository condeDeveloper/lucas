import test from 'node:test';
import assert from 'node:assert/strict';
import { lucas, ehImpar, imparesNaLinha, primo } from '../src/lucas.js';
import { binomial, binomialModPorForca } from '../src/binomial.js';

const PRIMOS = [2, 3, 5, 7, 11, 13, 17];

for (const p of PRIMOS) {
  test(`Lucas bate com o binomial exato em base ${p}, ate a linha 40`, () => {
    for (let n = 0; n <= 40; n++) {
      for (let k = 0; k <= n; k++) {
        assert.equal(lucas(n, k, p), binomialModPorForca(n, k, p), `C(${n},${k}) mod ${p}`);
      }
    }
  });
}

test('Lucas devolve zero fora da faixa', () => {
  assert.equal(lucas(5, 6, 3), 0);
  assert.equal(lucas(5, -1, 3), 0);
});

test('Lucas em base maior que n devolve o proprio binomial reduzido', () => {
  // com p > n os dois numeros tem um digito so, e a formula vira a identidade
  for (let n = 0; n <= 20; n++) {
    for (let k = 0; k <= n; k++) {
      assert.equal(lucas(n, k, 23), Number(binomial(n, k) % 23n), `C(${n},${k})`);
    }
  }
});

test('Lucas zera quando um digito de k passa o de n', () => {
  // 5 em base 3 e [2,1]; 3 em base 3 e [0,1]. Nenhum digito passa, nao zera.
  // 4 em base 3 e [1,1] contra 3=[0,1]: tambem nao. Mas C(3,2) em base 2:
  // 3=[1,1], 2=[0,1] -> nao zera. Ja C(4,3) em base 2: 4=[0,0,1], 3=[1,1] zera
  assert.equal(lucas(4, 3, 2), 0);
  assert.equal(binomialModPorForca(4, 3, 2), 0);
});

test('C(n,k) e impar exatamente quando os bits de k cabem nos de n', () => {
  for (let n = 0; n <= 100; n++) {
    for (let k = 0; k <= n; k++) {
      const porBits = ehImpar(n, k);
      const deVerdade = binomial(n, k) % 2n === 1n;
      assert.equal(porBits, deVerdade, `C(${n},${k})`);
    }
  }
});

test('ehImpar concorda com Lucas em base 2', () => {
  for (let n = 0; n <= 60; n++) {
    for (let k = 0; k <= n; k++) {
      assert.equal(ehImpar(n, k), lucas(n, k, 2) === 1, `C(${n},${k})`);
    }
  }
});

test('a linha 2^m - 1 e toda impar', () => {
  for (const m of [1, 2, 3, 4, 5, 6, 7]) {
    const n = 2 ** m - 1;
    for (let k = 0; k <= n; k++) assert.equal(ehImpar(n, k), true, `C(${n},${k})`);
    assert.equal(imparesNaLinha(n), n + 1);
  }
});

test('a linha 2^m tem exatamente duas entradas impares', () => {
  for (const m of [1, 2, 3, 4, 5, 6, 7]) {
    assert.equal(imparesNaLinha(2 ** m), 2);
  }
});

test('imparesNaLinha e 2 elevado ao numero de bits 1', () => {
  for (let n = 0; n <= 200; n++) {
    let bits = 0;
    for (let x = n; x > 0; x >>= 1) bits += x & 1;
    assert.equal(imparesNaLinha(n), 2 ** bits, `n=${n}`);
  }
});

test('imparesNaLinha bate com a contagem varrida, ate n=120', () => {
  for (let n = 0; n <= 120; n++) {
    let conta = 0;
    for (let k = 0; k <= n; k++) if (ehImpar(n, k)) conta++;
    assert.equal(imparesNaLinha(n), conta, `n=${n}`);
  }
});

test('o numero de impares e sempre potencia de dois', () => {
  for (let n = 0; n <= 200; n++) {
    const x = imparesNaLinha(n);
    assert.equal(x & (x - 1), 0, `n=${n} deu ${x}`);
  }
});

test('nenhuma linha tem numero impar de entradas impares, fora a linha 0', () => {
  for (let n = 1; n <= 200; n++) assert.equal(imparesNaLinha(n) % 2, 0, `n=${n}`);
});

test('primo reconhece os primeiros primos', () => {
  assert.deepEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter(primo), [2, 3, 5, 7, 11]);
});

test('primo recusa 0, 1 e negativos', () => {
  assert.equal(primo(0), false);
  assert.equal(primo(1), false);
  assert.equal(primo(-7), false);
});

test('Lucas ERRA quando a base e composta', () => {
  // a hipotese do teorema nao e decoracao: aqui esta o contraexemplo medido
  assert.equal(lucas(4, 2, 4), 0);
  assert.equal(binomialModPorForca(4, 2, 4), 2);
  assert.equal(lucas(6, 2, 6), 0);
  assert.equal(binomialModPorForca(6, 2, 6), 3);
});
