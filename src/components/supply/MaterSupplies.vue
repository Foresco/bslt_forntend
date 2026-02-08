<template>
  <div>
    <div>
      <DataGrid :data="list_data" :columnResizing="true">
        <GridColumn field="parent_code" title="Производство" width="100">
          <template slot="body" slot-scope="scope">
            <a :href="scope.row.parent_url" target="_blank">{{
              scope.row.parent_code
            }}</a>
          </template>
        </GridColumn>
        <GridColumn field="quantity" title="Кол-во" width="30"> </GridColumn>
        <GridColumn field="supply_code" title="Снабжение" width="100"
          ><template slot="body" slot-scope="scope">
            <a :href="scope.row.supply_url" target="_blank">{{
              scope.row.supply_code
            }}</a>
          </template>
        </GridColumn>
        <GridColumn field="billet_desc" title="Заготовка"></GridColumn>
      </DataGrid>
    </div>
  </div>
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
      const host = this.$store.getters.getHostUrl;
      return {
        parent_url: `/${row_node.parent_id}/`,
        parent_code: row_node.parent_code,
        quantity: row_node.quantity,
        supply_url: `/${row_node.supply_id}/`,
        supply_code: row_node.supply_order,
        billet_desc: row_node.billet_desc,
        // mater_url: `/${row_node.mater_id}/`,
        // mater_code: row_node.mater_code,
      };
    },
    async loadListData() {
      this.list_data = []; // Очистка списка
      this.loading = true;
      const res = await getData(this, "orderprodposition/", {
        prod_order_link__child: this.selected_id,
      });
      this.list_data = res.map(this.parseRow);
      this.loading = false;
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
