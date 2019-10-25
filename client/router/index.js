import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const CatalogPage = () => import(
  /* webpackChunkName: "CatalogPage" */
  'client/pages/CatalogPage'
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
        component: CatalogPage,
        props: true,
      },
    ],
  });
}
