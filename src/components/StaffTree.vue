<template>
  <TreeGrid
    :data="staff_tree_data"
    :columnResizing="true"
    idField="id"
    treeField="code"
    @rowExpand="onRowExpand($event)"
    @rowClick="onRowClick($event)"
    @rowDblClick="onRowDblClick($event)"
    style="height: auto"
  >
    <GridColumn field="code" title="Обозначение"></GridColumn>
    <GridColumn field="title" title="Наименование" width="250"></GridColumn>
    <GridColumn field="quantity" title="Кол-во" width="35"></GridColumn>
    <GridColumn field="position" title="Поз." width="35"></GridColumn>
    <GridColumn field="format_string" title="Формат" width="70"></GridColumn>
    <GridColumn field="weight" title="Масса" width="50"></GridColumn>
    <GridColumn field="designer" title="Автор" width="90"></GridColumn>
    <GridColumn field="material" title="Материал" width="170"></GridColumn>
    <GridColumn field="des_state" title="Состояние" width="70"></GridColumn>
    <GridColumn field="notice" title="Извещение" width="70"></GridColumn>
    <GridColumn field="files" title="Файлы" width="150">
      <template slot="body" slot-scope="scope">
        <file-icons :file_links="scope.row.files"></file-icons>
      </template>
    </GridColumn>
    <GridColumn title="М" width="25" align="center">
      <template slot="cell" slot-scope="scope">
        <img :src="getA" v-show="scope.row.has_arcdocs" />
        <img :src="getI" v-show="scope.row.outdated" /> </template
    ></GridColumn>
  </TreeGrid>
</template>

<script>
import { getData } from "@/api/api";
import FileIcons from "@/components/FileIcons.vue";
import { setChildren } from "@/api/utils";

export default {
  name: "StaffTree",
  data() {
    return {
      staff_tree_data: [], // Данные для дерева состава
    };
  },
  computed: {
    getA() {
      return require("@/assets/images/a.png");
    },
    getI() {
      return require("@/assets/images/i.png");
    },
  },
  methods: {
    onRowExpand(event) {
      this.getStaffTreeRows(event);
    },
    parseRow(row_node) {
      if (row_node["has_staff"]) row_node["state"] = "closed";
      row_node["iconCls"] = row_node["part_type_id"];
      return row_node;
    },
    getRootRow() {
      // Получение корневой ветки
      const url = `vw/staffroot/${this.$store.getters.getSelectedId}`;
      getData(this, url).then((rows) => {
        this.staff_tree_data = [this.parseRow(rows)];
      });
    },
    fillSubBranch() {
      // Загрузка/перезагрузка подветки состава
      const url = `vw/stafftree/${this.$store.getters.getSelectedId}`;
      getData(this, url).then((rows) => {
        setChildren(
          this.staff_tree_data,
          this.$store.getters.getSelectedId,
          this.parseRow(rows)
        );
      });
    },
    async getStaffTreeRows(row) {
      // Получение строк состава выбранной ветки
      const url = `vw/stafftree/${row.child}`;
      const res = await getData(this, url);
      this.$set(row, "children", res.map(this.parseRow));
    },
    onRowClick(event) {
      // Обработка клика по ветке в дереве
      this.$store.commit("setSelectedId", event.child);
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event.child}/`);
    },
  },
  mounted() {
    this.getRootRow(); // Формирование корневого узла
  },
  components: {
    FileIcons,
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>
