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
          <TabPanel title="Письма" v-if="checkShow('letterslist')">
            <letters-list></letters-list>
          </TabPanel>
          <TabPanel title="Задания" v-if="checkShow('tasklist')">
            <task-list></task-list>
          </TabPanel>
          <TabPanel title="Создать" v-if="checkShow('create')">
            <properties-form mode="create"></properties-form>
          </TabPanel>
          <TabPanel title="Редактировать" v-if="checkShow('edit')">
            <properties-form mode="edit" key="edit"></properties-form>
          </TabPanel>
          <TabPanel title="Файлы" v-if="checkShow('objectfiles')">
            <object-files></object-files>
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
          <AccordionPanel
            id="1"
            title="Фильтры"
            v-if="checkShow('taskfilters')"
          >
            <task-filters></task-filters>
          </AccordionPanel>
          <AccordionPanel
            id="2"
            title="Фильтры"
            v-if="checkShow('letterfilters')"
          >
            <letter-filters></letter-filters>
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
            id="13"
            title="Задание касается"
            v-if="checkShow('taskrefer')"
          >
            <task-refer></task-refer>
          </AccordionPanel>
          <AccordionPanel
            id="14"
            title="Исполнители"
            v-if="checkShow('taskuser')"
          >
            <task-user></task-user>
          </AccordionPanel>
          <AccordionPanel title="Свойства" v-if="checkShow('propertiesview')">
            <properties-form-view></properties-form-view>
          </AccordionPanel>
          <AccordionPanel
            title="История изменений"
            v-if="checkShow('historylog')"
          >
            <history-log></history-log>
          </AccordionPanel>
          <AccordionPanel title="Задания" v-if="checkShow('objecttasks')">
            <object-tasks></object-tasks>
          </AccordionPanel>
          <AccordionPanel
            title="Внешние системы"
            v-if="checkShow('outsidelinks')"
          >
            <outside-links></outside-links>
          </AccordionPanel>
          <AccordionPanel
            title="Дополнительные свойства"
            v-if="checkShow('propertyvalues')"
          >
            <property-values></property-values>
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
import PropertiesFormView from "@/components/PropertiesFormView.vue";
import Status from "@/components/Status.vue";
import HistoryLog from "@/components/HistoryLog.vue";
import ObjectFiles from "@/components/ObjectFiles.vue";
import OutsideLinks from "@/components/OutsideLinks.vue";
import PropertyValues from "@/components/PropertyValues.vue";

import LetterFilters from "@/components/LetterFilters.vue";
import LettersList from "@/components/LettersList.vue";
import TaskFilters from "@/components/TaskFilters.vue";
import TaskList from "@/components/TaskList.vue";
import TaskRefer from "@/components/TaskRefer.vue";
import TaskUser from "@/components/TaskUser.vue";

export default {
  mixins: [page],
  components: {
    MenuBar,
    MessageBar,
    PropertiesForm,
    PropertiesFormView,
    Status,
    HistoryLog,
    ObjectFiles,
    OutsideLinks,
    PropertyValues,
    LetterFilters,
    LettersList,
    TaskFilters,
    TaskList,
    TaskRefer,
    TaskUser,
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
