<template>
  <div :class="$style.grid">
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'base-grid',
  }
</script>

<style lang="stylus" module>
  .grid
    display: grid;
    grid-template-columns: min-content;
    grid-template-rows: min-content;
</style>
