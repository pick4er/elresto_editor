import Vue from 'vue';

import App from 'client/App.vue';
import createRouter from 'client/router';
import createStore from 'client/flux';

export default function createApp(initialState) {
  const store = createStore(initialState);
  const router = createRouter();

  const app = new Vue({
    store,
    router,
    render: h => h(App),
  });

  return {
    app,
    store,
    router,
  };
}
