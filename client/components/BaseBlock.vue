<template>
  <div :class="$style.block">
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'base-block',
  };
</script>

<style lang="stylus" module>
  .block
    display flex
    justify-content center
    align-items center
    padding x(10)
    border x(2) solid $red
</style>
