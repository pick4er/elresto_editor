<template>
  <div :class="$style.siteInput">
    <label :for="id">Введите название сайта (на латинице):</label>
    <base-input v-model="value" :id="id" />
    <base-button title="Опубликовать" />

    <hr />
    <h2>Дальше идёт редактор сайта</h2>
    <hr />
  </div>
</template>

<script>
  import BaseInput from 'client/components/BaseInput'
  import BaseButton from 'client/components/BaseButton'

  export default {
    name: 'site-input',
    components: {
      'base-input': BaseInput,
      'base-button': BaseButton,
    },
    data() {
      return {
        value: '',
        id: 'siteName'
      }
    },
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

    input
      color black
      font-size x(16)
      height x(30)
      width auto
      
    button
      margin-top x(5)
      
    hr
      width 100%

    h2
      text-align center
</style>
