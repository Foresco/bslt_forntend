<template>
  <div>
    <div>
      <DataGrid
        :data="list_data"
        :columnResizing="true"
        selectionMode="single"
        @rowSelect="onRowSelect($event)"
        @rowDblClick="onRowDblClick($event)"
      >
        <GridColumn field="сk" :width="25" align="center">
          <template slot="body" slot-scope="scope">
            <CheckBox v-model="scope.row.selected"></CheckBox>
          </template>
        </GridColumn>
        <GridColumn field="parent_code" title="Заказ " width="100">
        </GridColumn>
        <GridColumn field="child" title="Объект" width="200"></GridColumn>
        <GridColumn field="quantity" title="Кол-во" width="55"></GridColumn>
        <GridColumn
          title="М"
          width="25"
          :cellCss="getIconM"
          align="center"
        ></GridColumn>
        <GridColumn field="mater_code" title="Материал"></GridColumn>
        <GridColumn
          field="surface"
          title="Габариты обработка"
          width="125"
        ></GridColumn>
        <GridColumn
          field="billet_desc"
          title="Заготовка"
          width="150"
        ></GridColumn>
      </DataGrid>
    </div>
    <div
      class="buttons_bar"
      v-if="checkEdit('orderprodposlist')"
    >
      <LinkButton iconCls="icon-no" @click="onDeleteClick()"
        >Удалить</LinkButton
      >
      <ComboBox
        v-model="mater_state"
        :data="states"
        valueField="pk"
        textField="list_value"
        title="Состояние поставки материала"
        style="margin-left: 50px"
      ></ComboBox>
      <LinkButton
        iconCls="icon-save"
        @click="onSetClick()"
        style="margin-left: 5px"
        >Установить</LinkButton
      >
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { getListValues } from "@/api/utils";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования
import { mapState } from "vuex";
import { getIconM } from "@/components/prod/common.js";

export default {
  mixins: [editable_component],
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
      states: [], // Варианты значений состояний
      mater_state: 2, // Состояние поставки материала
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    getIconM,
    async LoadListData() {
      const parseRow = (row_node) => {
        row_node["child"] =
          row_node["child_code"] +
          (row_node["child_title"] ? " " + row_node["child_title"] : "");
        row_node.selected = false;
        return row_node;
      };
      this.list_data = []; // Очистка списка
      if (this.selected_id) {
        this.loading = true;
        const res = await getData(this, "orderprodposition/", {
          supply_order: this.selected_id,
        });
        this.list_data = res.map(parseRow);
        this.loading = false;
      }
    },
    onRowSelect(event) {
      this.mater_state = event.mater_state_id;
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event.child_id}/`);
    },
    onDeleteClick() {
      // Удаляем отмеченные строки
      let deleted_rows = [];
      for (const q of this.list_data.filter((row) => row.selected)) {
        deleted_rows.push(q.pk);
      }
      this.$store
        .dispatch("deleteDataMany", {
          inc_url: "orderprodposition",
          ids: deleted_rows,
        })
        // Обновление списка
        .then(() => this.LoadListData());
    },
    onSetClick() {
      // Сохраняем отмеченные строки
      let updated_rows = [];
      for (const q of this.list_data.filter((row) => row.selected)) {
        updated_rows.push({
          id: q.prod_order_link_id,
          params: {
            mater_state: this.mater_state,
          },
        });
      }
      this.$store
        .dispatch("patchDataMany", {
          inc_url: "prodorderlink",
          rows: updated_rows,
        })
        // Обновление списка
        .then(() => this.LoadListData());
    },
  },
  watch: {
    selected_id() {
      this.LoadListData();
    },
  },
  mounted() {
    if (this.selected_id) this.LoadListData();
    // Получение списка подстановки для поля Состояние поставки материала
    getListValues(this, "supplystate").then(
      (response) => (this.states = response)
    );
  },
};
</script>

<style>
.buttons_bar {
  margin-left: 5px;
}
</style>
