<template>
  <div>
    <DataGrid :data="list_data" :columnResizing="true">
      <GridColumn
        field="session_datetime"
        title="Дата и время"
        width="200px"
        :sortable="true"
      ></GridColumn>
      <GridColumn field="ip" title="ip-адрес"></GridColumn>
    </DataGrid>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { mapState } from "vuex";

export default {
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида активности пользователя
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    async loadListData() {
      this.list_data = [];
      if (this.selected_id) {
        this.loading = true;
        const lines = await getData(this, `user/${this.selected_id}/activity`);
        this.list_data = lines.results;
        this.loading = false;
      }
    },
  },
  watch: {
    selected_id() {
      this.loadListData();
    },
  },
  mounted() {
    if (this.selected_id) this.loadListData();
  },
};
</script>
