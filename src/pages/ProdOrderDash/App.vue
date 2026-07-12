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
          <TabPanel title="Заказы в работе" v-if="checkShow('prodorderinworklist')">
            <prod-order-in-work-list></prod-order-in-work-list>
          </TabPanel>
          <TabPanel title="Материалы в заказах" v-if="checkShow('prodordermaterlist')">
            <prod-order-maters-list></prod-order-maters-list>
          </TabPanel>
          <TabPanel title="Поставки материалов" v-if="checkShow('supplymaterslist')">
            <supply-maters-list></supply-maters-list>
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
        <Accordion
          class="f-full"
          :border="false"
        >
          <AccordionPanel id="10" title="Фильтры">
            <list-filters></list-filters>
          </AccordionPanel>
          <AccordionPanel id="20" title="Комментарии" v-if="checkShow('objectcomments')">
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
          <AccordionPanel id="2" title="Свойства позиции" v-if="checkShow('prodorderposition')">
            <prod-order-position></prod-order-position>
          </AccordionPanel>
          <AccordionPanel id="3" title="Операции" v-if="checkShow('prodorderposoperations')">
            <prod-order-pos-operations></prod-order-pos-operations>
          </AccordionPanel>
          <AccordionPanel id="4" title="Отчеты работников" v-if="checkShow('prodorderposreports')">
            <prod-order-pos-reports></prod-order-pos-reports>
          </AccordionPanel>
          <AccordionPanel id="5" title="Отгрузки" v-if="checkShow('prodorderposshipments')">
            <prod-order-pos-shipments></prod-order-pos-shipments>
          </AccordionPanel>
          <AccordionPanel id="6" title="Входит в" v-if="checkShow('staffinto')">
            <staff-into></staff-into>
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
import ProdOrderInWorkList from "@/components/ProdOrderInWorkList.vue";
import ProdOrderMatersList from "@/components/ProdOrderMatersList.vue";
import SupplyMatersList from "@/components/SupplyMatersList.vue";
import ListFilters from "@/components/ListFilters.vue";
import ObjectComments from "@/components/ObjectComments.vue";
import ProdOrderPosition from "@/components/ProdOrderPosition.vue";
import ProdOrderPosOperations from "@/components/ProdOrderPosOperations.vue";
import ProdOrderPosReports from "@/components/ProdOrderPosReports.vue";
import ProdOrderPosShipments from "@/components/ProdOrderPosShipments.vue";
import StaffInto from "@/components/StaffInto.vue";
import Status from "@/components/Status.vue";

export default {
  mixins: [page],
  components: {
    MenuBar,
    MessageBar,
    ProdOrderInWorkList,
    ProdOrderMatersList,
    SupplyMatersList,
    ListFilters,
    ObjectComments,
    ProdOrderPosOperations,
    ProdOrderPosReports,
    ProdOrderPosition,
    ProdOrderPosShipments,
    StaffInto,
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
