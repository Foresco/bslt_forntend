<template>
  <div id="App">
    <Layout ref="layout" style="width: 100%; height: 100%">
      <LayoutPanel region="North" style="width: 100%; height: 32px">
        <menu-bar></menu-bar>
      </LayoutPanel>
      <LayoutPanel region="center" bodyCls="f-column" style="height: 100%">
        <search-field></search-field>
      </LayoutPanel>
      <LayoutPanel region="south" style="width: 100%; height: 22px">
        <status></status>
      </LayoutPanel>
    </Layout>
  </div>
</template>

<script>
import { page } from "@/pages/Page/mixin.js"; // Общий функционал всех страниц

// Импорт компонентов
import MenuBar from "@/components/MenuBar.vue";
import SearchField from "@/components/SearchField.vue";
import Status from "@/components/Status.vue";

export default {
  mixins: [page],
  components: {
    MenuBar,
    SearchField,
    Status,
  },
  mounted() {
    window.addEventListener("resize", this.resizeLayout, false);
    this.resizeLayout();
  },
  methods: {
    resizeLayout() {
      // Переформатирование дашборда, чтобы меню было на всю ширину (рекомендовано разработчиками Easyui)
      this.$refs.layout.updatePaddings();
    },
  },
};
</script>

<style>
html,
body,
#App {
  height: 100%;
  margin: 0;
  padding: 0;
  background: linear-gradient(45deg, #a9c6e1, #c6f7fc);
}
</style>