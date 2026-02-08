<template>
  <form style="margin: 3px"  v-if="checkEdit('operations')">
    <div>
      <TextBox
        style="width: 100%"
        iconCls="icon-search"
        placeholder="Поиск..."
        @valueChange="doFilter($event.currentValue)"
      ></TextBox>

      <DataGrid
        :data="list_data"
        selectionMode="single"
        :emptyMsg="msg"
        :draggable="true"
        @rowSelect="onRowSelect($event)"
        @rowDblClick="onRowDblClick($event)"
      >
        <GridColumn field="operation_name"></GridColumn>
      </DataGrid>
    </div>
    <div class="buttons_bar">
      <LinkButton
        iconCls="icon-add"
        style="margin-left: 10px"
        @click="submitFormAdd()"
        >Добавить</LinkButton
      >
    </div>
  </form>
</template>

<script>
import { getData } from "@/api/api";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      list_data: [],
      msg: "Ничего не найдено",
    };
  },
  mounted() {
    // Наполнение списка производственных подразделений
    this.fillOperations(null);
  },
  methods: {
    async fillOperations(filter) {
      let params = { limit: 20 };
      if (filter) params["search"] = filter;
      const lines = await getData(this, "operation/", params);
      this.list_data = lines.results;
    },
    async doFilter(value) {
      this.fillOperations(value);
    },
    onRowSelect(event) {
      this.$store.commit("setOperationId", event.pk);
    },
    onRowDblClick(event) {
      this.$store.commit("setOperationId", event.pk);
      this.submitFormAdd();
    },
    async submitFormAdd() {
      // Добавление новой операции
      let new_item = {
        route: this.$store.getters.getRouteId,
        route_point: this.$store.getters.getRoutePointId,
        order_num: 0,
        row_type: 1, // Операция
        operation: this.$store.getters.getOperationId,
      };
      this.$store
        .dispatch("postData", {
          inc_url: "tprow",
          params: new_item,
        })
        .then(
          (response) => this.$root.$emit("reloadBranch") // Вызов метода обновления ветки в другом компоненте
        );
    },
  },
};
</script>