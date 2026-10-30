# O teorema de Lucas, e o que acontece quando a hipótese cai

`C(n, k) mod p` não precisa do binomial. O teorema de Lucas (1878) diz que basta
escrever `n` e `k` **na base p** e multiplicar os binomiais dos dígitos:

```
C(n, k) mod p = PRODUTO de C(n_i, k_i) mod p
```

Um número de 18 algarismos vira um punhado de contas com números menores que `p`.
O teorema exige `p` **primo** — e a parte mais interessante deste repositório é
medir o tamanho do estrago quando a hipótese não vale. Node puro, sem dependência.

## Os quatro achados

1. **Lucas acerta as 11.346 células varridas em base prima, sem um erro.** São os
   triângulos de Pascal inteiros até a linha 60, nas bases 2, 3, 5, 7, 11 e 13,
   com cada célula conferida contra o binomial exato calculado em BigInt.
2. **Com base composta, Lucas erra de 17,66% a 60,34% das células.** A base 4 é a
   que menos erra (334 de 1.891) e a base 12 a que mais (1.141 de 1.891). O erro é
   sempre do mesmo tipo: a fórmula **zera à toa**. O primeiro em base 4 é `C(4,2)`,
   onde Lucas diz 0 e a resposta é 2.
3. **Lucas zera exatamente quando Kummer acha um "vai um".** Dois teoremas
   escritos com 26 anos de distância, um sobre resto e outro sobre divisibilidade,
   concordando célula a célula nas 11.346 — e caindo juntos quando a base é
   composta.
4. **A potência de 2 em `C(2n, n)` é o número de bits 1 de n.** Daí sai que
   `C(2n, n)` nunca é ímpar, fora de `n=0`: somar `n` com `n` em binário sempre
   carrega pelo menos uma vez.

## As tabelas

Tudo abaixo sai de `node ferramentas/medidor.js`, e está preso em
`testes/medidas.test.js`. O triângulo até a linha 60 tem **1.891 células**.

### Lucas contra o binomial exato, com p primo

| p | células | concordam | discordam |
|---|---|---|---|
| 2 | 1.891 | 1.891 | 0 |
| 3 | 1.891 | 1.891 | 0 |
| 5 | 1.891 | 1.891 | 0 |
| 7 | 1.891 | 1.891 | 0 |
| 11 | 1.891 | 1.891 | 0 |
| 13 | 1.891 | 1.891 | 0 |

### O mesmo com p composto, onde o teorema não vale

| p | concordam | discordam | erra em | primeiro erro |
|---|---|---|---|---|
| 4 | 1.557 | 334 | 17,66% | `C(4,2)`: Lucas 0, certo 2 |
| 9 | 1.531 | 360 | 19,04% | `C(9,3)`: Lucas 0, certo 3 |
| 8 | 1.291 | 600 | 31,73% | `C(8,2)`: Lucas 0, certo 4 |
| 10 | 1.006 | 885 | 46,80% | `C(10,2)`: Lucas 0, certo 5 |
| 6 | 956 | 935 | 49,44% | `C(6,2)`: Lucas 0, certo 3 |
| 12 | 750 | 1.141 | 60,34% | `C(12,2)`: Lucas 0, certo 6 |

### Kummer contra a divisão na marra

A maior potência de `p` que divide `C(n,k)`, pelos dois caminhos.

| p | primo? | concordam | discordam |
|---|---|---|---|
| 2 | sim | 1.891 | 0 |
| 7 | sim | 1.891 | 0 |
| 13 | sim | 1.891 | 0 |
| 4 | não | 1.595 | 296 |
| 6 | não | 916 | 975 |
| 12 | não | 1.144 | 747 |

### Quantos zeros cada base deixa

| p | primo? | divisíveis por p | fatia |
|---|---|---|---|
| 2 | sim | 1.290 | 68,2% |
| 3 | sim | 1.180 | 62,4% |
| 5 | sim | 1.072 | 56,7% |
| 7 | sim | 991 | 52,4% |
| 8 | não | 555 | **29,3%** |
| 11 | sim | 775 | 41,0% |
| 13 | sim | 756 | 40,0% |

### As entradas ímpares da linha n, por três caminhos

| n | varrendo | pelos bits | pela fórmula 2^(bits 1) |
|---|---|---|---|
| 7 | 8 | 8 | 8 |
| 8 | 2 | 2 | 2 |
| 63 | 64 | 64 | 64 |
| 100 | 8 | 8 | 8 |
| 127 | 128 | 128 | 128 |
| 128 | 2 | 2 | 2 |

### E o Sierpinski, que é o teorema virando desenho

```
                #
               # #
              # . #
             # # # #
            # . . . #
           # # . . # #
          # . # . # . #
         # # # # # # # #
        # . . . . . . . #
       # # . . . . . . # #
      # . # . . . . . # . #
     # # # # . . . . # # # #
    # . . . # . . . # . . . #
   # # . . # # . . # # . . # #
  # . # . # . # . # . # . # . #
 # # # # # # # # # # # # # # # #
```

## O que as medidas me corrigiram

- **Escrevi um teste provando que o `double` não serve, usando `C(60,30)`. O teste
  falhou, e estava certo em falhar: `C(60,30)` passa de 2⁵³ e mesmo assim cabe
  num `double`, exato.** O primeiro binomial que o `double` erra de fato é
  `C(57,25) = 9.929.472.283.517.787`, que é **menor** que `C(60,30)` e sai por 1 a
  mais. O que decide não é o tamanho do número, é quantos fatores 2 ele tem.
- **E quase me enganei de novo olhando a impressão.** `Number(C(60,30))` aparece
  como `118264581564861420`, terminado em 20, e o valor exato termina em 24.
  Pareceu perda de precisão e não era: o JavaScript imprime o decimal **mais curto
  que identifica aquele double**, e o double ali vale exatamente 118264581564861424.
  Converter de volta para BigInt é que diz a verdade, e foi assim que o teste
  descobriu que eu estava errado.
- **Esperava que a fatia de células divisíveis caísse de forma ordenada conforme a
  base cresce. Ela não cai.** A base 8 deixa 29,3% e as bases 11 e 13, bem maiores,
  deixam 41,0% e 40,0%. Quem manda não é o tamanho da base, é o primo que está
  dentro dela: 8 é 2³, e uma potência alta de um primo pequeno é difícil de
  alcançar.

## Como está organizado

```
src/binomial.js     o binomial exato em BigInt e o triângulo somado: o juiz
src/lucas.js        o teorema, que só olha dígitos; e a regra dos bits para p=2
src/kummer.js       o terceiro caminho: a potência de p pelo número de "vai um"
src/varredura.js    o triângulo inteiro, célula por célula, pelos três caminhos
ferramentas/medidor.js  roda as varreduras e imprime as tabelas acima
testes/             114 testes
```

`src/lucas.js` **não verifica se p é primo**, de propósito. É isso que permite
medir o que acontece quando a hipótese cai, em vez de só repetir que ela é
necessária.

## Rodar

```bash
node --test testes/*.test.js   # a bateria inteira
node ferramentas/medidor.js    # recalcula todas as tabelas deste README
```

Sem `npm install`: não há dependência. Precisa de Node 18 ou mais novo.

## Licença

MIT.
