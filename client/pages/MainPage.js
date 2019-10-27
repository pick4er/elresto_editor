import parsePreciseTag from 'helpers/parsePreciseTag'
import parseMapField from 'helpers/parseMapField'

export default {
  name: 'main-page',
  computed: {
    map() {
      return this.$store.state.map
    },
    data() {
      return this.$store.state.data
    },
    isEdit() {
      return this.$store.state.isEdit
    }
  },
  methods: {
    getRenderedTags(tags, h) {
      const renderedTags = []

      for (let i = 0; i < tags.length; i += 1) {
        const { preciseTag, children = [] } = parseMapField(tags[i])
        const { commonTagName } = parsePreciseTag(preciseTag)
        const tagData = JSON.parse(JSON.stringify(this.data[preciseTag] || {}))

        const renderedChildren = this.getRenderedTags(children, h)

        if (this.isEdit) {
          renderedTags.push(h('editor-wrap', { props: { preciseTag } }, [h(commonTagName, tagData, renderedChildren)]))
        } else {
          renderedTags.push(h(commonTagName, tagData, renderedChildren))
        }
      }

      return renderedTags
    }
  },
  render(h) {
    return h(
      'div',
      [...this.getRenderedTags(this.map, h)],
    )
  }
}
