<template>
  <div>
    <!-- Error message -->
    <b-jumbotron
      :header="$t('not_found.title')"
      :lead="$t('not_found.message')" 
    >
      <b-button :to="{name: 'Home'}">{{$t('not_found.home_button')}}</b-button>
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
