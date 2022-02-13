<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand :to="{name: 'Home'}">Oier Lauzirika Zarrabeitia</b-navbar-brand>

      <!-- Next options are collapsed for small screens -->
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <!-- Left aligned nav items -->
        <b-navbar-nav>
          <b-nav-item :to="{name: 'AboutMe'}">{{$t('navbar.about')}}</b-nav-item>
          <b-nav-item :to="{name: 'CurriculumVitae'}">{{$t('navbar.cv')}}</b-nav-item>
          <b-nav-item-dropdown :text="$t('navbar.projects')">
            <b-dropdown-item :to="{name: 'ProjectZuazo'}">{{$t('navbar.zuazo')}}</b-dropdown-item>
            <b-dropdown-item :to="{name: 'ProjectCenital'}">{{$t('navbar.cenital')}}</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item :to="{name: 'Contact'}">{{$t('navbar.contact')}}</b-nav-item>
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