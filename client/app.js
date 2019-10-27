import Vue from 'vue';

import App from 'client/App.vue';
import createRouter from 'client/router';
import createStore from 'client/flux';

const BaseButton = () => import(
  /* webpackChunkName: "BaseButton" */
  'client/components/BaseButton'
);

const BaseBlock = () => import(
  /* webpackChunkName: "BaseBlock" */
  'client/components/BaseBlock'
);

const EditorWrap = () => import(
  /* webpackChunkName: "EditorWrap" */
  'client/components/EditorWrap'
);

const globalComponents = {
  BaseButton,
  BaseBlock,
  EditorWrap,
}

const allComponents = [
  ['editor-wrap', 'EditorWrap'],
  ['base-button', 'BaseButton'],
  ['base-block', 'BaseBlock'],
]

function registerComponents(components) {
  for (let i = 0; i < components.length; i += 1) {
    const [tagName, componentName] = components[i]
    Vue.component(tagName, globalComponents[componentName])
  }
}

function createApp(store, router, initialState) {
  if (store.state.isEdit) {
    registerComponents(allComponents)
  } else {
    registerComponents(store.state.components)
  }

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
