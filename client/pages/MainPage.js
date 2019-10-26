import parsePreciseTag from 'helpers/parsePreciseTag'
import parseMapField from 'helpers/parseMapField'

export default {
  name: 'main-page',
  mounted() {
    setTimeout(() => {
      this.$store.dispatch({
        type: 'UPDATE_COLOR'
      })
    }, 3000)
  },
  computed: {
    map() {
      return this.$store.state.map
    },
    data() {
      return this.$store.state.data
    },
    tags() {
      const tags = []

      for (let i = 0; i < this.map.length; i += 1) {
        const { preciseTag } = parseMapField(this.map[i])
        const { commonTagName } = parsePreciseTag(preciseTag)
        const tagData = this.data[preciseTag]

        tags.push([commonTagName, tagData])
      }

      return tags
    },
  },
  methods: {
    getRenderedTags(h) {
      const renderedTags = []

      for (let i = 0; i < this.tags.length; i += 1) {
        const tagName = this.tags[i][0]
        const tagData = JSON.parse(JSON.stringify(this.tags[i][1]))
        renderedTags.push(h(tagName, tagData))
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
