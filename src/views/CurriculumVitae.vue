<template>
  <div>
    <b-button class="mx-3 my-3" :href="url" variant="primary">{{ $t('cv.download') }}</b-button>
    <b-button class="mx-3 my-3" id="cv-share-popover" variant="primary">{{ $t('cv.share') }}</b-button>

    <b-popover target="cv-share-popover" triggers="hover" placement="bottom">
      <template #title>
        <b-form-input id="cv-clone-input"
                      v-on:focus="$event.target.select()" 
                      :value="absoluteUrl" 
                      readonly />
      </template>
      <b-button variant="primary" @click="copy">
        {{ $t('cv.copy') }}
      </b-button>
    </b-popover>

    <embed :src="url" type="application/pdf" style="width:100%;height:85vh;"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class CurriculumVitae extends Vue {
  copy(): void {
    let x = document.getElementById('cv-clone-input')
    if(x)
      x.focus()
    else
      alert('Could not focus')
    document.execCommand('copy')
  }

  get url(): string {
    return this.$t('cv.path').toString()
  }

  get absoluteUrl(): string {
    return new URL(this.url, document.baseURI).href
  }
}
</script>
