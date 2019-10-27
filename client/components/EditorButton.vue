<template>
  <button 
    v-bind="$attrs"
    :type="type" 
    @click="$emit('click', $event)"
    :class="$style.editorButton"
  >+</button>
</template>

<script>
  export default {
    name: 'editor-button',
    props: {
      type: {
        type: String,
        default: 'button',
      },
    }
  }
</script>

<style lang="stylus" module>
  .editorButton
    position absolute
    z-index 1
</style>
