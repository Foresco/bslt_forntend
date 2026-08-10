<template>
  <div>
    <form style="margin: 3px" v-if="checkEdit('semisquantity')">
      <ComboBox
        v-model="new_semis.route_point"
        style="width: 190px"
        :data="routepoints"
        valueField="pk"
        textField="value"
      ></ComboBox>
      <TextBox
        placeholder="Партия"
        v-model="new_semis.party"
        style="width: 80px"
      ></TextBox>
      <NumberBox
        placeholder="Кол-во"
        v-model="new_semis.quantity"
        style="width: 80px"
      ></NumberBox>
      <LinkButton
        iconCls="icon-add"
        style="margin-left: 10px"
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
        <GridColumn field="place" title="Участок"></GridColumn>
        <GridColumn field="party" title="Партия"></GridColumn>
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
    <div class="buttons_bar" v-if="checkEdit('semisquantity')">
      <LinkButton iconCls="icon-save" @click="onSaveClick"
        >Сохранить</LinkButton
      >
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { mapState } from "vuex";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  name: "SemisQuantity",
  mixins: [editable_component],
  data() {
    return {
      data: [], // Собранные и сформированные данные для грида
      new_semis: {
        route_point: null,
        party: null,
        quantity: null,
      }, // Информация о новой строке
      routepoints: [], // Список элементов маршрута
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    async loadSemisList() {
      // Загрузка перечня полуфабрикатов для выбранного заказа
      const parseRow = (row_node) => {
        row_node["selected"] = false;
        // Добавление элемента маршрута в список
        if (
          this.routepoints.find(
            (routepoint) => routepoint.pk === row_node["route_point_pk"]
          )
        )
          return row_node;
        this.routepoints.push({
          pk: row_node["route_point_pk"],
          value: row_node["place"],
        });
        return row_node;
      };
      if (this.selected_id) {
        const url = `semisquantity/`;
        const res = await getData(this, url, {
          subject: this.selected_id,
        });
        this.data = res.map(parseRow);
      } else this.data = [];
    },
    markEdited(row) {
      // Попытка автоотметки галочки
      // console.log(pk);
      row.selected = true;
    },
    submitFormAdd() {
      // Добавление количества полуфабриката
      this.$store
        .dispatch("postData", {
          inc_url: "semisquantity",
          params: this.new_semis,
        })
        // Обновление списка полуфабрикатов
        .then(() => this.loadSemisList());
    },
    onSaveClick() {
      // Сохраняем отмеченные строки
      let updated_rows = []; // Отредактированные строки
      let created_rows = []; // Добавляемые строки
      for (const q of this.data.filter((row) => row.selected)) {
        // Если учетной записи нет (pk = null), то это добавляемая строка
        if (q.pk == null)
          created_rows.push({
            route_point: q.route_point_pk,
            quantity: q.quantity,
          });
        else
          updated_rows.push({
            id: q.pk,
            params: {
              quantity: q.quantity,
            },
          });
      }
      // Добавлем строки
      this.$store
        .dispatch("postDataMany", {
          inc_url: "semisquantity/",
          rows: created_rows,
        })
        .then(
          // Редактируем строки
          this.$store.dispatch("patchDataMany", {
          inc_url: "semisquantity",
          rows: updated_rows,
        })
        // Обновление списка полуфабрикатов
        .then(() => this.loadSemisList()
        ));
    },
  },
  watch: {
    selected_id() {
      this.loadSemisList();
    },
  },
  mounted() {
    if (this.selected_id) this.loadSemisList(); // На случай, если объект уже указан
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>