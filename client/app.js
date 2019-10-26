import Vue from 'vue';

import App from 'client/App.vue';
import createRouter from 'client/router';
import createStore from 'client/flux';

const BaseButton = () => import(
  /* webpackChunkName: "BaseButton" */
  'client/components/BaseButton'
);

const globalComponents = {
  BaseButton,
}

function registerComponents(components) {
  for (let i = 0; i < components.length; i += 1) {
    const [tagName, componentName] = components[i]
    Vue.component(tagName, globalComponents[componentName])
  }
}

function createApp(store, router, initialState) {
  registerComponents(store.state.components)

  return new Vue({
    store,
    router,
    render: h => h(App),
  });
}

export {
  createRouter,
  createStore,
  createApp
}
