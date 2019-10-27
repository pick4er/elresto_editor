import Vue from 'vue';
import Vuex from 'vuex';

import actions from 'client/flux/actions';
import getters from 'client/flux/getters';
import mutations from 'client/flux/mutations';

Vue.use(Vuex);

export default function createStore(initialState = {}) {
  return new Vuex.Store({
    state: () => ({
      isMobile: false,
      data: {},
      map: [],
      components: [],
      isEdit: null,
      mode: 'create',
      ...initialState
    }),
    actions,
    getters,
    mutations,
  });
}