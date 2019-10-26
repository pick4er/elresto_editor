import api from 'api';

export default {
  UPDATE_COLOR(context) {
    const { commit, state: { data } } = context

    const baseButton1Data = data['base-button_1']

    const nextData = {
      ...data,
      'base-button_1': {
        ...baseButton1Data,
        style: {
          color: 'orange',
        }
      }
    }

    commit({
      type: 'UPDATE_BUTTON_COLOR',
      data: nextData
    })
  }
};
