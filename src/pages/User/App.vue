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
          <TabPanel title="Перечень пользователей" v-if="checkShow('userlist')">
            <user-list></user-list>
          </TabPanel>
          <TabPanel
            title="Зарегистрировать пользователя"
            iconCls="icon-add"
            v-if="checkEdit('createuser')"
          >
            <properties-form
              mode="create"
              :form_fields="user_fields"
              :create_right="'createuser'"
            ></properties-form>
          </TabPanel>
          <TabPanel
            title="Профили пользователей"
            v-if="checkShow('profilelist')"
          >
            <profile-list></profile-list>
          </TabPanel>
          <TabPanel title="Группы контроля" v-if="checkShow('downloadcheckgroupslist')">
            <download-check-groups-list ></download-check-groups-list>
          </TabPanel>
          <TabPanel title="Создать" v-if="checkEdit('create')">
            <properties-form mode="create" key="create"></properties-form>
          </TabPanel>
          <TabPanel title="Редактировать" v-if="checkShow('edit')">
            <properties-form mode="edit" key="edit"></properties-form>
          </TabPanel>
          <TabPanel title="Лог действий" v-if="checkShow('userlog')">
            <user-log></user-log>
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
        style="width: 30%"
        v-if="checkShow('east')"
      >
        <Accordion class="f-full" :border="false">
          <AccordionPanel id="1" title="Свойства" v-if="checkShow('propertiesview')">
            <properties-form-view></properties-form-view>
          </AccordionPanel>
          <AccordionPanel id="2" title="Группы пользователей" v-if="checkShow('usergroup')">
            <user-group></user-group>
          </AccordionPanel>
          <AccordionPanel id="3" title="Активность пользователя" v-if="checkShow('useractivity')">
            <user-activity></user-activity>
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
import UserList from "@/components/UserList.vue";
import ListFilters from "@/components/ListFilters.vue";
import ProfileList from "@/components/ProfileList.vue";
import UserGroup from "@/components/UserGroup.vue";
import UserActivity from "@/components/UserActivity.vue";
import PropertiesForm from "@/components/PropertiesForm.vue";
import PropertiesFormView from "@/components/PropertiesFormView.vue";
import HistoryLog from "@/components/HistoryLog.vue";
import DownloadCheckGroupsList from "@/components/DownloadCheckGroupsList.vue";
import UserLog from "@/components/UserLog.vue";
import Status from "@/components/Status.vue";

export default {
  data() {
    return {
      user_fields: [
        { name: "username", label: "Логин", type: "TextBox" },
        { name: "password", label: "Пароль", type: "PasswordBox" },
        { name: "password_chk", label: "Пароль повторно", type: "PasswordBox" },
        { name: "first_name", label: "Имя", type: "TextBox" },
        { name: "last_name", label: "Фамилия", type: "TextBox" },
      ], // Перечень полей для грида-свойств
    };
  },
  mixins: [page, editable_component],
  components: {
    UserList,
    ProfileList,
    ListFilters,
    MessageBar,
    PropertiesForm,
    PropertiesFormView,
    MenuBar,
    UserGroup,
    UserActivity,
    HistoryLog,
    DownloadCheckGroupsList,
    UserLog,
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
