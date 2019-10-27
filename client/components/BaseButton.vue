<template>
  <button
    v-bind="$attrs"
    :type="type" 
    :class="$style.button"
    @click="$emit('click', $event)"
  >
    {{ title }}
  </button>
</template>

<script>
  export default {
    name: 'base-button',
    props: {
      title: {
        type: String,
        default: 'Base button',
        required: true,
      },
      type: {
        type: String,
        default: 'button',
      },
    },
  }
</script>

<style lang="stylus" module>
  .button
    flexCenter()
    display inline-flex
    height x(30)
    width 100%
    font-size x(16)
    font-family $robotoRegular
    border none
</style>
