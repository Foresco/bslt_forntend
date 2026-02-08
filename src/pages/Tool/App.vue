<template>
  <div id="App">
    <Layout ref="layout" style="width: 100%; height: 100%">
      <LayoutPanel region="North" style="width: 100%; height: 62px">
        <menu-bar></menu-bar>
        <message-bar></message-bar>
      </LayoutPanel>
      <LayoutPanel
        region="center"
        style="height: 580px"
        v-if="checkShow('center')"
      >
        <Tabs style="height: 100%">
          <TabPanel
            title="Классы инструмента"
            v-if="checkShow('toolclasseslist')"
          >
            <tool-classes-list></tool-classes-list>
          </TabPanel>
        </Tabs>
      </LayoutPanel>
      <LayoutPanel
        region="west"
        title="Отбор"
        :collapsible="true"
        :expander="true"
        :split="true"
        style="width: 20%; height: 100%"
        v-if="checkShow('west')"
      >
        <Accordion>
          <AccordionPanel id="2" title="Фильтры" v-if="checkShow('filters')">
            <list-filters></list-filters>
          </AccordionPanel>
          <AccordionPanel
            id="3"
            title="Дерево классов инструмента"
            v-if="checkShow('toolclassestree')"
          >
            <tool-class-tree></tool-class-tree>
          </AccordionPanel>
        </Accordion>
      </LayoutPanel>
      <LayoutPanel
        region="east"
        title="Дополнительно"
        :collapsible="true"
        :expander="true"
        :split="true"
        style="width: 25%; height: 550px"
        v-if="checkShow('east')"
      >
        <Accordion style="height: 100%">
          <AccordionPanel
            id="1"
            title="Свойства"
            v-if="checkShow('propertiesview')"
          >
            <properties-form-view></properties-form-view>
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
import ListFilters from "@/components/ListFilters.vue";
import ToolClassesList from "@/components/ToolClassesList.vue";
import ToolClassTree from "@/components/ToolClassTree.vue";
import Status from "@/components/Status.vue";
import PropertiesFormView from "@/components/PropertiesFormView.vue";

// Экспорт панелей в приложение
export default {
  mixins: [page],
  components: {
    MenuBar,
    MessageBar,
    ListFilters,
    ToolClassTree,
    ToolClassesList,
    PropertiesView,
    Status
  },
  mounted() {
    window.addEventListener("resize", this.resizeLayout, false);
  },
  methods: {
    resizeLayout() {
      // Переформатирование дашборда, чтобы меню было на всю ширину (рекомендовано разработчиками Easyui)
      this.$refs.layout.updatePaddings();
    },
  },
};
</script>
