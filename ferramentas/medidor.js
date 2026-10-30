#!/usr/bin/env node
// O medidor: roda as varreduras e imprime as tabelas que vao para o README.
// Nenhum numero do README e digitado a mao; todos saem daqui.

import { varrer, imparesVarridos, imparesPorBits, imparesPorFormula, linhaDeSierpinski } from '../src/varredura.js';
import { primo } from '../src/lucas.js';



const br = (x) => x.toLocaleString('pt-BR');

const guardado = new Map();
export function medir(p, ate) {
  const chave = `${p}:${ate}`;
  if (!guardado.has(chave)) guardado.set(chave, varrer(p, ate));
  return guardado.get(chave);
}

const PRIMOS = [2, 3, 5, 7, 11, 13];
const COMPOSTOS = [4, 6, 8, 9, 10, 12];
const ATE = 60;

function imprimir() {
  console.log('\n== Tabela 1: Lucas contra o binomial exato, com p PRIMO ==');
  console.log(`  Triangulo inteiro ate a linha ${ATE}: ${br((ATE + 1) * (ATE + 2) / 2)} celulas por base.`);
  console.log('  p | celulas | concordam | discordam');
  for (const p of PRIMOS) {
    const r = medir(p, ATE);
    console.log(
      `  ${String(p).padStart(2)} | ${br(r.celulas).padStart(7)} | ${br(r.concordam).padStart(9)} | ${r.discordam}`
    );
    if (r.discordam > 0) {
      console.error(`LUCAS FALHOU EM BASE PRIMA p=${p}`);
      process.exit(1);
    }
  }

  console.log('\n== Tabela 2: o mesmo com p COMPOSTO, onde o teorema nao vale ==');
  console.log('  p | celulas | concordam | discordam | erra em | primeiro erro');
  for (const p of COMPOSTOS) {
    const r = medir(p, ATE);
    const fatia = ((100 * r.discordam) / r.celulas).toFixed(2);
    const erro = r.primeiraDivergencia[0];
    const texto = erro ? `C(${erro.n},${erro.k}): Lucas ${erro.porLucas}, certo ${erro.porForca}` : '-';
    console.log(
      `  ${String(p).padStart(2)} | ${br(r.celulas).padStart(7)} | ${br(r.concordam).padStart(9)} | ${br(r.discordam).padStart(9)} | ${fatia.padStart(6)}% | ${texto}`
    );
  }

  console.log('\n== Tabela 3: Kummer contra a divisao na marra ==');
  console.log('  A maior potencia de p que divide C(n,k), pelos dois caminhos.');
  console.log('  p | celulas | concordam | discordam');
  for (const p of PRIMOS) {
    const r = medir(p, ATE);
    console.log(
      `  ${String(p).padStart(2)} | ${br(r.celulas).padStart(7)} | ${br(r.kummerConcorda).padStart(9)} | ${r.kummerDiscorda}`
    );
    if (r.kummerDiscorda > 0) {
      console.error(`KUMMER FALHOU EM p=${p}`);
      process.exit(1);
    }
  }

  console.log('\n== Tabela 4: Kummer com p composto ==');
  console.log('  p | primo? | concordam | discordam');
  for (const p of COMPOSTOS) {
    const r = medir(p, ATE);
    console.log(
      `  ${String(p).padStart(2)} | ${String(primo(p)).padStart(6)} | ${br(r.kummerConcorda).padStart(9)} | ${br(r.kummerDiscorda)}`
    );
  }

  console.log('\n== Tabela 5: quantos zeros cada base deixa no triangulo ==');
  console.log('  p | primo? | celulas | divisiveis por p | fatia');
  for (const p of [...PRIMOS, ...COMPOSTOS].sort((a, b) => a - b)) {
    const r = medir(p, ATE);
    console.log(
      `  ${String(p).padStart(2)} | ${String(primo(p)).padStart(6)} | ${br(r.celulas).padStart(7)} | ${br(r.zerosDeVerdade).padStart(16)} | ${((100 * r.zerosDeVerdade) / r.celulas).toFixed(1)}%`
    );
  }

  console.log('\n== Tabela 6: as entradas impares da linha n, por tres caminhos ==');
  console.log('  n | varrendo | pelos bits | pela formula 2^(bits 1) | batem?');
  for (const n of [0, 1, 7, 8, 15, 16, 31, 32, 63, 100, 127, 128]) {
    const a = imparesVarridos(n);
    const b = imparesPorBits(n);
    const c = imparesPorFormula(n);
    console.log(
      `  ${String(n).padStart(3)} | ${String(a).padStart(8)} | ${String(b).padStart(10)} | ${String(c).padStart(23)} | ${a === b && b === c ? 'sim' : 'NAO'}`
    );
    if (!(a === b && b === c)) process.exit(1);
  }

  console.log('\n== Tabela 7: o triangulo de Sierpinski, desenhado pelo teorema ==');
  for (let n = 0; n < 16; n++) console.log('  ' + linhaDeSierpinski(n, 33));

  console.log('\n== Fechamento ==');
  const primos = PRIMOS.map((p) => medir(p, ATE));
  const compostos = COMPOSTOS.map((p) => medir(p, ATE));
  const soma = (lista, campo) => lista.reduce((a, r) => a + r[campo], 0);
  console.log(`  celulas varridas em base prima ...... ${br(soma(primos, 'celulas'))}`);
  console.log(`  erros de Lucas em base prima ........ ${soma(primos, 'discordam')}`);
  console.log(`  celulas varridas em base composta ... ${br(soma(compostos, 'celulas'))}`);
  console.log(`  erros de Lucas em base composta ..... ${br(soma(compostos, 'discordam'))}`);
  console.log(`  erros de Kummer em base prima ....... ${soma(primos, 'kummerDiscorda')}`);
  console.log('');


  if (soma(primos, 'discordam') > 0 || soma(primos, 'kummerDiscorda') > 0) process.exit(1);
}

if (process.argv[1]?.endsWith('medidor.js')) imprimir();
