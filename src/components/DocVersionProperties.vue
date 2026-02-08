<template>
  <div>
    <Form
      :model="prop_values"
      :labelWidth="200"
      labelAlign="right"
      style="max-width: 800px"
    >
      <FormField :key="1" name="version_num" label="Номер версии">
        <NumberBox
          v-model="prop_values['version_num']"
          :precision="0"
        ></NumberBox>
      </FormField>
      <FormField
        :key="2"
        name="button_save"
        v-if="checkEdit('docversionproperties')"
      >
        <LinkButton
          iconCls="icon-save"
          style="margin: 5px"
          @click="submitFormSave()"
          >Сохранить</LinkButton
        >
        <LinkButton
          iconCls="icon-no"
          style="margin: 5px"
          @click="submitFormDelete()"
          >Удалить</LinkButton
        >
      </FormField>
    </Form>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { mapState } from "vuex";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      prop_values: {
        version_num: null,
        doc_code: null,
        id: null,
      }, // Информация о версии документа
      // parent_code: "", // Обозначение родителя
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    async loadProperties() {
      if (this.selected_id) {
        this.loading = true;
        const url = `documentversion/${this.selected_id}`;
        this.prop_values = await getData(this, url);
        this.loading = false;
      } else
        this.prop_values = {
          version_num: null,
          doc_code: null,
          id: null,
        };
    },
    submitFormSave() {
      this.$store.dispatch("patchData", {
        inc_url: "documentversion",
        id: this.selected_id,
        params: this.prop_values,
      });
    },
    async submitFormDelete() {
      this.$messager.confirm({
        title: "Подтверждение удаления",
        msg: "Вы уверены, что удаление необходимо?",
        result: (answer) => {
          if (answer) {
            this.$store.dispatch("deleteData", {
              inc_url: "documentversion",
              id: this.selected_id,
            });
          }
        },
      });
    },
  },
  watch: {
    selected_id() {
      this.loadProperties();
    },
  },
  mounted() {
    if (this.selected_id) this.loadProperties(); // На случай, если объект уже указан
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>