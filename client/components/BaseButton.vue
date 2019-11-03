<template>
  <div :class="$style.wrap">
    <slot name="left" />
    <slot name="top" />

    <button
      v-bind="$attrs"
      :type="type" 
      :class="$style.button"
      @click="$emit('click', $event)"
    >
      {{ title }}
    </button>
    <slot name="bottom" />
    <slot name="right" />
  </div>
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
  .wrap
    position relative
    width 100%
    height 100%
    min-height x(30)
    display inline-flex

  .button
    height 100%
    min-height x(30)
    width 100%
    font-size x(16)
    font-family $robotoRegular
    border none
</style>
