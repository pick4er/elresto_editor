<template>
  <div :class="$style.systemGrid">
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'system-grid',
    props: {
      rows: {
        type: Number,
        required: true,
      },
      columns: {
        type: Number,
        required: true,
      }
    }
  }
</script>

<style lang="stylus" module>
  .systemGrid
    display: grid;
</style>
