import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import { ConfirmationService } from 'primevue';
import Aura from '@primeuix/themes/aura';
import { definePreset, palette } from '@primeuix/themes';
import { router } from '@/router';
import './style.css';
import App from './App.vue';

const Theme = definePreset(Aura, {
  semantic: {
    primary: palette('{cyan}'),
  },
});

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Theme,
    options: {
      darkModeSelector: '.dark',
    },
  },
});
app.use(ConfirmationService);
app.mount('#app');
