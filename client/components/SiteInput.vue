<template>
  <div :class="$style.siteInput">
    <label :for="id">Введите название сайта (на латинице):</label>
    <span>
      <base-input v-model="value" :id="id" />
      <base-button :title="buttonTitle" @click="onClick" />
    </span>

    <hr />
  </div>
</template>

<script>
  import api from 'api';
  import debounce from 'lodash.debounce'

  import BaseInput from 'client/components/BaseInput'
  import BaseButton from 'client/components/BaseButton'

  export default {
    name: 'site-input',
    components: {
      'base-input': BaseInput,
      'base-button': BaseButton,
    },
    mounted() {
      this.debouncedSearch = debounce(this.search, 1000);
    },
    data() {
      return {
        value: '',
        id: 'siteName',
        debouncedSearch: () => {},
      }
    },
    watch: {
      value(nextValue) {
        this.debouncedSearch(nextValue)
      }
    },
    computed: {
      buttonTitle() {
        if (this.mode === 'edit') return 'Сохранить'
        if (this.mode === 'create') return 'Опубликовать'
      },
      mode() {
        return this.$store.state.mode
      }
    },
    methods: {
      onClick() {},
      search(value) {
        this.$store.dispatch({
          type: 'GET_SITE',
          siteName: value,
        })
      },
    }
  }
</script>

<style lang="stylus" module>
  .siteInput
    display flex
    flex-flow column
    margin x(10)

    label
      font-size x(20)
      margin-bottom x(5)

    span
      display flex
      flex-flow row nowrap

      input
        flex-grow 5
        color black
        font-size x(16)
        height x(30)
        width auto
      
      button
        flex-grow 1
        margin-left x(5)
        width auto

    hr
      width 100%
</style>
