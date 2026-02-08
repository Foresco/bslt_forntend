<template>
  <common-list-np
    resturl="workertask/"
    suburlpk="child_id"
    :parseRow="parseRow"
    :onRowSelect="onRowSelect"
  >
    <GridColumn field="code" title="Заказ" width="100"></GridColumn>
    <GridColumn field="order_date" title="Дата" width="80"></GridColumn>
    <GridColumn field="child" title="Обозначение"></GridColumn>
    <GridColumn
      field="operation_name"
      title="Операция"
      :cellCss="getOperStyle"
    ></GridColumn>
    <GridColumn
      field="staff_quantity"
      title="В составе"
      width="75"
    ></GridColumn>
    <GridColumn field="quantity" title="В задании" width="75"></GridColumn>
    <GridColumn field="done_quantity" title="Сделано" width="70"></GridColumn>
  </common-list-np>
</template>

<script>
import CommonListNp from "@/components/CommonListNp.vue"; // Общий компонент всех списков

export default {
  components: {
    CommonListNp,
  },
  methods: {
    parseRow(row_node) {
      row_node["report_quantity"] = 0;
      row_node[
        "operation_name"
      ] = `${row_node["operation_name"]} (${row_node["route_point_order_num"]}.${row_node["tp_row_order_num"]})`;
      if (row_node["title"])
        row_node["child"] = `${row_node["child"]} ${row_node["title"]}`;
      return row_node;
    },
    onRowSelect(event) {
      this.$store.commit("setRowId", event.pk);
      this.$store.commit("setSelectedId", event.child_id);
      this.$store.commit("setLinkId", event.link_id);
      this.$store.commit("setOperationId", event.operation_id);
      this.$store.commit("setTypeKey", event.type_key);
      this.$store.commit("setSubTypeKey", event.part_type);
      this.$store.commit("setPictureObjectId", event.child_id);
      this.$store.commit("setPageKey", "worker_tasks");
    },
    getOperStyle(row) {
      return row.prog_state;
    },
  },
};
</script>
