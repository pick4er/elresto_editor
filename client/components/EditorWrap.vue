<template>
  <div 
    :class="$style.editorWrap" 
    @mouseover="onHover"
    @mouseleave="onLeave"
  >
    <editor-button :class="$style.top" v-if="isHovered" @click="onClick('top')" />
    <span>
      <editor-button :class="$style.left" v-if="isHovered" @click="onClick('left')" />

      <slot />

      <editor-button :class="$style.right" v-if="isHovered" @click="onClick('right')" />
    </span>
    <editor-button :class="$style.bottom" v-if="isHovered" @click="onClick('bottom')" />
  </div>
</template>

<script>
  import EditorButton from 'client/components/EditorButton'

  export default {
    name: 'editor-wrap',
    components: {
      'editor-button': EditorButton
    },
    data() {
      return {
        isHovered: false
      }
    },
    props: {
      preciseTag: {
        type: String,
        required: true,
      }
    },
    methods: {
      onHover() {
        this.isHovered = true
      },
      onLeave() {
        this.isHovered = false
      },
      onClick(direction) {
        this.$store.dispatch({
          type: 'ADD_BLOCK',
          direction,
          preciseTag: this.preciseTag,
        })
      }
    }
  }
</script>

<style lang="stylus" module>
  .editorWrap
    position relative
    
  .top
    left 50%
    top x(0)
    
  .right
    right x(0)
    top 50%

  .bottom
    bottom x(0)
    left 50%

  .left
    top 50%
    left x(0)
</style>
