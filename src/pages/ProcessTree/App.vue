<template>
  <div id="App">
    <Layout ref="layout" style="width: 100%; height: 100%">
      <LayoutPanel region="north" style="width: 100%; height: 62px">
        <menu-bar></menu-bar>
        <message-bar></message-bar>
      </LayoutPanel>
      <LayoutPanel region="center" bodyCls="f-column" style="height: 100%">
        <caption-panel></caption-panel>
        <Tabs class="f-full" :border="false">
          <TabPanel title="Процесс изготовления">
            <process-tree></process-tree>
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
        style="width: 40%"
      >
        <Accordion class="f-full" :border="false">
          <AccordionPanel id="1" title="Свойства"  v-if="this.$store.getters.getTypeKey != 'tpresource'">
            <properties-form mode="edit"></properties-form>
          </AccordionPanel>
          <AccordionPanel id="3" title="Нормы в техпроцессах" v-if="this.$store.getters.getTypeKey=='tpresource'">
            <resource-norms></resource-norms>
          </AccordionPanel>
          <AccordionPanel id="2" title="Свойства" v-if="this.$store.getters.getTypeKey=='tpresource'">
            <resources mode="edit"></resources>
          </AccordionPanel>
          <AccordionPanel id="4" title="Подразделения" v-if="this.$store.getters.getTypeKey=='route'">
            <places></places>
          </AccordionPanel>
          <AccordionPanel id="5" title="Операции" v-if="this.$store.getters.getTypeKey=='routepoint'">
            <operations></operations>
          </AccordionPanel>
          <AccordionPanel id="6" title="Ресурсы" v-if="['tprow', 'tpresource'].includes(this.$store.getters.getTypeKey)">
            <resources></resources>
          </AccordionPanel>
          <AccordionPanel id="7" title="Сервис" v-if="this.$store.getters.getTypeKey=='route'">
            <service-route></service-route>
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
import ProcessTree from "@/components/ProcessTree.vue";
import PropertiesForm from "@/components/PropertiesForm.vue";
import Places from "@/components/Places.vue";
import Operations from "@/components/Operations.vue";
import Resources from "@/components/Resources.vue";
import ServiceRoute from "@/components/ServiceRoute.vue";
import ResourceNorms from "@/components/ResourceNorms.vue";
import CaptionPanel from "@/components/CaptionPanel.vue";
import Status from "@/components/Status.vue";

export default {
  mixins: [page, editable_component],
  components: {
    MenuBar,
    MessageBar,
    ProcessTree,
    PropertiesForm,
    Places,
    Operations,
    Resources,
    ServiceRoute,
    ResourceNorms,
    CaptionPanel,
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
