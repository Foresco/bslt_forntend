<template>
  <DataGrid :data="list_data">
    <GridColumn field="caption" title="Ссылка">
      <template slot="body" slot-scope="scope">
        <a :href="scope.row.url">{{ scope.row.code }}</a>
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
      list_data: [],
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    parseRow(row_node) {
      const host = this.$store.getters.getHostUrl;
      row_node.url = `${host}/${row_node.pk}`;
      return row_node;
    },
    getGroupStaff() {
      this.list_data = [];
      if (this.selected_id) {
        const url = "classificationstaff/";
        getData(this, url, { group: this.selected_id }).then(
          (response) => (this.list_data = response.map(this.parseRow))
        );
      }
    },
  },
  watch: {
    selected_id() {
      this.getGroupStaff();
    },
  },
  mounted() {
    if (this.selected_id) this.getGroupStaff(); // На случай, если группа уже указана
  },
};
</script>