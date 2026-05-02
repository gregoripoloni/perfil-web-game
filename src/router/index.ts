import { createWebHashHistory, createRouter } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/views/StartView.vue'),
  },
  {
    path: '/game/:id',
    component: () => import('@/views/GameView.vue'),
  },
];

export const router = createRouter({
  history: createWebHashHistory('/perfil-web-game/'),
  routes,
});
