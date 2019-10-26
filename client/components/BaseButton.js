
export default {
  name: 'base-button',
  props: {
    title: {
      type: String,
      default: 'Moscow',
      required: true,
    },
  },
  render(h) {
    return h(
      'div',
      {
        class: 'base-button',
      },
      this.title,
    )
  }
}
