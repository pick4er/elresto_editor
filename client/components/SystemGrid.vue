<template>
  <div :class="$style.systemGrid">
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'system-grid',
  }
</script>

<style lang="stylus" module>
  .systemGrid
    display: grid;
    grid-template-rows: min-content;
    grid-template-columns min-content
</style>
