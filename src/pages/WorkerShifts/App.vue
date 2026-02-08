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
            title="Отработанные смены"
            v-if="checkShow('workershiftlist')"
          >
            <worker-shift-list></worker-shift-list>
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
          <AccordionPanel
            id="1"
            title="Фильтры"
            v-if="checkShow('workershiftfilters')"
          >
            <worker-shift-filters></worker-shift-filters>
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
        style="width: 550px"
      >
        <Accordion class="f-full" :border="false">
          <AccordionPanel
            id="41"
            title="Иллюстрация"
            v-if="checkShow('picturepanel')"
          >
            <picture-panel></picture-panel>
          </AccordionPanel>
          <AccordionPanel
            id="1"
            title="Все отчеты по позиции"
            v-if="checkShow('prodorderposreports')"
          >
            <prod-order-pos-reports :show_extra="true"></prod-order-pos-reports>
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
import WorkerShiftFilters from "@/components/WorkerShiftFilters.vue";
import WorkerShiftList from "@/components/WorkerShiftList.vue";
import Status from "@/components/Status.vue";
import PicturePanel from "@/components/PicturePanel.vue";

import ProdOrderPosReports from "@/components/ProdOrderPosReports.vue";

export default {
  mixins: [page, editable_component],
  components: {
    MenuBar,
    MessageBar,
    WorkerShiftList,
    WorkerShiftFilters,
    ProdOrderPosReports,
    Status,
    PicturePanel,
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
