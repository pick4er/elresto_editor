import { createApp, createStore, createRouter } from 'client/app';

import 'client/styles/app.styl';

const router = createRouter()
const store = createStore()
let app;

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
  app = createApp(store, router)
}

router.onReady(() => {
  app.$mount('#app');
}, console.error);
