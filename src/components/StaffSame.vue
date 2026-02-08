<template>
  <div>
    <DataGrid
      :data="list_data"
      selectionMode="multiple"
      @rowDblClick="onRowDblClick($event)"
    >
      <GridColumn field="code" title="Обозначение"></GridColumn>
      <GridColumn field="prcnt" title="Процент" width="80"></GridColumn>
    </DataGrid>
    <img
      v-show="loading"
      src="@/assets/images/preloader.gif"
      alt="Loading"
      style="margin-left: 100px"
    />
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { rounder } from "@/api/formatters";
import { mapState } from "vuex";

export default {
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    async loadSame() {
      const parseRow = (row_node) => {
        row_node["prcnt"] = `${rounder(row_node["prcnt"] * 100, 1)}%`;
        return row_node;
      };
      const url = `staffsame/${this.$store.getters.getSelectedId}`;
      this.list_data = [];
      this.loading = true;
      let res = await getData(this, url);
      this.list_data = res.map(parseRow);
      this.loading = false;
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event.pk}/`);
    },
  },
  watch: {
    selected_id() {
      this.loadSame();
    },
  },
  mounted() {
    if (this.selected_id) this.loadSame(); // На случай, если объект указан
  },
};
</script>
