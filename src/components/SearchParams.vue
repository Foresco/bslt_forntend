<template>
  <Form :model="search_params" :labelWidth="0">
    <FormField :key="1" name="part_type">
      <ComboBox
        placeholder="Тип"
        v-model="search_params.part_type"
        :data="part_types"
        valueField="pk"
        textField="value"
      ></ComboBox>
    </FormField>
    <FormField :key="2" name="parent">
      <ComboBox
        placeholder="Входит в"
        v-model="search_params.parent"
        :data="parents"
        valueField="pk"
        textField="value"
        :lazy="true"
        @filterChange="getParent($event)"
      ></ComboBox>
    </FormField>
    <FormField :key="3" name="title">
      <TextBox
        placeholder="Наименование"
        v-model="search_params.title"
      ></TextBox>
    </FormField>
    <FormField :key="4" name="design_mater">
      <ComboBox
        placeholder="Изготавливается из"
        v-model="search_params.design_mater"
        :data="design_maters"
        valueField="pk"
        textField="value"
        :lazy="true"
        @filterChange="getDesignMater($event)"
      ></ComboBox>
    </FormField>
  </Form>
</template>

<script>
import { getSuggest } from "@/api/utils";

export default {
  data() {
    return {
      search_params: {
        design_mater: null,
        parent: null,
        part_type: null,
        title: null,
      },
      part_types: null,
      design_maters: null,
      parents: null,
    };
  },
  methods: {
    async getPartTypes() {
      // Получение списка подстановки для поля Тип
      this.part_types = await getSuggest(this, "parttype");
    },
    async getParent(event) {
      this.parents = await getSuggest(this, "partobject", event.filterValue, {
        part_type: "assembly",
      });
    },
    async getDesignMater(event) {
      this.design_maters = await getSuggest(
        this,
        "partobject",
        event.filterValue,
        {
          part_type: "exemplar",
        }
      );
    },
  },
  created() {
    if (this.selected_id) this.fillForm();
  },
  mounted() {
    this.getPartTypes();
  },
};
</script>