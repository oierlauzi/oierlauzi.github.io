<template>
  <div>
    <embed :src="url" type="application/pdf" style="width:100%;height:100vh;"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class CurriculumVitae extends Vue {
  get url(): string {
    return this.$t('cv.path').toString()
  }
}
</script>
