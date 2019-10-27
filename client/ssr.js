import { createApp, createStore, createRouter } from 'client/app';

export default context => new Promise((resolve, reject) => {
  const initialState = { 
    isMobile: context.isMobile, 
    data: context.data, 
    map: context.map,
    components: context.components,
    isEdit: context.isEdit,
  };

  const router = createRouter()
  const store = createStore(initialState)
  const app = createApp(store, router, initialState)

  router.push(context.url);
  router.onReady(() => {
    context.rendered = () => {
      context.state = store.state;
    };

    const matchedComponents = router.getMatchedComponents();

    if (matchedComponents.length === 0) {
      return reject({ status: 404 });
    }

    resolve(app);
  }, reject);
});
