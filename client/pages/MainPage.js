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
    isSystemTag(commonTagName) {
      return commonTagName.includes('system-')
    },
    getRenderedTags(tags, h) {
      const renderedTags = []

      for (let i = 0; i < tags.length; i += 1) {
        const { preciseTag, children = [] } = parseMapField(tags[i])
        const { commonTagName } = parsePreciseTag(preciseTag)
        const tagData = JSON.parse(JSON.stringify(this.data[preciseTag] || {}))

        const renderedChildren = this.getRenderedTags(children, h)

        const isSystemTag = this.isSystemTag(commonTagName)
        if (this.isEdit && !isSystemTag) {
          renderedTags.push(
            h(
              commonTagName, 
              {
                ...tagData,
                scopedSlots: {
                  left: function (props) {
                    return h('editor-button', { props: { preciseTag, direction: 'left' } } )
                  },
                  right: function (props) {
                    return h('editor-button', { props: { preciseTag, direction: 'right' } } )
                  },
                  top: function (props) {
                    return h('editor-button', { props: { preciseTag, direction: 'top' } } )
                  },
                  bottom: function (props) {
                    return h('editor-button', { props: { preciseTag, direction: 'bottom' } } )
                  }
                }
              }, 
              renderedChildren
            ),
          )
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
