<template>
  <div id="App">
    <Layout ref="layout" style="width: 100%; height: 100%">
      <LayoutPanel region="north" style="width: 100%; height: 62px">
        <menu-bar></menu-bar>
        <message-bar></message-bar>
      </LayoutPanel>
      <LayoutPanel
        region="center"
        bodyCls="f-column"
        style="height: 100%"
        v-if="checkShow('center')"
      >
        <Tabs class="f-full" :border="false">
          <TabPanel title="Редактировать" v-if="checkShow('edit')">
            <properties-form mode="edit"></properties-form>
          </TabPanel>
          <TabPanel title="Состав заказа" v-if="checkShow('prodordertree')">
            <prod-order-tree></prod-order-tree>
          </TabPanel>
        </Tabs>
      </LayoutPanel>
      <LayoutPanel
        region="east"
        title="Дополнительно"
        bodyCls="f-column"
        :collapsible="true"
        :expander="true"
        :split="true"
        style="width: 30%"
        v-if="checkShow('east')"
      >
        <Accordion class="f-full" :border="false">
          <AccordionPanel
            id="3"
            title="Исполнители"
            v-if="checkShow('prodorderposassign')"
          >
            <prod-order-pos-assign></prod-order-pos-assign>
          </AccordionPanel>
          <AccordionPanel
            id="41"
            title="Иллюстрация"
            v-if="checkShow('picturepanel')"
          >
            <picture-panel></picture-panel>
          </AccordionPanel>
          <AccordionPanel
            id="71"
            title="Файлы"
            v-if="checkShow('objectfilessimple')"
          >
            <object-files-simple></object-files-simple>
          </AccordionPanel>
        </Accordion>
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
import MessageBar from "@/components/MessageBar.vue";
import PropertiesForm from "@/components/PropertiesForm.vue";
import ProdOrderTree from "@/components/ProdOrderTree.vue";
import ProdOrderPosAssign from "@/components/ProdOrderPosAssign.vue";
import PicturePanel from "@/components/PicturePanel.vue";
import ObjectFilesSimple from "@/components/ObjectFilesSimple.vue";
import Status from "@/components/Status.vue";

export default {
  mixins: [page],
  components: {
    MenuBar,
    MessageBar,
    ProdOrderTree,
    ProdOrderPosAssign,
    PropertiesForm,
    PicturePanel,
    ObjectFilesSimple,
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