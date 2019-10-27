<template>
  <div>
    {{ title }}
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
    },
  }
</script>

<style lang="stylus" module>
</style>
