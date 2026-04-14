import { createWebHistory, createRouter } from 'vue-router';
import StartView from '../views/StartView.vue';
import GameView from '../views/GameView.vue';

const routes = [
  { path: '/', component: StartView },
  { path: '/game', component: GameView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});