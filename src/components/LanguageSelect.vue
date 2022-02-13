<template>
  <div>
    <b-nav-item-dropdown right :text="locale.toUpperCase()">
      <b-dropdown-item v-for="loc in locales" :key="loc" :active="loc==locale" @click="switchLocale(loc)">
        {{loc.toUpperCase()}}
      </b-dropdown-item>
    </b-nav-item-dropdown>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import VueI18n from 'vue-i18n'

  @Component
  export default class LanguageSelect extends Vue {
    switchLocale(locale: VueI18n.Locale): void {
      this.$i18n.locale = locale
    }

    get locale(): VueI18n.Locale {
      return this.$i18n.locale
    }

    get locales(): VueI18n.Locale[] {
      return this.$i18n.availableLocales
    }
  }
</script>