<template>
  <div class="caption_panel">
    <a :href="href" target="_blank">{{ caption }}</a>
  </div>
</template>

<script>
import { getData } from "@/api/api";

export default {
  data() {
    return {
      caption: "",
      href: "",
    };
  },
  mounted() {
    // Получние данных для надписи
    const url = `caption/${this.$store.getters.getTypeKey}/${this.$store.getters.getSelectedId}`;
    getData(this, url).then(
      (response) => (this.caption = response.description)
    );
    this.href = `${this.$store.getters.getHostUrl}/${this.$store.getters.getSelectedId}`;
  },
};
</script>

<style>
.caption_panel {
  padding-top: 7px;
  padding-left: 7px;
  height: 45px;
}
</style>


