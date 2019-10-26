
export default {
  name: 'base-button-moscow',
  data() {
    return {
      title: 'Moscow abc',
    }
  },
  render(h) {
    return h(
      'div',
      {
        class: 'base-button-moscow',
      },
      this.title,
    )
  }
}
