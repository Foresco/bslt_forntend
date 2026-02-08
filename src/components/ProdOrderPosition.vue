<template>
  <div>
    <Form
      :model="prop_values"
      labelWidth="150px"
      labelAlign="right"
      style="max-width: 800px"
    >
      <FormField key="1" name="quantity_states" label="Количество/ М / И">
        <NumberBox
          v-model="prop_values.quantity"
          :precision="0"
          :min="0"
          :groupSeparator="' '"
          title="Количество в составе"
        ></NumberBox>
        <ComboBox
          v-model="prop_values.mater_state"
          :data="states"
          valueField="pk"
          textField="list_value"
          title="Состояние поставки материала"
        ></ComboBox>
        <ComboBox
          v-model="prop_values.tool_state"
          :data="states"
          valueField="pk"
          textField="list_value"
          title="Состояние поставки инструмента"
        ></ComboBox>
      </FormField>
      <FormField key="2" name="prices" label="Цена без НДС/ КД">
      <NumberBox
          v-model="prop_values.price_no_nds"
          :precision="0"
          :min="0"
          :groupSeparator="' '"
          title="Цена без НДС"
        ></NumberBox>
        <ComboBox
          v-model="prop_values.design_doc"
          :data="design_doc_states"
          valueField="pk"
          textField="list_value"
          title="Конструкторская документация"
        ></ComboBox>
      </FormField>
      <FormField key="4" name="comment" label="Примечание">
        <TextBox
          v-model="prop_values.comment"
          :multiline="true"
          style="height: 30px"
        ></TextBox>
      </FormField>
      <FormField key="5" name="billet_desc" label="Заготовка">
        <TextBox
          v-model="prop_values.billet_desc"
          :multiline="true"
          style="height: 30px"
        ></TextBox>
      </FormField>
      <FormField v-if="checkEdit('prodorderposition')">
        <LinkButton
          iconCls="icon-save"
          style="margin: 5px"
          @click="submitFormSave()"
          >Сохранить</LinkButton
        >
      </FormField>
    </Form>
    <picture-panel></picture-panel>
    <files-list></files-list>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getPropValues, getListValues } from "@/api/utils";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования
import PicturePanel from "@/components/PicturePanel.vue";
import FilesList from "@/components/FilesList.vue";

export default {
  mixins: [editable_component],
  components: {
    PicturePanel,
    FilesList,
  },
  data() {
    return {
      prop_values: {}, // Словарь со значениями свойств
      states: [], // Варианты значений состояний
      design_doc_states: [], // Варианты значений состояний КД
    };
  },
  computed: mapState(["link_id"]),
  mounted() {
    // Получение списка подстановки для полей Состояние
    getListValues(this, "supplystate").then(
      (response) => (this.states = response)
    );
    // Получение списка подстановки для полей Состояние КД
    getListValues(this, "supplystate").then(
      (response) => (this.design_doc_states = response)
    );
  },
  methods: {
    submitFormSave() {
      this.$store
        .dispatch("patchData", {
          inc_url: "prodorderlink",
          id: this.link_id,
          params: this.prop_values,
        })
        .then(() =>
          // Выставляем флаг необходимости перезагрузки списка
          this.$store.commit("setListReloadNeeded", true)
        );
    },
  },
  watch: {
    link_id() {
      if (this.link_id) {
        // Получаем свойства текущей связи
        getPropValues(this, "prodorderlink", this.link_id).then(
          (response) => (this.prop_values = response)
        );
      } else this.prop_values = {};
    },
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>