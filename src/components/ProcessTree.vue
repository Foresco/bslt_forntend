<template>
  <div>
    <div>
      <form style="margin: 3px" v-if="checkEdit('edit')">
        <TextBox
          v-model="new_item.route_name"
          placeholder="Наименование маршрута"
        ></TextBox>
        <LinkButton
          iconCls="icon-add"
          style="margin: 5px"
          @click="submitFormAdd()"
          >Добавить</LinkButton
        >
        <LinkButton
          iconCls="icon-reload"
          @click="onReloadClick()"
          style="margin: 5px"
          >Обновить</LinkButton
        >
      </form>
      <TreeGrid
        style="height: 500px"
        :data="tree_data"
        idField="id"
        treeField="caption"
        @rowExpand="onRowExpand($event)"
        @rowClick="onRowClick($event)"
      >
        <GridColumn
          field="caption"
          title="Дерево технологического процесса"
        ></GridColumn>
        <GridColumn field="order_num" title="ПП" width="30"></GridColumn>
      </TreeGrid>
    </div>
  </div>
</template>

<script>
import { treeHelper } from "vx-easyui";
import { getData } from "@/api/api";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования
import { classRoute, getParseRow } from "@/components/pdm/processtreecls.js"; //

export default {
  name: "ProcessTree",
  mixins: [editable_component],
  data() {
    return {
      tree_data: [], // Данные для дерева технологического процесса
      new_item: {
        route_name: "Основной",
      }, // Информация о новом маршруте
      row_cl: null, // Экземпляр класса текущей ветки
      subject_id: null // Идентификатор объекта (чтобы сразу запомнить и не отслеживать)
    };
  },
  mounted() {
    // Наполнение списка маршрутов
    this.subject_id = this.$store.getters.getRootId;
    this.fillRouteRows();
    // Регистрация метода для вызова извне
    this.$root.$on("reloadBranch", () => {
      this.onReloadClick(); // Обновление содержимого ветки
    });
  },
  methods: {
    async fillRouteRows() {
      // Наполнение списка маршрутов
      const parseRow = function (row_node) {
        const a = new classRoute(row_node);
        return a.getNode();
      };
      const res = await getData(this, "route", {
        subject: this.subject_id,
      });
      this.tree_data = res.map(parseRow);
      return;
    },
    submitFormAdd() {
      // Добавление маршрута
      this.new_item["subject"] = this.$store.getters.getRootId;
      this.$store
        .dispatch("postData", {
          inc_url: "route",
          params: this.new_item,
        })
        // Обновление списка маршрутов
        .then((response) => this.fillRouteRows());
    },
    onRowClick(event) {
      this.row_cl = event.cl.onClick(this.$store); // Вызываем метод экземпляра класса
      this.$store.commit("setRootId", event.cl.getPk()); // Именно root - он отвечает за отображение формы свойств
      this.$store.commit("setTypeKey", event.cl.getCls());
    },
    setChildren(id, rows) {
      const branch = treeHelper.findNode(this.tree_data, "id", id);
      this.$set(branch, "children", rows);
    },
    async getBranchData(cl) {
      let response = await getData(this, cl.getUrl(), cl.getUrlParams());
      return response.map(getParseRow(cl.child_class));
    },
    async onRowExpand(event) {
      this.onRowClick(event); // Обработка клика по строке тоже
      const rows = await this.getBranchData(event.cl);
      this.setChildren(event.cl.getId(), rows);
    },
    onReloadClick() {
      // Обновление содержимого ветки
      // console.log('Обновление содержимого ветки');
      this.getBranchData(this.row_cl).then((rows) =>
        this.setChildren(this.row_cl.getId(), rows)
      );
    },
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>
