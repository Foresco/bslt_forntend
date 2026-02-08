<template>
  <div>
    <div>
      <TreeGrid
        :data="tree_data"
        :columnResizing="true"
        idField="id"
        treeField="code"
        @rowExpand="onRowExpand($event)"
        style="height: auto"
      >
        <GridColumn field="code" title="Родитель">
          <template slot="body" slot-scope="scope">
            <a :href="scope.row.url">{{ scope.row.code }}</a>
          </template>
        </GridColumn>
        <GridColumn field="quantity" title="Кол-во" width="45"></GridColumn>
        <GridColumn field="prod_order" title="Заказ" width="75"
          ><template slot="body" slot-scope="scope">
            <a :href="scope.row.prod_order_url">{{ scope.row.prod_order }}</a>
          </template>
        </GridColumn>
      </TreeGrid>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getData } from "@/api/api";

export default {
  data() {
    return {
      tree_data: [], // Собранные и сформированные данные для дерева
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    parseRow(row_node) {
      row_node.url = `/${row_node.id}/`;
      row_node.prod_order_url = `/${row_node.prod_order_id}/`;
      row_node.state = "closed";
      row_node.iconCls = row_node.type_key;
      if (row_node.title)
        row_node.code = row_node.code + " " + row_node.title;
      return row_node;
    },
    getRootRows() {
      // Получение корневых строк
      getData(this, `parents/${this.selected_id}`, { root: true }).then(
        (rows) => {
          this.tree_data = rows.map(this.parseRow);
        }
      );
    },
    onRowExpand(event) {
      // Раскрытие ветки дерева
      getData(this, `parents/${event.id}`).then((rows) => {
        this.$set(event, "children", rows.map(this.parseRow));
      });
    },
  },
  watch: {
    selected_id() {
      this.getRootRows();
    },
  },
  mounted() {
    if (this.selected_id) this.getRootRows(); // На случай, если объект указан
  },
};
</script>
