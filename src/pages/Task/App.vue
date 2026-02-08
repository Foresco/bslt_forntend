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
          <TabPanel title="Задания" v-if="checkShow('tasklist')">
            <task-list></task-list>
          </TabPanel>
          <TabPanel title="Создать" v-if="checkEdit('create')">
            <properties-form mode="create" key="create"></properties-form>
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
        <Accordion class="f-full" :border="false">
          <AccordionPanel id="1" title="Фильтры">
            <task-filters></task-filters>
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
import TaskList from "@/components/TaskList.vue";
import TaskFilters from "@/components/TaskFilters.vue";
import TaskRefer from "@/components/TaskRefer.vue";
import TaskUser from "@/components/TaskUser.vue";
import PropertiesForm from "@/components/PropertiesForm.vue";
import ObjectFiles from "@/components/ObjectFiles.vue";
import Status from "@/components/Status.vue";

export default {
  mixins: [page, editable_component],
  components: {
    MenuBar,
    MessageBar,
    TaskList,
    TaskFilters,
    TaskRefer,
    TaskUser,
    PropertiesForm,
    ObjectFiles,
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
