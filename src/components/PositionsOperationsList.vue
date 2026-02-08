<template>
  <common-list
    resturl="positionsoperation/"
    suburlpk="child_id"
    :parseRow="parseRow"
    :onRowSelect="onRowSelect"
  >
    <GridColumn field="code" title="Заказ" width="100"></GridColumn>
    <GridColumn field="child" title="Обозначение"></GridColumn>
    <GridColumn
      field="operation_name"
      title="Операция"
      width="200"
      :cellCss="getOperStyle"
    ></GridColumn>
    <GridColumn field="ssquantity" title="В заказе" width="75"></GridColumn>
    <GridColumn field="done_quantity" title="Сделано" width="70"></GridColumn>
    <GridColumn field="bad_quantity" title="Брак" width="60"></GridColumn>
  </common-list>
</template>

<script>
import CommonList from "@/components/CommonList.vue"; // Общий компонент всех списков

export default {
  components: {
    CommonList,
  },
  methods: {
    parseRow(row_node) {
      row_node["report_quantity"] = 0;
      const test_prev = row_node["code"] + "." + row_node["child"]; // Уникально сочетание позиции и заказа
      if (test_prev == this.$store.getters.getPrevious) {
        // В повторах позиций не выводятся заказ и позиция
        row_node["code"] = "";
        row_node["child"] = "";
      } else {
        this.$store.commit("setPrevious", test_prev);
        if (row_node["title"])
          row_node["child"] = `${row_node["child"]} ${row_node["title"]}`; // Добавление наименования к обозначению
      }
      row_node[
        "operation_name"
      ] = `${row_node["operation_name"]} (${row_node["route_point_order_num"]}.${row_node["tp_row_order_num"]})`;
      // Добавляем отгруженное количество
      if (row_node["ship_quantity"])
        row_node["ssquantity"] =
          row_node["quantity"] + "/" + row_node["ship_quantity"];
      else row_node["ssquantity"] = row_node["quantity"];
      return row_node;
    },
    onRowSelect(event) {
      this.$store.commit("setSelectedId", event.child_id);
      this.$store.commit("setLinkId", event.link_id);
      this.$store.commit("setOperationId", event.pk);
      this.$store.commit("setTypeKey", event.type_key);
      this.$store.commit("setSubTypeKey", event.part_type);
      this.$store.commit("setPictureObjectId", event.child_id);
      this.$store.commit("setPageKey", "position_operations");
    },
    getOperStyle(row) {
      return row.prog_state;
    },
  },
};
</script>
