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
            title="Перечень сотрудников"
            v-if="checkShow('personslist')"
          >
            <persons-list></persons-list>
          </TabPanel>
          <TabPanel
            title="Создать"
            iconCls="icon-add"
            v-if="checkShow('create')"
          >
            <properties-form mode="create"></properties-form>
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
        <Accordion>
          <AccordionPanel id="2" title="Фильтры" v-if="checkShow('filters')">
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
        style="width: 30%"
        v-if="checkShow('east')"
      >
        <Accordion style="height: 100%">
          <AccordionPanel
            id="1"
            title="Места работы"
            v-if="checkShow('personstaffposition')"
          >
            <person-staff-positions></person-staff-positions>
          </AccordionPanel>
          <AccordionPanel
            id="2"
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
import PersonsList from "@/components/PersonsList.vue";
import PropertiesForm from "@/components/PropertiesForm.vue";
import PropertiesFormView from "@/components/PropertiesFormView.vue";
import ListFilters from "@/components/ListFilters.vue";
import PersonStaffPositions from "@/components/PersonStaffPositions.vue";
import Status from "@/components/Status.vue";

export default {
  mixins: [page],
  components: {
    MenuBar,
    MessageBar,
    PersonsList,
    PropertiesForm,
    PropertiesFormView,
    ListFilters,
    PersonStaffPositions,
    Status,
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
