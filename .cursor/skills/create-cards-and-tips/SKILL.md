---
name: create-cards-and-tips
description: >-
  Cria cartas e dicas para o jogo Perfil (adivinhação por dicas). Use ao
  adicionar, revisar ou gerar novas cartas em src/constants/cards.ts e
  src/constants/tips.ts, ou quando o usuário pedir cartas, dicas, conteúdo do
  jogo ou expansão do baralho.
---

# Criação de cartas e dicas (Perfil)

Skill para criar conteúdo jogável: uma **carta** (resposta + categoria) e **20 dicas** em português do Brasil.

## Regras editoriais

### Idioma

- Português do Brasil, ortografia e vocabulário brasileiros.
- Frases curtas e claras; evite jargão técnico desnecessário.

### Categorias

Cada carta pertence a **exatamente uma** das quatro categorias usadas no código:

| Categoria | Subtipos aceitos |
|-----------|------------------|
| **Pessoa** | celebridade, figura histórica, personagem (ficção), profissão |
| **Lugar** | lugar famoso (real ou fictício), cidade, país, monumento, estabelecimento comum |
| **Ano** | ano com um ou mais acontecimentos famosos |
| **Coisa** | objeto, animal, tecnologia, conceito abstrato |

Escolha respostas de **conhecimento geral** no Brasil — reconhecíveis por adultos sem especialização.

### Dicas

- **20 dicas por carta**, nem mais nem menos.
- Escreva em **primeira pessoa**, como se a carta falasse:
  - Coisa/Lugar/Pessoa: *"Tenho quatro rodas"*, *"Fui construída em Paris"*, *"Nasci no século XIX"*.
  - Ano: use *"mim"* / *"em mim"* — *"A independência do Brasil foi proclamada em mim"*.
- Cada dica é um **conhecimento geral** sobre a resposta; não use metalinguagem de jogo.
- **Uma dica isolada não deve entregar a resposta.** Evite:
  - Nome completo ou óbvio da resposta.
  - Combinação de pistas que, sozinhas, identifiquem unicamente a carta (ex.: *"Sou a Torre Eiffel"*).
  - Para anos: não cite só o número; distribua fatos históricos.
- **Progressão sugerida** (sem tornar a dica 20 uma entrega direta):
  1. Dicas 1–7: contexto amplo (época, área, função, fama).
  2. Dicas 8–14: fatos específicos e memoráveis.
  3. Dicas 15–19: estreitam o campo (sem nomear a resposta).
  4. Dica 20: mais forte, mas ainda exige outras dicas para cravar — use característica marcante, não o nome.

### Dicas especiais (armadilhas)

O código substitui **3 das 20 posições** por efeitos de jogo (`Perca sua vez`, `Perca N pontos`, `Ganhe N pontos`). **Não escreva** essas armadilhas — apenas as 20 dicas de conteúdo; a atribuição é automática em `tips.ts`.

## Formato no repositório

### Carta — `src/constants/cards.ts`

```ts
{ id: 101, response: 'Carro', category: 'Coisa' },
```

- `id`: próximo inteiro após o maior `id` existente.
- `response`: texto exato que o jogador deve adivinhar (como aparece na validação).
- `category`: `'Pessoa' | 'Lugar' | 'Ano' | 'Coisa'` — literal do TypeScript.

### Dicas — `src/constants/tips.ts`

Adicione entrada em `CARD_TIPS` com a chave = `id` da carta e array de **20 strings**:

```ts
101: [
  'Tenho quatro rodas.',
  'Uso combustível para me mover.',
  // ... mais 18 dicas ...
  'Sou o veículo particular mais comum nas ruas.',
],
```

- Ordem do array = número da dica (1 a 20).
- IDs globais das dicas são gerados automaticamente: `(cardId - 1) * 20 + índice + 1`.
- Não altere `assignTrickTips` nem o export de `TIPS` ao adicionar cartas.

## Fluxo de trabalho

1. **Confirmar** categoria, subtipo e resposta; verificar se já não existe em `CARDS`.
2. **Pesquisar** fatos verificáveis (datas, nomes, lugares) — conteúdo incorreto prejudica o jogo.
3. **Redigir** 20 dicas em primeira pessoa, seguindo progressão e regra de não-entrega isolada.
4. **Revisar** cada dica individualmente: *"Só com esta dica, um jogador acertaria?"* — se sim, reescreva.
5. **Inserir** a carta em `cards.ts` e o bloco em `CARD_TIPS` em `tips.ts` (manter ordem numérica das chaves).
6. **Validar** (checklist abaixo).

## Checklist de validação

```
- [ ] Exatamente 20 strings no array de dicas
- [ ] Todas em PT-BR e primeira pessoa
- [ ] Nenhuma dica entrega a resposta sozinha
- [ ] Categoria correta e resposta de conhecimento geral
- [ ] id da carta único; chave em CARD_TIPS coincide com o id
- [ ] Sem duplicata de resposta já existente em CARDS
- [ ] Fatos históricos/geográficos conferidos
```

## Armadilhas comuns

| Erro | Correção |
|------|----------|
| Dica 20 com o nome da resposta | Característica forte sem nomear |
| Ano com dicas vagas demais | Mínimo 3–4 eventos históricos distintos daquele ano |
| Profissão genérica demais | Misture rotina, ambiente, ferramentas e impacto social |
| Conceito abstrato em terceira pessoa | *"Sou sentido por quem..."*, *"Me procuram quando..."* |
| Copiar estrutura idêntica de outra carta | Variar abertura e tipo de fato entre dicas |

## Exemplos por categoria

Ver [examples.md](examples.md) para cartas completas de referência.
