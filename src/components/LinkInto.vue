<template>
  <DataGrid
    :data="list_data"
    :columnResizing="true"
    :loading="loading"
    @rowDblClick="onRowDblClick($event)"
  >
    <GridColumn width="18px" :cellCss="getIcon"></GridColumn>
    <GridColumn field="parent" title="Родитель"> </GridColumn>
    <GridColumn field="quantity" title="Кол-во" width="50px"></GridColumn>
    <GridColumn field="comment" title="Примечание"></GridColumn>
  </DataGrid>
</template>

<script>
import { getData } from "@/api/api";
import { mapState } from "vuex";

export default {
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
      loading: false, // Признак загрузки
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    loadInto() {
      const parseRow = (row_node) => {
        const host = this.$store.getters.getHostUrl;
        return {
          parent_id: row_node.parent.pk,
          parent: row_node.parent.code,
          type_key: row_node.parent.type_key,
          quantity: row_node.quantity,
          comment: row_node.comment,
        };
      };
      this.loading = true;
      const url = "link/";
      const params = { child: this.selected_id };
      getData(this, url, params).then(
        (response) => (this.list_data = response.map(parseRow))
      );

      this.loading = false;
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event.parent_id}/`);
    },
    getIcon(row) {
      return row.type_key;
    },
  },
  watch: {
    selected_id() {
      this.loadInto();
    },
  },
  mounted() {
    if (this.selected_id) this.loadInto(); // На случай, если объект указан
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>