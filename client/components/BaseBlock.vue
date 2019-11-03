<template>
  <div :class="$style.block">
    <slot name="left" />
    <slot name="top" />

    <p>{{ index }}</p>
    <template>
      <slot />
    </template>

    <slot name="bottom" />
    <slot name="right" />
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
    },
  };
</script>

<style lang="stylus" module>
  .block
    position relative
    display flex
    justify-content center
    align-items center
    padding x(5)
    border x(1) solid $dark
</style>
