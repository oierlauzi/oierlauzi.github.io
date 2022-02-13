<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand>Oier Lauzirika Zarrabeitia</b-navbar-brand>

      <!-- Next options are collapsed for small screens -->
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <!-- Left aligned nav items -->
        <b-navbar-nav>
          <b-nav-item>{{$t('navbar.about')}}</b-nav-item>
          <b-nav-item>{{$t('navbar.cv')}}</b-nav-item>
          <b-nav-item-dropdown :text="$t('navbar.projects')">

          </b-nav-item-dropdown>
          <b-nav-item>{{$t('navbar.contact')}}</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <LanguageSelect/>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script lang="ts">
  import LanguageSelect from './LanguageSelect.vue'
  import { Component, Vue } from 'vue-property-decorator';

    @Component({
      components: {
        LanguageSelect,
      }
    })
  
  export default class TheNavbar extends Vue {}
</script>