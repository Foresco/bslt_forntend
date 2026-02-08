<template>
  <div>
    <div>
      <DataGrid
        :data="list_data"
        :columnResizing="true"
        :clickToEdit="true"
        :rowCss="getRowCss"
        selectionMode="cell"
        editMode="cell"
      >
        <GridColumn field="сk" width="30" align="center">
          <template slot="body" slot-scope="scope">
            <CheckBox v-model="scope.row.selected"></CheckBox>
          </template>
        </GridColumn>
        <GridColumn field="route_point_order_num" width="12"> </GridColumn>
        <GridColumn field="place_code" title="Подразделение"> </GridColumn>
        <GridColumn field="tp_row_order_num" width="12"> </GridColumn>
        <GridColumn field="operation_name" title="Операция"></GridColumn>
        <GridColumn field="worker_name" title="Работник"></GridColumn>
        <GridColumn
          field="report_date"
          :cellCss="getGrayColour"
          title="Дата"
          width="70"
        ></GridColumn>
        <GridColumn
          field="done_quantity"
          title="Сделано"
          width="65"
          :editable="true"
          ><template slot="edit" slot-scope="scope">
            <NumberBox v-model="scope.row.done_quantity"></NumberBox>
          </template>
        </GridColumn>
        <GridColumn
          v-if="show_extra"
          field="bad_quantity"
          title="Брак"
          width="60"
          :editable="true"
          ><template slot="edit" slot-scope="scope">
            <NumberBox v-model="scope.row.bad_quantity"></NumberBox> </template
        ></GridColumn>
        <GridColumn
          v-if="show_extra"
          field="comment"
          title="Комментарий"
          width="150"
          ><template slot="body" slot-scope="scope">
            <span v-Tooltip="scope.row.comment">{{ scope.row.comment }}</span>
          </template>
        </GridColumn>
      </DataGrid>
    </div>
    <div class="buttons_bar">
      <LinkButton
        iconCls="icon-save"
        style="margin-left: 10px"
        @click="onSaveClick()"
        >Сохранить</LinkButton
      >
      <LinkButton
        iconCls="icon-no"
        style="margin-left: 10px"
        @click="onDeleteClick()"
        >Удалить</LinkButton
      >
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
  props: {
    show_extra: {
      // Признак отображения дополнительных столбцов
      type: Boolean,
      default: false,
    },
  },
  computed: mapState(["sub_selected_id", "link_id", "row_id"]),
  methods: {
    getGrayColour(row) {
      // Делаем фон ячейки серым для второй смены
      if (row.shift_num > 1) return "greybg";
    },
    getRowCss(row) {
      if (row.pk == this.row_id) {
        return "highlighted";;
      }
      return null;
    },
    async loadListData() {
      this.list_data = []; // Очистка списка
      if (this.link_id) {
        const url = `prodorderposreport/${this.link_id}`;
        this.loading = true;
        this.list_data = await getData(this, url);
        this.loading = false;
      }
    },
    onSaveClick() {
      // Сохраняем отмеченные строки
      let updated_rows = [];
      for (const q of this.list_data.filter((row) => row.selected)) {
        updated_rows.push({
          id: q.pk,
          params: {
            quantity: q.done_quantity,
            bad_quantity: q.bad_quantity,
          },
        });
      }
      this.$store
        .dispatch("patchDataMany", {
          inc_url: "workerreport",
          rows: updated_rows,
        })
        // Обновление списка
        .then(() => this.loadListData());
    },
    onDeleteClick() {
      // Удаляем отмеченные строки
      let deleted_rows = [];
      for (const q of this.list_data.filter((row) => row.selected)) {
        deleted_rows.push(q.pk);
      }
      this.$store
        .dispatch("deleteDataMany", {
          inc_url: "workerreport",
          ids: deleted_rows,
        })
        // Обновление дерева состава заказа
        .then(() => this.loadListData())
        // Выставляем флаг необходимости перезагрузки списка заказов
        .then(() => this.$store.commit("setListReloadNeeded"));
    },
  },
  watch: {
    row_id() {
      this.loadListData();
    },
    link_id() {
      this.loadListData();
    },
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}

.highlighted {
  background-color: #ffdfd7;
}
</style>