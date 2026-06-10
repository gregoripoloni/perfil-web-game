---
name: project-architecture
description: >-
  Estrutura e responsabilidades por camada do jogo Perfil (Vue 3 + TypeScript +
  Pinia + Firebase Realtime Database). Use ao criar ou editar arquivos em src/,
  ao decidir onde colocar lógica nova, ou ao revisar mudanças neste repositório.
---

# Arquitetura do projeto (Perfil web game)

App Vue 3 (`<script setup lang="ts">`) + Pinia + PrimeVue + Tailwind, com estado
multiplayer sincronizado via Firebase Realtime Database. Stack relevante:
`vue`, `vue-router`, `pinia`, `firebase`, `primevue`, `tailwindcss`.

Use sempre o alias `@/` para imports dentro de `src/`.

## Camadas e responsabilidades

Coloque cada tipo de código na camada correta. Não misture responsabilidades.

| Pasta | Responsabilidade | Não deve fazer |
|-------|------------------|----------------|
| `types/` | Tipos, `enum`s e constantes `DEFAULT_*` de estado | Lógica |
| `constants/` | Dados estáticos do jogo (`cards`, `tips`, `rules`) | Lógica/estado |
| `services/` | Integrações externas: `firebase.ts` (init + auth anônima) e `roomRepository.ts` (todo acesso ao Realtime DB) | Conhecer Vue/Pinia |
| `stores/` | Estado Pinia (composition API), um por fatia de domínio | Chamar Firebase ou ter regra de jogo |
| `composables/` | Lógica de negócio e orquestração | Acessar `firebase/*` direto |
| `utils/` | Funções puras e sem dependências de framework | Tocar stores/Firebase |
| `components/` | Vue SFCs de apresentação, agrupados por domínio | Acessar `roomRepository`/Firebase direto |
| `views/` | Páginas de rota | Lógica pesada (delegue a composables) |
| `router/` | Rotas (`vue-router`, hash history) | — |

## Regras-chave

1. **Todo acesso ao Firebase Realtime Database fica em `services/roomRepository.ts`.**
   Nenhum componente, store ou composable deve importar `firebase/database`.
   Métodos de escrita são `async` e usam o helper `patchRoom`.
2. **Stores são apenas contêineres de estado.** Cada store usa o padrão:
   `const state = ref({ ...DEFAULT_X })`, `mergeState(partial)` e `$reset()`.
   Crie um store novo por fatia de domínio em vez de inflar os existentes.
3. **Regra de jogo vive nos composables**, não nos componentes nem nos stores.
4. **Fluxo de dados unidirecional** (veja abaixo). Componentes leem de `useGameState`
   e disparam ações via `useGameActions`.
5. **`enum`s e tipos compartilhados** (`GamePhase`, `TipKind`, interfaces de estado)
   ficam em `types/round.ts` e `types/player.ts`. Os defaults de estado (`DEFAULT_*`)
   moram junto dos tipos.
6. **Texto voltado ao usuário em português.** Siga ESLint + Prettier do repo.

## Papéis dos composables

- `useRoomId` — lê o `id` da sala a partir da rota.
- `useRoomConnection` — assina o Firebase via `roomRepository` e espelha os dados
  nos stores; retorna `disconnect`. É o único lugar que escreve nos stores a partir do DB.
- `useGameState` — estado derivado (`computed`) lido dos stores (carta atual, dicas
  reveladas, jogador ativo, etc.).
- `useGameActions` — ações de escrita; traduz intenção do jogador em chamadas ao
  `roomRepository`.
- `useGameFlow` — orquestra fases (`GamePhase`), timers e visibilidade de diálogos.

## Fluxo de dados

```
Firebase ──(subscribe)──> useRoomConnection ──> stores (Pinia)
                                                   │
                                          useGameState (computed)
                                                   │
                                              components / views
                                                   │ (intenção do usuário)
                                            useGameActions
                                                   │
                                            roomRepository ──(write)──> Firebase
```

`useGameFlow` observa `gamePhase` dos stores e dispara ações de transição.

## Organização de componentes

`components/` é agrupado por domínio: `dialogs/`, `game/`, `messages/`. Use
`<script setup lang="ts">`, componentes PrimeVue e classes utilitárias Tailwind.
O tema PrimeVue é configurado em `main.ts`.

## Onde colocar código novo (decisão rápida)

- Nova leitura/escrita no banco → método em `roomRepository.ts`.
- Novo dado derivado do estado → `computed` em `useGameState.ts`.
- Nova ação do jogador → função em `useGameActions.ts`.
- Nova transição de fase/timer/diálogo → `useGameFlow.ts`.
- Novo cálculo puro → `utils/`.
- Novo tipo/enum/default de estado → `types/`.
- Novo dado estático do jogo → `constants/`.
- Nova UI → `components/<domínio>/` (ou `views/` se for página de rota).
