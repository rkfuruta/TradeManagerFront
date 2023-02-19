import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faRotate } from '@fortawesome/free-solid-svg-icons'

library.add(faRotate)

import './assets/main.css'

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(pinia);
app.use(router);
app.mount('#app');
