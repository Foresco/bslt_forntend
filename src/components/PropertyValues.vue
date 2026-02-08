<template>
  <div>
    <Form :model="new_value" :labelWidth="0" v-if="checkEdit('propertyvalues')">
      <FormField :key="1" name="role">
        <ComboBox
          placeholder="Свойство"
          style="width: 150px"
          v-model="new_value.property"
          :data="properties"
          valueField="pk"
          textField="value"
          :lazy="true"
          @filterChange="getProperties($event)"
        ></ComboBox>
        <TextBox v-model="new_value.value"></TextBox>
      </FormField>
      <div class="buttons_bar">
        <LinkButton iconCls="icon-add" @click="onAddClick">Добавить</LinkButton>
      </div>
    </Form>
    <div>
      <DataGrid :data="list_data" :columnResizing="true">
        <GridColumn field="property" title="Свойство"></GridColumn>
        <GridColumn field="value" title="Значение"></GridColumn>
        <GridColumn field="unit" title="ЕИ" width="80px"></GridColumn>
      </DataGrid>
    </div>
    <div class="buttons_bar"  v-if="checkEdit('propertyvalues')">
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
  mixins: [editable_component],
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
      new_value: {
        parent: null,
        property: null,
        value: null,
      }, // Информация о новом значении свойства
      properties: [], // Список свойств
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    parseRow(row_node) {
      let tmp_node = {
        pk: row_node.pk,
        property: row_node.property,
      };
      if (row_node.value) {
        tmp_node.value = row_node.value;
      } else if (row_node.value_min) {
        tmp_node.value = row_node.value_min;
        if (row_node.value_max) {
          tmp_node.value = tmp_node.value + " - " + row_node.value_max;
        }
      }
      tmp_node.unit = row_node.unit;
      return tmp_node;
    },
    async getProperties(event) {
      // Получение списка подстановки для поля Свойство
      this.properties = await getSuggest(this, "property", event.filterValue);
    },
    async loadPropertyValues() {
      // this.list_data = []; // Очистка списка
      let params = { entity: this.selected_id };
      this.loading = true;
      const url = "propertyvalue/";
      const res = await getData(this, url, params);

      this.list_data = res.results.map(this.parseRow);

      this.loading = false;
    },
    onAddClick() {
      this.new_value["entity"] = this.$store.getters.getSelectedId;
      this.$store
        .dispatch("postData", {
          inc_url: "propertyvalue",
          params: this.new_value,
        })
        // Обновление списка
        .then(() => this.loadPropertyValues());
    },
  },
  watch: {
    selected_id(newValue, oldValue) {
      this.loadPropertyValues();
    },
  },
  mounted() {
    if (this.selected_id) this.loadPropertyValues(); // На случай, если объект уже указан
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>