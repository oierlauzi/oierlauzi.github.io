<template>
  <div id="app">
    <TheNavbar/>
    <router-view/>
  </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import TheNavbar from '@/components/TheNavbar.vue'

    @Component({
      components: {
        TheNavbar,
      }
    })

    export default class App extends Vue {}

</script>