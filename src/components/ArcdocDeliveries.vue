<template>
  <DataGrid
    :data="list_data"
    :columnResizing="true"
    @rowDblClick="onRowDblClick($event)"
  >
    <GridColumn
      field="delivery_num"
      title="Номер"
      width="70"
    ></GridColumn>
    <GridColumn field="receiver" title="Получатель"></GridColumn>
    <GridColumn
      field="delivery_date"
      title="Дата выдачи"
      width="80"
    ></GridColumn>
    <GridColumn field="exemplar_num" title="Экземпляр" width="70"></GridColumn>
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
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    parseRow(row_node) {
      row_node.delivery_num = row_node.delivery.delivery_num;
      row_node.delivery_id = row_node.delivery.pk;
      row_node.delivery_date = row_node.delivery.delivery_date;
      row_node.receiver = row_node.delivery.receiver
      return row_node;
    },
    async loadListData() {
      let params = { arc_doc: this.selected_id };
      this.loading = true;
      const url = "deliveryarcdoc/";
      const res = await getData(this, url, params);
      this.list_data = res.map(this.parseRow);
    //   this.list_data = await getData(this, url, params);
      this.loading = false;
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/delivery/${event["delivery_id"]}/`);
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
