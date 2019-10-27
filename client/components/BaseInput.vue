<template>
  <input 
    ref="input"
    v-bind="$attrs"
    @input="$emit('input', $event.target.value)"
    :value="value"
  />
</template>

<script>
  export default {
    name: 'base-input',
    inheritAttrs: false,
    props: {
      value: {
        type: [Number, String],
        required: true,
      },
    }
  }
</script>

<style lang="stylus" module>
</style>
