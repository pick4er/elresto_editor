<template>
  <div>
    <site-input v-if="isEdit" />
    <router-view />
  </div>
</template>

<script>
  import SiteInput from 'client/components/SiteInput'

  export default {
    name: 'App',
    components: {
      'site-input': SiteInput,
    },
    computed: {
      isEdit() {
        return this.$store.state.isEdit
      }
    }
  }
</script>

<style lang="stylus" module>
</style>
