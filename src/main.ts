import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import { ConfirmationService } from 'primevue';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import { router } from './router/router';
import './style.css';
import App from './App.vue';
import './firebase';

const Theme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{rose.50}',
      100: '{rose.100}',
      200: '{rose.200}',
      300: '{rose.300}',
      400: '{rose.400}',
      500: '{rose.500}',
      600: '{rose.600}',
      700: '{rose.700}',
      800: '{rose.800}',
      900: '{rose.900}',
      950: '{rose.950}'
    }
  }
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
    }
  }
});
app.use(ConfirmationService);
app.mount('#app');