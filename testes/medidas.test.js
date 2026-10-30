// Os numeros que aparecem no README, presos aqui. Todos sairam de
// `node ferramentas/medidor.js`; nenhum foi digitado de cabeca.

import test from 'node:test';
import assert from 'node:assert/strict';
import { medir } from '../ferramentas/medidor.js';
import { imparesVarridos, imparesPorBits, imparesPorFormula, linhaDeSierpinski } from '../src/varredura.js';

const ATE = 60;
const CELULAS = 1891;
const PRIMOS = [2, 3, 5, 7, 11, 13];

const compostos = {
  4: { discordam: 334, kummerDiscorda: 296 },
  6: { discordam: 935, kummerDiscorda: 975 },
  8: { discordam: 600, kummerDiscorda: 298 },
  9: { discordam: 360, kummerDiscorda: 217 },
  10: { discordam: 885, kummerDiscorda: 793 },
  12: { discordam: 1141, kummerDiscorda: 747 },
};

const zeros = { 2: 1290, 3: 1180, 5: 1072, 7: 991, 11: 775, 13: 756 };

test('tabela 1: o triangulo ate a linha 60 tem 1.891 celulas', () => {
  assert.equal(((ATE + 1) * (ATE + 2)) / 2, CELULAS);
  assert.equal(medir(2, ATE).celulas, CELULAS);
});

for (const p of PRIMOS) {
  test(`tabela 1, p=${p}: Lucas acerta as 1.891 celulas`, () => {
    const r = medir(p, ATE);
    assert.equal(r.celulas, CELULAS);
    assert.equal(r.concordam, CELULAS);
    assert.equal(r.discordam, 0);
  });

  test(`tabela 3, p=${p}: Kummer acerta as 1.891 celulas`, () => {
    const r = medir(p, ATE);
    assert.equal(r.kummerConcorda, CELULAS);
    assert.equal(r.kummerDiscorda, 0);
  });

  test(`tabela 5, p=${p}: ${zeros[p]} celulas divisiveis por p`, () => {
    assert.equal(medir(p, ATE).zerosDeVerdade, zeros[p]);
  });

  test(`tabela 5, p=${p}: Lucas zera nas mesmas celulas em que o valor e zero`, () => {
    const r = medir(p, ATE);
    assert.equal(r.zerosPorLucas, r.zerosDeVerdade);
  });
}

for (const p of Object.keys(compostos).map(Number)) {
  test(`tabela 2, p=${p}: Lucas erra ${compostos[p].discordam} celulas`, () => {
    const r = medir(p, ATE);
    assert.equal(r.ehPrimo, false);
    assert.equal(r.discordam, compostos[p].discordam);
    assert.equal(r.concordam, CELULAS - compostos[p].discordam);
  });

  test(`tabela 4, p=${p}: Kummer erra ${compostos[p].kummerDiscorda} celulas`, () => {
    assert.equal(medir(p, ATE).kummerDiscorda, compostos[p].kummerDiscorda);
  });
}

test('tabela 2: em base 12 Lucas erra 60,34% das celulas', () => {
  const r = medir(12, ATE);
  const fatia = (100 * r.discordam) / r.celulas;
  assert.ok(fatia > 60.33 && fatia < 60.35, `fatia medida: ${fatia}`);
});

test('tabela 2: a base composta que menos erra e a 4, com 17,66%', () => {
  const fatias = Object.keys(compostos).map((p) => ({
    p: Number(p),
    fatia: (100 * compostos[p].discordam) / CELULAS,
  }));
  fatias.sort((a, b) => a.fatia - b.fatia);
  assert.equal(fatias[0].p, 4);
  assert.ok(fatias[0].fatia > 17.65 && fatias[0].fatia < 17.67);
});

test('tabela 2: o primeiro erro de toda base composta e Lucas zerando a toa', () => {
  for (const p of Object.keys(compostos).map(Number)) {
    const erro = medir(p, ATE).primeiraDivergencia[0];
    assert.equal(erro.porLucas, 0, `base ${p}`);
    assert.notEqual(erro.porForca, 0, `base ${p}`);
  }
});

test('fechamento: 11.346 celulas varridas em base prima, zero erro', () => {
  const total = PRIMOS.reduce((a, p) => a + medir(p, ATE).celulas, 0);
  const erros = PRIMOS.reduce((a, p) => a + medir(p, ATE).discordam, 0);
  assert.equal(total, 11346);
  assert.equal(erros, 0);
});

test('fechamento: 4.255 erros de Lucas nas 11.346 celulas de base composta', () => {
  const ps = Object.keys(compostos).map(Number);
  const total = ps.reduce((a, p) => a + medir(p, ATE).celulas, 0);
  const erros = ps.reduce((a, p) => a + medir(p, ATE).discordam, 0);
  assert.equal(total, 11346);
  assert.equal(erros, 4255);
});

test('fechamento: zero erro de Kummer em base prima', () => {
  assert.equal(PRIMOS.reduce((a, p) => a + medir(p, ATE).kummerDiscorda, 0), 0);
});

const impares = { 0: 1, 1: 2, 7: 8, 8: 2, 15: 16, 16: 2, 31: 32, 32: 2, 63: 64, 100: 8, 127: 128, 128: 2 };

for (const n of Object.keys(impares).map(Number)) {
  test(`tabela 6, n=${n}: ${impares[n]} entradas impares pelos tres caminhos`, () => {
    assert.equal(imparesVarridos(n), impares[n]);
    assert.equal(imparesPorBits(n), impares[n]);
    assert.equal(imparesPorFormula(n), impares[n]);
  });
}

test('tabela 7: a linha 0 do Sierpinski tem um unico marco', () => {
  assert.equal((linhaDeSierpinski(0, 33).match(/#/g) || []).length, 1);
});

test('tabela 7: a linha 15 do Sierpinski e toda cheia', () => {
  assert.equal((linhaDeSierpinski(15, 33).match(/#/g) || []).length, 16);
  assert.equal(linhaDeSierpinski(15, 33).includes('.'), false);
});

test('tabela 7: a linha 8 do Sierpinski tem so as duas pontas', () => {
  const linha = linhaDeSierpinski(8, 33);
  assert.equal((linha.match(/#/g) || []).length, 2);
  assert.equal((linha.match(/\./g) || []).length, 7);
});

test('tabela 7: cada linha do desenho tem a largura pedida', () => {
  for (let n = 0; n < 16; n++) assert.equal(linhaDeSierpinski(n, 33).length, 33);
});
