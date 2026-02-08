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
          <TabPanel
            title="Договоры ВП"
            v-if="checkShow('prodordercontractlist')"
          >
            <prod-order-contract-list></prod-order-contract-list>
          </TabPanel>
        </Tabs>
      </LayoutPanel>
      <LayoutPanel
        region="west"
        title="Отбор"
        bodyCls="f-column"
        :collapsible="true"
        :expander="true"
        :split="true"
        style="width: 230px; height1: 100%"
        v-if="checkShow('west')"
      >
        <Accordion class="f-full" :border="false">
          <AccordionPanel id="1" title="Фильтры">
            <list-filters></list-filters>
          </AccordionPanel>
          <AccordionPanel
            id="2"
            title="Комментарии"
            v-if="checkShow('objectcomments')"
          >
            <object-comments></object-comments>
          </AccordionPanel>
        </Accordion>
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
            id="1"
            title="Свойства"
            v-if="
              checkShow('propertiesview') &&
              this.$store.getters.getTypeKey == 'prodorder'
            "
          >
            <properties-form-view></properties-form-view>
          </AccordionPanel>
          <AccordionPanel
            id="2"
            title="Свойства позиции"
            v-if="
              checkShow('prodorderposition') &&
              this.$store.getters.getTypeKey == 'prodorderposition'
            "
          >
            <prod-order-position></prod-order-position>
          </AccordionPanel>
        </Accordion>
      </LayoutPanel>
      <LayoutPanel region="south">
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
import ProdOrderContractList from "@/components/ProdOrderContractList.vue";
import ListFilters from "@/components/ListFilters.vue";
import ObjectComments from "@/components/ObjectComments.vue";
import PropertiesFormView from "@/components/PropertiesFormView.vue";
import ProdOrderPosition from "@/components/ProdOrderPosition.vue";
import Status from "@/components/Status.vue";

export default {
  mixins: [page],
  components: {
    MenuBar,
    MessageBar,
    ProdOrderContractList,
    ListFilters,
    ObjectComments,
    PropertiesFormView,
    ProdOrderPosition,
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
