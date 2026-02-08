<template>
  <div id="App" style="min-width: 800">
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
          <TabPanel title="Перечень" v-if="checkShow('objectlist')">
            <objects-list></objects-list>
          </TabPanel>
          <TabPanel title="Перечень" v-if="checkShow('objectlistwd')">
            <objects-list-wd></objects-list-wd>
          </TabPanel>
          <TabPanel title="Перечень" v-if="checkShow('objectlistcode')">
            <objects-list-code></objects-list-code>
          </TabPanel>
          <TabPanel title="Перечень" v-if="checkShow('objectlistcodename')">
            <objects-list-code-name></objects-list-code-name>
          </TabPanel>
          <TabPanel
            title="Заказы на производство"
            v-if="checkShow('prodorderslist')"
          >
            <prod-orders-list></prod-orders-list>
          </TabPanel>
          <TabPanel title="Перечень операций" v-if="checkShow('operationlist')">
            <operations-list></operations-list>
          </TabPanel>
          <TabPanel title="Перечень извещений" v-if="checkShow('noticelist')">
            <notices-list></notices-list>
          </TabPanel>
          <TabPanel
            title="Производственные подразделения"
            v-if="checkShow('placelist')"
          >
            <places-list></places-list>
          </TabPanel>
          <TabPanel
            title="Производственные подразделения"
            v-if="checkShow('placelistrich')"
          >
            <places-list-rich></places-list-rich>
          </TabPanel>
          <TabPanel
            title="Классификационные группы"
            v-if="checkShow('classificationlist')"
          >
            <classifications-list></classifications-list>
          </TabPanel>
          <TabPanel
            title="Единицы измерения"
            v-if="checkShow('measureunitslist')"
          >
            <measure-units-list></measure-units-list>
          </TabPanel>
          <TabPanel title="Разработчики" v-if="checkShow('designerlist')">
            <designers-list></designers-list>
          </TabPanel>

          <TabPanel
            title="Дополнительные свойства"
            v-if="checkShow('propertieslist')"
          >
            <properties-list></properties-list>
          </TabPanel>
          <TabPanel title="Роли" v-if="checkShow('roleslist')">
            <roles-list></roles-list>
          </TabPanel>
          <TabPanel
            title="Типы документов"
            v-if="checkShow('documenttypeslist')"
          >
            <document-types-list></document-types-list>
          </TabPanel>
          <TabPanel title="Создать" v-if="checkEdit('create')">
            <properties-form mode="create" key="create"></properties-form>
          </TabPanel>
          <TabPanel title="Редактировать" v-if="checkShow('edit')">
            <properties-form mode="edit" key="edit"></properties-form>
          </TabPanel>
          <TabPanel title="Состав" v-if="checkShow('staff')">
            <staff></staff>
          </TabPanel>
          <TabPanel title="Состав" v-if="checkShow('staffratio')">
            <staff-ratio></staff-ratio>
          </TabPanel>
          <TabPanel title="Дерево состава" v-if="checkShow('stafftree')">
            <staff-tree></staff-tree>
          </TabPanel>
          <TabPanel title="Дерево состава" v-if="checkShow('stafftreesr')">
            <staff-tree-sr></staff-tree-sr>
          </TabPanel>
          <TabPanel title="Состав заказа" v-if="checkShow('prodordertree')">
            <prod-order-tree></prod-order-tree>
          </TabPanel>
          <TabPanel title="Файлы" v-if="checkShow('objectfiles')">
            <object-files></object-files>
          </TabPanel>
          <TabPanel title="Документы заказа" v-if="checkShow('orderfiles')">
            <order-files></order-files>
          </TabPanel>
          <TabPanel title="Сравнить составы" v-if="checkShow('staffcompare')">
            <staff-compare></staff-compare>
          </TabPanel>
          <TabPanel title="Еще..." v-if="checkShow('extralinks')">
            <extra-links></extra-links>
          </TabPanel>
          <TabPanel title="Сервис для заказа" v-if="checkShow('orderpart') && checkInOrder()">
            <order-part></order-part>
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
        <Accordion
          class="f-full"
          :border="false"
          :multiple="true"
          :selectedIndex="[0, 1]"
        >
          <AccordionPanel id="1" title="Фильтры" v-if="checkShow('filters')">
            <list-filters></list-filters>
          </AccordionPanel>
          <AccordionPanel
            id="2"
            title="Классификационные группы"
            v-if="checkShow('classification')"
          >
            <classification-tree></classification-tree>
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
            id="1"
            title="Свойства"
            v-if="checkShow('propertiesview')"
          >
            <properties-form-view></properties-form-view>
          </AccordionPanel>
          <AccordionPanel
            id="2"
            title="Экземпляр сортамента"
            v-if="checkShow('typesizesort')"
          >
            <type-size-sort></type-size-sort>
          </AccordionPanel>
          <AccordionPanel
            id="2"
            title="Материал экземпляра"
            v-if="checkShow('typesizemater')"
          >
            <type-size-mater></type-size-mater>
          </AccordionPanel>
          <AccordionPanel
            id="3"
            title="Исполнители"
            v-if="checkShow('prodorderposassign')"
          >
            <prod-order-pos-assign></prod-order-pos-assign>
          </AccordionPanel>
          <AccordionPanel
            id="12"
            title="Роли разработчиков"
            v-if="checkShow('designroles')"
          >
            <design-roles></design-roles>
          </AccordionPanel>
          <AccordionPanel
            id="71"
            title="Файлы"
            v-if="checkShow('objectfilessimple')"
          >
            <object-files-simple></object-files-simple>
          </AccordionPanel>
          <AccordionPanel
            id="8"
            title="Касается"
            v-if="checkShow('noticelinks')"
          >
            <notice-links></notice-links>
          </AccordionPanel>
          <AccordionPanel
            id="81"
            title="Разослать"
            v-if="checkShow('noticerecipients')"
          >
            <notice-recipients></notice-recipients>
          </AccordionPanel>
          <AccordionPanel
            id="82"
            title="Извещения"
            v-if="checkShow('objectnotices')"
          >
            <object-notices></object-notices>
          </AccordionPanel>
          <AccordionPanel
            id="83"
            title="Версии файлов"
            v-if="checkShow('noticefileversions')"
          >
            <notice-file-versions></notice-file-versions>
          </AccordionPanel>
          <AccordionPanel id="9" title="Входит в" v-if="checkShow('staffinto')">
            <staff-into></staff-into>
          </AccordionPanel>
          <AccordionPanel
            id="92"
            title="Все вхождения"
            v-if="checkShow('linkinto')"
          >
            <link-into></link-into>
          </AccordionPanel>
          <AccordionPanel
            id="93"
            title="Экземпляры сортаментов"
            v-if="checkShow('exemplarslist')"
          >
            <exemplars-list></exemplars-list>
          </AccordionPanel>
          <AccordionPanel
            id="10"
            title="Исполнения"
            v-if="checkShow('renditions')"
          >
            <renditions></renditions>
          </AccordionPanel>
          <AccordionPanel
            id="11"
            title="Конструкторский материал"
            v-if="checkShow('designmater')"
          >
            <design-mater></design-mater>
          </AccordionPanel>
          <AccordionPanel
            id="15"
            title="Дополнительные свойства"
            v-if="checkShow('propertyvalues')"
          >
            <property-values></property-values>
          </AccordionPanel>
          <AccordionPanel
            id="84"
            title="Задания"
            v-if="checkShow('objecttasks')"
          >
            <object-tasks></object-tasks>
          </AccordionPanel>
          <AccordionPanel
            id="16"
            title="Внешние системы"
            v-if="checkShow('outsidelinks')"
          >
            <outside-links></outside-links>
          </AccordionPanel>

          <AccordionPanel
            id="17"
            title="Похожие по обозначению"
            v-if="checkShow('soundsamelist')"
          >
            <sound-same></sound-same>
          </AccordionPanel>
          <AccordionPanel
            id="18"
            title="Похожие по составу"
            v-if="checkShow('staffsame')"
          >
            <staff-same></staff-same>
          </AccordionPanel>
          <AccordionPanel id="19" title="Сервис" v-if="checkShow('service')">
            <service></service>
          </AccordionPanel>
          <AccordionPanel
            id="20"
            title="Входят в группу"
            v-if="checkShow('classificationstaff')"
          >
            <classification-staff></classification-staff>
          </AccordionPanel>
          <AccordionPanel
            id="4"
            title="История изменений"
            v-if="checkShow('historylog')"
          >
            <history-log></history-log>
          </AccordionPanel>
          <AccordionPanel
            id="41"
            title="Иллюстрация"
            v-if="checkShow('picturepanel')"
          >
            <picture-panel></picture-panel>
          </AccordionPanel>
          <AccordionPanel
            id="42"
            title="Поставки материалов в заказах"
            v-if="checkShow('matersupplies')"
          >
            <mater-supplies></mater-supplies>
          </AccordionPanel>
          <AccordionPanel id="43" title="Цены" v-if="checkShow('supplyprices')">
            <supply-prices></supply-prices>
          </AccordionPanel>
          <AccordionPanel
            id="44"
            title="Иллюстрации"
            v-if="checkShow('picturecarousel')"
          >
            <picture-carousel></picture-carousel>
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
import ClassificationTree from "@/components/ClassificationTree.vue";
import ListFilters from "@/components/ListFilters.vue";
import ObjectsList from "@/components/ObjectsList.vue";
import ObjectsListWd from "@/components/ObjectsListWd.vue";
import ObjectsListCode from "@/components/ObjectsListCode.vue";
import ObjectsListCodeName from "@/components/ObjectsListCodeName.vue";
import ProdOrdersList from "@/components/ProdOrdersList.vue";
import PlacesList from "@/components/PlacesList.vue";
import PlacesListRich from "@/components/PlacesListRich.vue";
import ClassificationsList from "@/components/ClassificationsList.vue";
import MeasureUnitsList from "@/components/MeasureUnitsList.vue";
import DesignersList from "@/components/DesignersList.vue";
import PropertiesForm from "@/components/PropertiesForm.vue";
import PropertiesFormView from "@/components/PropertiesFormView.vue";
import PropertiesList from "@/components/PropertiesList.vue";
import TypeSizeSort from "@/components/TypeSizeSort.vue";
import TypeSizeMater from "@/components/TypeSizeMater.vue";
import Staff from "@/components/Staff.vue";
import StaffRatio from "@/components/StaffRatio.vue";
import StaffTree from "@/components/StaffTree.vue";
import StaffTreeSr from "@/components/StaffTreeSr.vue";
import ProdOrderTree from "@/components/ProdOrderTree.vue";
import OrderPart from "@/components/OrderPart.vue";
import OperationsList from "@/components/OperationsList.vue";
import ProdOrderPosAssign from "@/components/ProdOrderPosAssign.vue";
import HistoryLog from "@/components/HistoryLog.vue";
import NoticesList from "@/components/NoticesList.vue";
import ObjectFiles from "@/components/ObjectFiles.vue";
import OrderFiles from "@/components/OrderFiles.vue";
import ObjectFilesSimple from "@/components/ObjectFilesSimple.vue";
import NoticeLinks from "@/components/NoticeLinks.vue";
import NoticeRecipients from "@/components/NoticeRecipients.vue";
import NoticeFileVersions from "@/components/NoticeFileVersions.vue";
import ObjectNotices from "@/components/ObjectNotices.vue";
import StaffInto from "@/components/StaffInto.vue";
import LinkInto from "@/components/LinkInto.vue";
import SoundSame from "@/components/SoundSame.vue";
import StaffSame from "@/components/StaffSame.vue";
import Service from "@/components/Service.vue";
import Status from "@/components/Status.vue";
import Renditions from "@/components/Renditions.vue";
import DesignMater from "@/components/DesignMater.vue";
import RolesList from "@/components/RolesList.vue";
import DesignRoles from "@/components/DesignRoles.vue";
import PropertyValues from "@/components/PropertyValues.vue";
import OutsideLinks from "@/components/OutsideLinks.vue";
import ObjectTasks from "@/components/ObjectTasks.vue";
import ExtraLinks from "@/components/ExtraLinks.vue";
import ExemplarsList from "@/components/ExemplarsList.vue";
import PicturePanel from "@/components/PicturePanel.vue";
import PictureCarousel from "@/components/PictureCarousel.vue";
import MaterSupplies from "@/components/supply/MaterSupplies.vue";
import SupplyPrices from "@/components/supply/SupplyPrices.vue";
import StaffCompare from "@/components/StaffCompare.vue";
import DocumentTypesList from "@/components/DocumentTypesList.vue";
import ClassificationStaff from "@/components/ClassificationStaff.vue";

export default {
  mixins: [page, editable_component],
  components: {
    MenuBar,
    MessageBar,
    ClassificationTree,
    ListFilters,
    ObjectsList,
    ObjectsListWd,
    ObjectsListCode,
    ObjectsListCodeName,
    ProdOrdersList,
    PlacesList,
    PlacesListRich,
    ClassificationsList,
    MeasureUnitsList,
    DesignersList,
    Staff,
    StaffRatio,
    StaffTree,
    StaffTreeSr,
    ProdOrderTree,
    OperationsList,
    ProdOrderPosAssign,
    PropertiesForm,
    PropertiesFormView,
    PropertiesList,
    TypeSizeSort,
    TypeSizeMater,
    HistoryLog,
    NoticesList,
    ObjectFiles,
    OrderFiles,
    ObjectFilesSimple,
    NoticeLinks,
    NoticeRecipients,
    NoticeFileVersions,
    ObjectNotices,
    StaffInto,
    LinkInto,
    SoundSame,
    StaffSame,
    Service,
    Status,
    Renditions,
    DesignMater,
    DesignRoles,
    RolesList,
    PropertyValues,
    OutsideLinks,
    ObjectTasks,
    ExtraLinks,
    ExemplarsList,
    PicturePanel,
    PictureCarousel,
    MaterSupplies,
    SupplyPrices,
    StaffCompare,
    DocumentTypesList,
    ClassificationStaff,
    OrderPart,
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
  min-width: 1400px;
}
</style>