import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const MainPage = () => import(
  /* webpackChunkName: "MainPage" */
  'client/pages/MainPage'
);

export default function createRouter() {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehaviour: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition;
      }

      return {
        x: 0,
        y: 0,
      };
    },
    routes: [
      {
        path: '*',
        component: MainPage,
        props: true,
      },
    ],
  });
}
