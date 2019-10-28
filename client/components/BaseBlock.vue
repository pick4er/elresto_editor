<template>
  <div :class="$style.block">
    <p>{{ index }}</p>
    <template>
      <slot />
    </template>
  </div>
</template>

<script>
  export default {
    name: 'base-block',
    props: {
      index: {
        type: [String, Number],
        required: true,
      }
    }
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
