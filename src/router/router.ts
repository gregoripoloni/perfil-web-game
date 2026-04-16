import { createMemoryHistory, createRouter } from 'vue-router';
import StartView from '../views/StartView.vue';
import GameView from '../views/GameView.vue';

const routes = [
  { path: '/', component: StartView },
  { path: '/game/:id', component: GameView },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});