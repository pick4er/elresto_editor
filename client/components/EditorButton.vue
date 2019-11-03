<template>
  <button 
    type="button" 
    v-bind="$attrs"
    @click="onClick(direction)"
    :class="[$style.editorButton, $style[direction]]"
  >+</button>
</template>

<script>
  export default {
    name: 'editor-button',
    props: {
      preciseTag: {
        type: String,
        required: true,
      },
      direction: {
        type: String,
      }
    },
    methods: {
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
  .editorButton
    position absolute
    z-index 1
    
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
