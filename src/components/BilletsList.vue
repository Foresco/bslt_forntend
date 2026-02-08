<template>
  <div>
    <div>
      <Form
        :model="new_billet"
        :labelWidth="200"
        labelAlign="right"
        style="max-width: 800px"
        v-if="checkEdit('billetslist')"
      >
        <FormField :key="1" name="arc_doc" label="Материала заготовки">
          <ComboBox
            v-model="new_billet.parent"
            :data="materials"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getMaterials($event)"
          ></ComboBox>
        </FormField>
        <FormField :key="2" name="billet_name" label="Наименование заготовки">
          <TextBox v-model="new_billet.billet_name"></TextBox>
        </FormField>
        <FormField :key="3" name="is_active" label="Активность заготовки">
          <SwitchButton
            v-model="new_billet.is_active"
            title="Активная"
          ></SwitchButton
        ></FormField>
        <FormField :key="4" name="billet_size" label="Размер заготовки">
          <TextBox v-model="new_billet.billet_size"></TextBox>
        </FormField>
        <FormField :key="5" name="alt_size" label="Альтернативный размер">
          <TextBox v-model="new_billet.alt_size"></TextBox>
        </FormField>
        <FormField
          :key="6"
          name="object_quantity"
          label="Количество деталей в заготовке"
        >
          <NumberBox
            v-model="new_billet.object_quantity"
            :precision="0"
            :min="1"
          ></NumberBox>
        </FormField>
        <FormField :key="7" name="weight" label="Черный вес заготовки">
          <NumberBox
            v-model="new_billet.weight"
            :precision="-1"
            title="Черный вес"
          ></NumberBox>
        </FormField>
        <FormField :key="8" name="quantity" label="Норма расхода">
          <NumberBox v-model="new_billet.quantity" :precision="-1"></NumberBox>
        </FormField>
        <FormField :key="9" name="not_count" label="Не учитывать в расчетах">
          <SwitchButton v-model="new_billet.not_count"></SwitchButton
        ></FormField>
        <FormField>
          <LinkButton iconCls="icon-add" @click="onAddClick" style="margin: 5px" v-show ="regime == 'create'"
            >Добавить</LinkButton
          >
          <LinkButton iconCls="icon-save" @click="onSaveClick" style="margin: 5px" v-show="regime == 'edit'"
            >Сохранить</LinkButton
          >
        </FormField>
      </Form>
    </div>
    <div>
      <DataGrid
        :data="list_data"
        :columnResizing="true"
        @rowDblClick="onRowDblClick($event)"
        selectionMode="single"
        @rowSelect="onRowSelect($event)"
      >
        <GridColumn
          field="billet_name"
          title="Наименование"
          width="150"
        ></GridColumn>
        <GridColumn field="parent" title="Материал">
          <template slot="body" slot-scope="scope">
            <a :href="scope.row.url" target="_blank">{{ scope.row.parent }}</a>
          </template>
        </GridColumn>
        <GridColumn field="quantity_u" title="Норма расхода"></GridColumn>
        <GridColumn field="edit" width="35" v-if="checkEdit('billetslist')">
          <template slot="body" slot-scope="scope">
            <LinkButton
              iconCls="icon-edit"
              @click="onEditClick(scope)"
              title="Редактировать заготовку"
            ></LinkButton>
          </template>
        </GridColumn>
      </DataGrid>
      <div class="buttons_bar" v-if="checkEdit('billetslist')">
        <LinkButton v-show="link_id" iconCls="icon-no" @click="onDeleteClick()"
          >Удалить</LinkButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { mapState } from "vuex";
import { getSuggest } from "@/api/utils";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
      new_billet: {
        // Информация о новой заготовке
        parent: null,
        billet_name: "Основная",
        is_active: true,
        billet_size: null,
        alt_size: null,
        object_quantity: 1,
        weight: null,
        quantity: null,
        unit: null,
        not_count: false,
      },
      materials: [], // Список материалов
      link_id: null, // Идентификатор выбранной строки
      regime: "create", // Режим работы формы
    };
  },
  computed: mapState(["root_id"]),
  methods: {
    parseRow(row_node) {
      row_node.url = `/${row_node.parent_id}/`;
      row_node.quantity_u = `${row_node.quantity} ${row_node.measurement}`;
      row_node.weight_u = `${row_node.weight} ${row_node.measurement}`;
      return row_node;
    },
    async loadListData() {
      this.list_data = [];
      if (this.root_id) {
        let params = { child: this.root_id };
        this.loading = true;
        const url = "billet/";
        const res = await getData(this, url, params);
        this.list_data = res.map(this.parseRow);
        this.loading = false;
      }
      this.link_id = null;
    },
    onRowSelect(event) {
      // Отработка клика по строке списка (таблицы)
      this.link_id = event.pk;
    },
    async getMaterials(event) {
      // Получение списка материалов
      this.materials = await getSuggest(this, "partobject", event.filterValue);
    },
    onAddClick() {
      this.new_billet["child"] = this.root_id;
      this.$store
        .dispatch("postData", {
          inc_url: "billet",
          params: this.new_billet,
        })
        .then(() => this.loadListData());
    },
    onEditClick(scope) {
      this.link_id = scope.row.pk;
      this.new_billet.parent = scope.row.parent;
      this.new_billet.billet_name = scope.row.billet_name;
      this.new_billet.is_active = scope.row.is_active;
      this.new_billet.billet_size = scope.row.billet_size;
      this.new_billet.alt_size = scope.row.alt_size;
      this.new_billet.object_quantity = scope.row.object_quantity;
      this.new_billet.weight = scope.row.weight;
      this.new_billet.quantity = scope.row.quantity;
      this.new_billet.unit = scope.row.unit;
      this.new_billet.not_count = scope.row.not_count;
      // Поля со списками подстановки
      this.materials = [{ pk: scope.row.parent_id, value: scope.row.parent }];

      this.regime = "edit";
    },
    onSaveClick() {
      this.$store
        .dispatch("patchData", {
          inc_url: "billet",
          id: this.link_id,
          params: this.new_billet,
        })
        // Обновление списка извещений
        .then(() => this.loadNoticeLinks());
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event["arc_doc_id"]}/`);
    },
    onDeleteClick() {
      // Удаляем отмеченную строку
      this.$store
        .dispatch("deleteData", {
          inc_url: "billet",
          id: this.link_id,
        })
        // Обновление списка
        .then(() => this.loadListData());
    },
  },
  watch: {
    root_id() {
      this.loadListData();
    },
  },
  mounted() {
    if (this.root_id) this.loadListData(); // На случай, если объект уже указан
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>
