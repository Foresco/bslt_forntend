<template>
  <div>
    <form style="margin: 3px" v-if="checkEdit('prodorderposassign')">
      <ComboBox
        placeholder="Исполнитель"
        v-model="new_link.worker"
        style="width: 190px"
        :data="workers"
        valueField="pk"
        textField="value"
        :lazy="true"
        @filterChange="getWorkers($event)"
      ></ComboBox>
      <NumberBox
        placeholder="Кол-во"
        v-model="new_link.quantity"
        style="width: 80px"
      ></NumberBox>
      <LinkButton
        iconCls="icon-add"
        style="margin-left: 10px"
        v-show="this.operation_id"
        @click="submitFormAdd()"
        >Добавить</LinkButton
      >
    </form>
    <div>
      <DataGrid
        :data="data"
        :columnResizing="true"
        :clickToEdit="true"
        editMode="row"
      >
        <GridColumn field="сk" :width="50" align="center">
          <template slot="body" slot-scope="scope">
            <CheckBox v-model="scope.row.selected"></CheckBox>
          </template>
        </GridColumn>
        <GridColumn field="worker" title="Исполнитель"></GridColumn>
        <GridColumn field="quantity" title="Кол-во" width="70" :editable="true">
          <template slot="edit" slot-scope="scope">
            <NumberBox
              v-model="scope.row.quantity"
              :precision="0"
              :min="0"
              @blur="markEdited(scope.row)"
            ></NumberBox>
          </template>
        </GridColumn>
      </DataGrid>
    </div>
    <div
      class="buttons_bar"
      v-if="checkEdit('prodorderposassign')"
      v-show="this.operation_id"
    >
      <LinkButton iconCls="icon-save" @click="onSaveClick"
        >Сохранить</LinkButton
      >
      <LinkButton
        iconCls="icon-no"
        style="margin: 10px"
        @click="onDeleteClick()"
        >Удалить</LinkButton
      >
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { mapState } from "vuex";
import { getSuggest } from "@/api/utils";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  name: "ProdOrderPosAssign",
  mixins: [editable_component],
  data() {
    return {
      data: [], // Собранные и сформированные данные для грида групп пользователя
      new_link: {
        worker: null,
        comment: null,
        quantity: null,
      }, // Информация о новой строке
      workers: [], // Список исполнителей для подстановки
    };
  },
  computed: mapState(["link_id", "operation_id"]),
  methods: {
    async loadPosWorkersList() {
      // Загрузка перечня исполнителей для выбранной позиции заказа
      const parseRow = (row_node) => {
        let res_node = { selected: false };
        res_node["quantity"] = row_node["quantity"];
        res_node["pk"] = row_node["pk"];
        const worker = row_node["worker"];
        res_node["worker"] = worker["user_name"];
        return res_node;
      };
      if (this.link_id && this.operation_id) {
        const url = `prodorderlinkworker/`;
        const res = await getData(this, url, {
          prod_order_link: this.link_id,
          tp_row: this.operation_id,
        });
        this.data = res.results.map(parseRow);
      } else this.data = [];
    },
    markEdited(row) {
      // Попытка автоотметки галочки
      // console.log(pk);
      row.selected = true;
    },
    submitFormAdd() {
      this.new_link["prod_order_link"] = this.link_id;
      this.new_link["tp_row"] = this.operation_id;
      // Добавление задания исполнителю
      this.$store
        .dispatch("postData", {
          inc_url: "prodorderlinkworker",
          params: this.new_link,
        })
        // Обновление дерева состава заказа
        .then(() => this.loadPosWorkersList());
    },
    onSaveClick() {
      // Сохраняем отмеченные строки
      let updated_rows = [];
      for (const q of this.data.filter((row) => row.selected)) {
        updated_rows.push({
          id: q.pk,
          params: {
            quantity: q.quantity,
          },
        });
      }
      this.$store
        .dispatch("patchDataMany", {
          inc_url: "prodorderlinkworker",
          rows: updated_rows,
        })
        // Обновление дерева состава заказа
        .then(() => this.loadPosWorkersList());
    },
    onDeleteClick() {
      // Удаляем отмеченные строки
      let deleted_rows = [];
      for (const q of this.data.filter((row) => row.selected)) {
        deleted_rows.push(q.pk);
      }
      this.$store
        .dispatch("deleteDataMany", {
          inc_url: "prodorderlinkworker",
          ids: deleted_rows,
        })
        // Обновление дерева состава заказа
        .then(() => this.loadPosWorkersList());
    },
    async getWorkers(event) {
      let params = {};
      // Получение списка подстановки для поля Исполнитель
      this.workers = await getSuggest(
        this,
        "userprofile",
        event.filterValue,
        params
      );
    },
  },
  watch: {
    link_id() {
      // Формируем грид исполнителей
      this.loadPosWorkersList();
    },
    operation_id() {
      // Формируем грид исполнителей
      this.loadPosWorkersList();
    },
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>