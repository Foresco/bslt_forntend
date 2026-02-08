<template>
  <div id="App">
    <Layout style="width: 100%; height: 100%">
      <LayoutPanel region="North" style="width: 100%; height: 32px">
        <menu-bar></menu-bar>
      </LayoutPanel>
      <LayoutPanel region="center" style="height: 580px">
        <Tabs style="height: 100%">
          <TabPanel title="Дерево состава">
            <staff-tree></staff-tree>
          </TabPanel>
        </Tabs>
      </LayoutPanel>
      <LayoutPanel
        region="east"
        title="Дополнительно"
        :collapsible="true"
        :expander="true"
        :split="true"
        style="width: 20%; height: 550px"
      >
        <Accordion style="height: 100%">
          <AccordionPanel id="1" title="Свойства">
            <properties-form-view></properties-form-view>
          </AccordionPanel>
          <AccordionPanel id="2" title="Входит в">
            <staff-into></staff-into>
          </AccordionPanel>
          <AccordionPanel id="3" title="Извещения">
            <notices></notices>
          </AccordionPanel>
          <AccordionPanel id="4" title="Роли разработчиков">
            <design-roles></design-roles>
          </AccordionPanel>
        </Accordion>
      </LayoutPanel>
    </Layout>
  </div>
</template>

<script>
// Импорт компонентов
import MenuBar from "@/components/MenuBar.vue";
import StaffTree from "@/components/StaffTree.vue";
import PropertiesFormView from "@/components/PropertiesFormView.vue";
import StaffInto from "@/components/StaffInto.vue";
import Notices from "@/components/Notices.vue";
import DesignRoles from "@/components/DesignRoles.vue";

export default {
  methods: {
    fillStore: function () {
      // Перенос в хранилище уникальных значений, переданных для данной страницы
      // Передаются только значения, которые были заданы
      if (typeof selected_id != "undefined")
        this.$store.commit("setSelectedId", selected_id);
      this.$store.commit("setTypeKey", "user");
    },
  },
  created() {
    // Именно created, чтобы в дочерних компонентах
    // в mounted считать значения из хранилища
    this.fillStore(); // Установка значений в хранилище
  },
  components: {
    MenuBar,
    StaffTree,
    PropertiesFormView,
    StaffInto,
    Notices,
    DesignRoles,
  },
};
</script>
