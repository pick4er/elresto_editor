import Vue from 'vue';

import App from 'client/App.vue';
import createRouter from 'client/router';
import createStore from 'client/flux';

const BaseButtonMoscow = () => import(
  /* webpackChunkName: "BaseButtonMoscow" */
  'client/components/BaseButtonMoscow'
);

const BaseButtonLondon = () => import(
  /* webpackChunkName: "BaseButtonLondon" */
  'client/components/BaseButtonLondon'
);

const globalComponents = {
  BaseButtonLondon,
  BaseButtonMoscow,
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
