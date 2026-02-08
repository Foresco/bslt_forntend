<template>
  <DataGrid :data="list_data" :columnResizing="true">
    <GridColumn field="file_name" title="Файл">
      <template slot="body" slot-scope="scope">
        <a :href="scope.row.url" download>{{ scope.row.file_name }}</a>
      </template>
    </GridColumn>
    <GridColumn field="doc_type" title="Тип" width="100"></GridColumn>
    <GridColumn field="description" title="Описание" width="80"></GridColumn>
    <GridColumn field="change_num" title="Номер" width="20"></GridColumn>
    <GridColumn field="change_type" title="Тип" width="25"></GridColumn>
    <GridColumn field="version_num" title="Версия" width="20"></GridColumn>
  </DataGrid>
</template>

<script>
import { mapState } from "vuex";
import { getData } from "@/api/api";

export default {
  data() {
    return {
      list_data: [],
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    parseRow(row_node) {
      const host = this.$store.getters.getHostUrl;
      row_node.url = host + row_node.url;
      return row_node;
    },
    async loadListData() {
      this.list_data = []; // Очистка списка
      let params = { notice: this.selected_id };
      this.loading = true;
      const url = "noticelinkdoc/";
      const lines = await getData(this, url, params);
      this.list_data = lines.map(this.parseRow);
      this.loading = false;
    },
  },
  watch: {
    selected_id() {
      this.loadListData();
    },
  },
  mounted() {
    if (this.selected_id) this.loadListData(); // На случай, если извещение уже указано
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>
