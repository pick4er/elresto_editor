import api from 'api';

export default {
  async GET_SITE(context, { siteName }) {
    const { commit } = context

    const url = `site?name=${siteName}`
    const { data, components, map, status } = await api(url)

    if (status !== 'ok') {
      commit({
        type: 'UPDATE_MODE',
        mode: 'create',
      })
      commit({
        type: 'UPDATE_SITE',
        map: [],
        data: {},
        components: [],
      })

      return
    }

    commit({
      type: 'UPDATE_MODE',
      mode: 'edit',
    })
    commit({
      type: 'UPDATE_SITE',
      map,
      data,
      components,
    })
  }
};
