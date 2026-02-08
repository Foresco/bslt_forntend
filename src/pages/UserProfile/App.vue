<template>
  <div id="App">
    <Layout style="width: 100%; height: 100%">
      <LayoutPanel region="North" style="width: 100%; height: 58px">
        <menu-bar></menu-bar>
        <message-bar></message-bar>
      </LayoutPanel>
      <LayoutPanel region="center" style="height: 580px">
        <Tabs style="height: 100%">
          <TabPanel title="Перечень профилей пользователей">
            <profile-list></profile-list>
          </TabPanel>
          <TabPanel title="Создать профиль" iconCls="icon-add">
            <properties-form mode="create" ></properties-form>
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
          <AccordionPanel id="2" title="Фильтры">
            <list-filters></list-filters>
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
          <AccordionPanel id="1" title="Свойства">
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
import { page } from "@/pages/Page/mixin.js";  // Общий функционал всех страниц

// Импорт компонентов
import MenuBar from "@/components/MenuBar.vue";
import MessageBar from "@/components/MessageBar.vue";
import ProfileList from "@/components/ProfileList.vue";
import PropertiesForm from "@/components/PropertiesForm.vue";
import PropertiesFormView from "@/components/PropertiesFormView.vue";
import ListFilters from "@/components/ListFilters.vue";
import Status from "@/components/Status.vue";

export default {
  mixins: [page],
  components: {
    MenuBar,
    MessageBar,
    ProfileList,
    PropertiesForm,
    PropertiesFormView,
    ListFilters,
    Status,
  },
};
</script>
