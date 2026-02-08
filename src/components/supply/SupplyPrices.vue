<template>
  <div>
    <Form :model="new_value" :labelWidth="0" v-if="checkEdit('supplyprices')">
      <FormField :key="1" name="price">
        <ComboBox
          placeholder="Поставщик"
          v-model="new_value.supplier"
          :data="suppliers"
          valueField="pk"
          textField="value"
          :lazy="true"
          @filterChange="getSupplier($event)"
        ></ComboBox>
        <ComboBox
          placeholder="Тип цены"
          v-model="new_value.price_type"
          :data="price_types"
          valueField="pk"
          textField="list_value"
        ></ComboBox>
        <NumberBox
          v-model="new_value.price"
          placeholder="Цена"
          style="width: 70px"
        ></NumberBox>
      </FormField>
      <div class="buttons_bar">
        <LinkButton iconCls="icon-add" @click="onAddClick">Добавить</LinkButton>
      </div>
    </Form>
    <div>
      <DataGrid
        :data="list_data"
        :columnResizing="true"
        selectionMode="single"
        @rowSelect="onRowSelect($event)"
      >
        <GridColumn field="supplier" title="Поставщик"></GridColumn>
        <GridColumn field="price_type" title="Тип цены"></GridColumn>
        <GridColumn field="price" title="Цена" width="80px"></GridColumn>
        <GridColumn field="price_unit" title="ЕИ" width="60px"></GridColumn>
      </DataGrid>
    </div>
    <div
      class="buttons_bar"
      v-if="checkEdit('supplyprices')"
      v-show="selected_id"
    >
      <LinkButton iconCls="icon-no" @click="onDeleteClick()"
        >Удалить</LinkButton
      >
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { mapState } from "vuex";
import { getListValues, getCodes } from "@/api/utils";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
      new_value: {
        supplier: null,
        supplied_entity: null,
        price_type: null,
        price: null,
        price_unit: null,
      }, // Информация о новом значении цены
      price_types: [], // Список типов цен
      used_price_types: [], // Список уже использованных типов цен
      suppliers: [], // Список поставщиков
      price_id: null, // Идентификатор выбранноq цены
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    parseRow(row_node) {
      if (row_node.price_type)
        this.used_price_types.push(row_node.price_type.pk); // Использованный тип
      return {
        pk: row_node.pk,
        supplier: row_node.supplier,
        price_type: row_node.price_type ? row_node.price_type.list_value : "",
        price: row_node.price,
        price_unit: row_node.price_unit.value,
      };
    },
    filterTypes(response) {
      // Удаление использованных типов цен
      return response.filter((el) => !this.used_price_types.includes(el.pk));
    },
    async loadListData() {
      this.list_data = [];
      this.price_types = [];
      this.used_price_types = [];
      if (this.selected_id) {
        this.loading = true;
        const res = await getData(this, "price/", {
          supplied_entity: this.selected_id,
        });
        this.list_data = res.map(this.parseRow);
        // Получаем список типов цен
        const pt = await getListValues(this, "pricetype");
        this.price_types = this.filterTypes(pt);
      }
      this.loading = false;
    },
    getSupplier(event) {
      getCodes(this, event.filterValue, "place", { is_supplier: "True" }).then(
        (response) => (this.suppliers = response)
      );
    },
    onRowSelect(event) {
      this.price_id = event.pk;
    },
    onAddClick() {
      this.new_value["supplied_entity"] = this.selected_id;
      this.$store
        .dispatch("postData", {
          inc_url: "price",
          params: this.new_value,
        })
        // Обновление списка
        .then(() => this.loadListData());
    },
    onDeleteClick() {
      // Удаляем отмеченную строку
      this.$store
        .dispatch("deleteData", {
          inc_url: "price",
          id: this.price_id,
        })
        .then(() => this.loadListData());
    },
  },
  watch: {
    selected_id() {
      this.loadListData();
    },
  },
  mounted() {
    if (this.selected_id) this.loadListData(); // На случай, если объект уже указан
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>