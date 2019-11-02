
export default {
  name: 'app',
  computed: {
    isEdit() {
      return this.$store.state.isEdit
    }
  },
  render(h) {
    const renderedTags = []
    if (this.isEdit) {
      renderedTags.push(
        h('editor-site-input')
      )
    }

    renderedTags.push(h('router-view'))

    return h(
      'div',
      [...renderedTags]
    )
  },
}
