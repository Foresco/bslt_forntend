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
        <Tabs class="f-full" :border="false" @tabSelect="reloadTab($event)">
          <TabPanel
            title="Полученные задания"
            v-if="checkShow('workertasklist')"
            ref="tabb1"
          >
            <worker-task-list></worker-task-list>
          </TabPanel>
          <TabPanel
            title="Все операции в заказах"
            v-if="checkShow('positionsoperationslist')"
            ref="tabb2"
          >
            <positions-operations-list></positions-operations-list>
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
        </Accordion>
      </LayoutPanel>
      <LayoutPanel
        region="east"
        title="Дополнительно"
        bodyCls="f-column"
        :collapsible="true"
        :expander="true"
        :split="true"
        style="width: 700px"
      >
        <Accordion class="f-full" :border="false">
          <AccordionPanel id="1" title="Отчеты">
            <prod-order-pos-report></prod-order-pos-report>
          </AccordionPanel>
          <AccordionPanel
            id="2"
            title="Свойства"
            v-if="checkShow('propertiesview')"
          >
            <properties-form-view></properties-form-view>
          </AccordionPanel>
          <AccordionPanel
            id="3"
            title="Иллюстрация"
            v-if="checkShow('picturepanel')"
          >
            <picture-panel></picture-panel>
          </AccordionPanel>
          <AccordionPanel
            id="4"
            title="Готовность операции"
            v-if="checkShow('prodorderpostprow')"
          >
            <prod-order-pos-tp-row></prod-order-pos-tp-row>
          </AccordionPanel>
          <AccordionPanel
            id="5"
            title="Файлы"
            v-if="checkShow('objectfilessimple')"
          >
            <object-files-simple></object-files-simple>
          </AccordionPanel>
          <AccordionPanel id="6" title="Отгрузки" v-if="checkShow('prodorderposshipments')">
            <prod-order-pos-shipments></prod-order-pos-shipments>
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
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

// Импорт компонентов
import MenuBar from "@/components/MenuBar.vue";
import MessageBar from "@/components/MessageBar.vue";
import WorkerTaskList from "@/components/WorkerTaskList.vue";
import PositionsOperationsList from "@/components/PositionsOperationsList.vue";
import ListFilters from "@/components/ListFilters.vue";
import ProdOrderPosReport from "@/components/ProdOrderPosReport.vue";
import PropertiesFormView from "@/components/PropertiesFormView.vue";
import PicturePanel from "@/components/PicturePanel.vue";
import ProdOrderPosTpRow from "@/components/ProdOrderPosTpRow.vue";
import ObjectFilesSimple from "@/components/ObjectFilesSimple.vue";
import ProdOrderPosShipments from "@/components/ProdOrderPosShipments.vue";
import Status from "@/components/Status.vue";

export default {
  mixins: [page, editable_component],
  components: {
    MenuBar,
    MessageBar,
    WorkerTaskList,
    PositionsOperationsList,
    ListFilters,
    ProdOrderPosReport,
    PropertiesFormView,
    PicturePanel,
    ProdOrderPosTpRow,
    ObjectFilesSimple,
    ProdOrderPosShipments,
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
    reloadTab: function (tab) {
      // Очистка выбранных параметров, чтобы не было путаницы
      this.$store.commit("setSelectedId", null);
      this.$store.commit("setLinkId", null);
      this.$store.commit("setRowId", null);
      this.$store.commit("setOperationId", null);
      this.$store.commit("setTypeKey", null);
      this.$store.commit("setSubTypeKey", null);
      this.$store.commit("setPictureObjectId", null);
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
