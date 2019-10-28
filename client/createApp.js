import Vue from 'vue';

import parseComponentField from 'helpers/parseComponentField'

import App from 'client/App';
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

const SiteInput = () => import(
  /* webpackChunkName: "SiteInput" */
  'client/components/SiteInput'
);

const globalComponents = {
  BaseButton,
  BaseBlock,
  EditorWrap,
  SiteInput,
}

const allComponents = [
  ['editor-wrap', 'EditorWrap'],
  ['base-button', 'BaseButton'],
  ['base-block', 'BaseBlock'],
  ['site-input', 'SiteInput'],
]

function registerComponents(components) {
  for (let i = 0; i < components.length; i += 1) {
    const { tagName, componentName } = parseComponentField(components[i])
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
