<template>
  <DataGrid
    :data="list_data"
    :columnResizing="true"
  >
    <GridColumn field="parent_code" title="ДСЕ">
      <template slot="body" slot-scope="scope">
        <a :href="scope.row.parent_url" target="_blank">{{ scope.row.parent_code }}</a>
      </template>
    </GridColumn>
    <GridColumn field="top_code" title="Изделие">
      <template slot="body" slot-scope="scope">
        <a :href="scope.row.top_url" target="_blank">{{ scope.row.top_code }}</a>
      </template>
    </GridColumn>
    <GridColumn field="quantity_ratio" title="Норма расхода" width="95"></GridColumn>
  </DataGrid>
</template>

<script>
import { getData } from "@/api/api";
import { mapState } from "vuex";

export default {
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    parseRow(row_node) {
      row_node.parent_url = `/${row_node.parent_id}/`;
      row_node.top_url = `/${row_node.top_id}/`;
      return row_node;
    },
    async loadListData() {
      if (this.selected_id) {
        this.loading = true;
        const url = `intotop/${this.selected_id}`;
        const res = await getData(this, url);
        this.list_data = res.map(this.parseRow);
        this.loading = false;
      } else this.list_data = [];
    },
  },
  watch: {
    selected_id() {
      this.loadListData();
    },
  },
  mounted() {
    if (this.selected_id) this.loadListData(); // На случай, если извещение или объект уже указаны
  },
};
</script>
