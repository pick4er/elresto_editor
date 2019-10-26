import parsePreciseTag from 'helpers/parsePreciseTag'
import parseMapField from 'helpers/parseMapField'

export default {
  name: 'main-page',
  computed: {
    map() {
      return this.$store.state.map
    },
    tags() {
      const tags = []

      for (let i = 0; i < this.map.length; i += 1) {
        const { preciseTag } = parseMapField(this.map[i])
        const { commonTagName } = parsePreciseTag(preciseTag)
        tags.push(commonTagName)
      }

      return tags
    },
  },
  methods: {
    getRenderedTags(h) {
      const renderedTags = []

      for (let i = 0; i < this.tags.length; i += 1) {
        const tagName = this.tags[i]
        renderedTags.push(h(tagName))
      }

      return renderedTags
    }
  },
  render(h) {
    return h(
      'div',
      [...this.getRenderedTags(h)],
    )
  }
}
