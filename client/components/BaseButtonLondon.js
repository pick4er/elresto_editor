
export default {
  name: 'base-button-london',
  data() {
    return {
      title: 'London',
    }
  },
  render(h) {
    return h(
      'div',
      {
        class: 'base-button-london',
      },
      this.title,
    )
  }
}
