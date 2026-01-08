import { createApp } from 'vue'
import './style';
import App from './App.vue'
import router from './router/index';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';


import { createPinia } from 'pinia';
import 'primeicons/primeicons.css';

const app = createApp(App);
const pinia = createPinia();

app.use(ToastService);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: false,
            cssLayer: {
                // name: 'primevue',
                order: 'tailwind-base, primevue, tailwind-utilities'
            }
        }
    }
});
app.use(router);
app.use(pinia);
app.use(ConfirmationService);

app.mount('#app')
