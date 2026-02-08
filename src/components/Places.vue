<template>
  <form style="margin: 3px" v-if="checkEdit('places')">
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
        @rowSelect="onRowSelect($event)"
        @rowDblClick="onRowDblClick($event)"
      >
        <GridColumn field="code"></GridColumn>
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
    this.fillPlaces(null);
  },
  methods: {
    async fillPlaces(filter) {
      let params = { is_point: "True", limit: 20 };
      if (filter) params["search"] = filter;
      const lines = await getData(this, "place/", params);
      this.list_data = lines.results;
    },
    async doFilter(value) {
      this.fillPlaces(value);
    },
    onRowSelect(event) {
      this.$store.commit("setPlaceId", event.pk);
    },
    onRowDblClick(event) {
      this.$store.commit("setPlaceId", event.pk);
      this.submitFormAdd();
    },
    async submitFormAdd() {
      // Добавление нового элемента маршрута
      let new_item = {
        route: this.$store.getters.getRouteId,
        place: this.$store.getters.getPlaceId,
        // order_num: 1,
      };
      this.$store
        .dispatch("postData", {
          inc_url: "routepoint",
          params: new_item,
        })
        .then(
          (response) => this.$root.$emit("reloadBranch") // Вызов метода обновления ветки в другом компоненте
        );
    },
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>
