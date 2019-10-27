import Vue from 'vue';

export default {
  UPDATE_IS_MOBILE(state, { isMobile }) {
    Vue.set(state, 'isMobile', isMobile);
  },
  UPDATE_SITE(state, { map, data, components }) {
    Vue.set(state, 'map', map)
    Vue.set(state, 'data', data)
    Vue.set(state, 'components', components)
  },
  UPDATE_COMPONENTS(state, { components }) {
    Vue.set(state, 'components', components)
  },
  UPDATE_DATA(state, { data }) {
    Vue.set(state, 'data', data)
  },
  UPDATE_MAP(state, { map }) {
    Vue.set(state, 'map', map)
  },
  UPDATE_IS_EDIT_MODE(state, { isEdit }) {
    Vue.set(state, 'isEdit', isEdit)
  },
  UPDATE_MODE(state, { mode }) {
    Vue.set(state, 'mode', mode)
  },
};
