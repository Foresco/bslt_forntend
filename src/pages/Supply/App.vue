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
          <TabPanel title="Заказы на поставку" v-if="checkShow('supplyorderslist')">
            <supply-orders-list></supply-orders-list>
          </TabPanel>
          <TabPanel
            title="Создать заказ на поставку"
            v-if="checkEdit('create')"
          >
            <properties-form mode="create" key="create"></properties-form>
          </TabPanel>
          <TabPanel title="Редактировать" v-if="checkShow('edit')">
            <properties-form mode="edit" key="edit"></properties-form>
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
        style="width: 20%; height1: 100%"
        v-if="checkShow('west')"
      >
        <Accordion class="f-full" :border="false">
          <AccordionPanel id="1" title="Фильтры" v-if="checkShow('filters')">
            <list-filters></list-filters>
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
        style="width: 45%"
        v-if="checkShow('east')"
      >
        <Accordion class="f-full" :border="false">
          <AccordionPanel id="1" title="Свойства" v-if="checkShow('propertiesview')">
            <properties-form-view></properties-form-view>
          </AccordionPanel>
          <AccordionPanel id="2" title="Позиции производства" v-if="checkShow('orderprodposlist')">
            <order-prod-pos-list></order-prod-pos-list>
          </AccordionPanel>
          <AccordionPanel
            id="3"
            title="Файлы"
            v-if="checkShow('objectfilessimple')"
          >
            <object-files-simple></object-files-simple>
          </AccordionPanel>
          <AccordionPanel
            id="4"
            title="История изменений"
            v-if="checkShow('historylog')"
          >
            <history-log></history-log>
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
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

// Импорт компонентов
import MenuBar from "@/components/MenuBar.vue";
import MessageBar from "@/components/MessageBar.vue";
import ListFilters from "@/components/ListFilters.vue";
import SupplyOrdersList from "@/components/SupplyOrdersList.vue";
import PropertiesForm from "@/components/PropertiesForm.vue";
import PropertiesFormView from "@/components/PropertiesFormView.vue";
import HistoryLog from "@/components/HistoryLog.vue";
import OrderProdPosList from "@/components/OrderProdPosList.vue";
import ObjectFilesSimple from "@/components/ObjectFilesSimple.vue";
import Status from "@/components/Status.vue";

export default {
  mixins: [page, editable_component],
  components: {
    ListFilters,
    SupplyOrdersList,
    MessageBar,
    PropertiesForm,
    PropertiesFormView,
    MenuBar,
    HistoryLog,
    OrderProdPosList,
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
