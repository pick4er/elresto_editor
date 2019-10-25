import Vue from 'vue';

export default {
  UPDATE_IS_MOBILE(state, { isMobile }) {
    Vue.set(state, 'isMobile', isMobile);
  },
};
