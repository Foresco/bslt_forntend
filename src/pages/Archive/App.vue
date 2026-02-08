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
            title="Архивные документы"
            v-if="checkShow('arcdocumentslist')"
          >
            <arcdocuments-list></arcdocuments-list>
          </TabPanel>
          <TabPanel title="Префиксы" v-if="checkShow('codeprefixeslist')">
            <code-prefixes-list></code-prefixes-list>
          </TabPanel>
          <TabPanel
            title="Выдачи документов"
            v-if="checkShow('deliverieslist')"
          >
            <deliveries-list></deliveries-list>
          </TabPanel>
          <TabPanel
            title="Загрузки документов"
            v-if="checkShow('fileuploadslist')"
          >
            <file-uploads-list></file-uploads-list>
          </TabPanel>
          <TabPanel title="Инциденты" v-if="checkShow('incidentslist')">
            <incidents-list></incidents-list>
          </TabPanel>
          <TabPanel
            title="Файловые документы"
            v-if="checkShow('filedocumentslist')"
          >
            <file-documents-list></file-documents-list>
          </TabPanel>
          <TabPanel
            title="Загрузить"
            iconCls="icon-add"
            v-if="checkShow('fileuploadcreate')"
          >
            <file-upload-create></file-upload-create>
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
          <AccordionPanel id="2" title="Фильтры" v-if="checkShow('filters')">
            <list-filters></list-filters>
          </AccordionPanel>
          <AccordionPanel
            id="2"
            title="Фильтры"
            v-if="checkShow('archivefilters')"
          >
            <archive-filters></archive-filters>
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
          <AccordionPanel title="Иллюстрация" v-if="checkShow('picturepanel')">
            <picture-panel></picture-panel>
          </AccordionPanel>
          <AccordionPanel
            title="Документ касается"
            v-if="checkShow('arcdocumentobjects')"
          >
            <arcdocument-objects></arcdocument-objects>
          </AccordionPanel>
          <AccordionPanel
            title="Свойства версии документа"
            v-if="checkShow('docversionproperties')"
          >
            <doc-version-properties></doc-version-properties>
          </AccordionPanel>
          <AccordionPanel title="Свойства" v-if="checkShow('propertiesview')">
            <properties-form-view></properties-form-view>
          </AccordionPanel>
          <AccordionPanel
            title="Выданные документы"
            v-if="checkShow('deliveryarcdocs')"
          >
            <delivery-arcdocs></delivery-arcdocs>
          </AccordionPanel>
          <AccordionPanel title="Выдачи" v-if="checkShow('arcdocdeliveries')">
            <arcdoc-deliveries></arcdoc-deliveries>
          </AccordionPanel>
          <AccordionPanel
            title="Загруженные документы"
            v-if="checkShow('uploadarcdocs')"
          >
            <upload-arcdocs></upload-arcdocs>
          </AccordionPanel>
          <AccordionPanel
            title="Объекты версии"
            v-if="checkShow('docversionobjects')"
          >
            <doc-version-objects></doc-version-objects>
          </AccordionPanel>
          <AccordionPanel
            title="Роли разработчиков"
            v-if="checkShow('designroles')"
          >
            <design-roles></design-roles>
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
import ListFilters from "@/components/ListFilters.vue";
import ArchiveFilters from "@/components/ArchiveFilters.vue";
import Status from "@/components/Status.vue";
import ArcdocumentObjects from "@/components/ArcdocumentObjects.vue";
import ArcdocumentsList from "@/components/ArcdocumentsList.vue";
import CodePrefixesList from "@/components/CodePrefixesList.vue";
import DeliveriesList from "@/components/DeliveriesList.vue";
import FileDocumentsList from "@/components/FileDocumentsList.vue";
import DeliveryArcdocs from "@/components/DeliveryArcdocs.vue";
import ArcdocDeliveries from "@/components/ArcdocDeliveries.vue";
import FileUploadsList from "@/components/FileUploadsList.vue";
import FileUploadCreate from "@/components/FileUploadCreate.vue";
import IncidentsList from "@/components/IncidentsList.vue";
import UploadArcdocs from "@/components/UploadArcdocs.vue";
import DesignRoles from "@/components/DesignRoles.vue";
import HistoryLog from "@/components/HistoryLog.vue";
import ObjectFiles from "@/components/ObjectFiles.vue";
import ObjectTasks from "@/components/ObjectTasks.vue";
import OutsideLinks from "@/components/OutsideLinks.vue";
import PropertyValues from "@/components/PropertyValues.vue";
import DocVersionObjects from "@/components/DocVersionObjects.vue";
import PicturePanel from "@/components/PicturePanel.vue";
import DocVersionProperties from "@/components/DocVersionProperties.vue";

export default {
  mixins: [page],
  components: {
    MenuBar,
    MessageBar,
    PropertiesForm,
    PropertiesFormView,
    ListFilters,
    ArchiveFilters,
    Status,
    ArcdocumentObjects,
    ArcdocumentsList,
    CodePrefixesList,
    DeliveriesList,
    FileDocumentsList,
    DeliveryArcdocs,
    ArcdocDeliveries,
    FileUploadsList,
    FileUploadCreate,
    IncidentsList,
    UploadArcdocs,
    DesignRoles,
    HistoryLog,
    ObjectFiles,
    ObjectTasks,
    OutsideLinks,
    PropertyValues,
    DocVersionObjects,
    PicturePanel,
    DocVersionProperties,
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
