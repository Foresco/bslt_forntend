<template>
  <DataGrid
    :data="list_data"
    :columnResizing="true"
    :loading="loading"
    @rowDblClick="onRowDblClick($event)"
  >
    <GridColumn field="child" title="Экземпляр сортамента"> </GridColumn>
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
    loadListData() {
      const parseRow = (row_node) => {
        const host = this.$store.getters.getHostUrl;
        return {
          child_id: row_node.child.pk,
          child: row_node.child.code
        };
      };
      this.loading = true;
      const url = "link/";
      let likn_class = 'undefined'; // Для других типов не отображется ничего
      if (this.$store.getters.getSubTypeKey == 'sortament') likn_class = 'typesizesort';
      else if (this.$store.getters.getSubTypeKey == 'material') likn_class = 'typesizemater';
      const params = { parent: this.selected_id, link_class: likn_class };
      getData(this, url, params).then(
        (response) => (this.list_data = response.map(parseRow))
      );

      this.loading = false;
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event.child_id}/`);
    },
  },
  watch: {
    selected_id() {
      this.loadListData();
    },
  },
  mounted() {
    if (this.selected_id) this.loadListData(); // На случай, если объект указан
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>