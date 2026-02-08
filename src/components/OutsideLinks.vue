<template>
      <DataGrid :data="list_data" :columnResizing="true">
        <GridColumn field="partner_name" title="Система" width="130px"></GridColumn>
        <GridColumn field="url" title="Ссылка">
          <template slot="body" slot-scope="scope">
            <a v-if="scope.row.url" :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
            <span v-else>{{ scope.row.external_id }}</span>
          </template>
        </GridColumn>
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
      row_node.url = (row_node.header_url) ? row_node.header_url + row_node.external_id : '';
      return row_node;
    },
    async loadLinks() {
      const url = `external/${this.selected_id}`;
      const res = await getData(this, url);
      this.list_data = res.map(this.parseRow);
    },
  },
  watch: {
    selected_id(newValue, oldValue) {
      this.loadLinks();
    },
  },
  mounted() {
    if (this.selected_id) this.loadLinks(); // На случай, если объект указан
  },
};
</script>