<template>
  <div id="app">
    <TheNavbar/>
    <router-view/>
  </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import TheNavbar from '@/components/TheNavbar.vue'

    @Component({
      components: {
        TheNavbar,
      }
    })

    export default class App extends Vue {
      created(): void {
        this.updateMeta()
      }

      @Watch('$route')
      onRouteChanged(): void {
        this.updateMeta()
      }

      @Watch('$i18n.locale')
      onLocaleChanged(): void {
        this.updateMeta()
      }

      updateMeta(): void {
        this.updateTitle()
      }

      updateTitle(): void {
        let result = 'Oier Lauzirika Zarrabeitia'

        if(this.$route?.meta?.title) {
          result += " | " + this.$t('routes.' + this.$route.meta.title)
        }

        document.title = result
      }
    }

</script>