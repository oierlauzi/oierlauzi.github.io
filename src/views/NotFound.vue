<template>
  <div>
    <!-- Error message -->
    <b-jumbotron
      :header="$t('404.title')"
      :lead="$t('404.message')" 
    >
      <b-button :to="{name: 'Home'}">{{$t('404.home_button')}}</b-button>
    </b-jumbotron>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class NotFound extends Vue {}
</script>
