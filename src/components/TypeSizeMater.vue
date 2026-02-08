<template>
  <div>
    <Form
      :model="values"
      :labelWidth="120"
      labelAlign="right"
      style="max-width: 500px"
      v-if="checkEdit('typesizemater')"
    >
      <FormField :key="1" label="Материал">
        <ComboBox
          v-model="values.parent"
          valueField="pk"
          textField="value"
          :data="material"
          :lazy="true"
          @filterChange="onFilterChangeMaterial($event)"
        ></ComboBox>
      </FormField>
      <FormField>
        <LinkButton
          iconCls="icon-save"
          style="margin: 10px"
          @click="submitFormSave()"
          >Сохранить</LinkButton
        >
      </FormField>
    </Form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getData } from "@/api/api";
import { getSuggest } from "@/api/utils";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      material: null, // Набор данных для выбора материала
      pk: null, // Идентификатор записи
      values: {
        child: null,
        parent: null,
      }, // Параметры экземпляра материала
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    clearForm() {
      // Очистка формы
      this.pk = null;
      this.values.parent = null;
      this.material = null;
    },
    async fillForm() {
      if (this.selected_id) {
        // Получаем свойства экземпляра материала
        const params = { child: this.selected_id };
        const ts = await getData(this, `typesizemater/`, params);
        if (ts.count > 0) {
          const props = ts.results[0]; // Теоретически может прийти несколько строк
          this.pk = props.pk;
          this.values.parent = props.parent.pk;
          this.material = [props.parent];
        } else {
          // Если нет экземпляра материала
          this.clearForm();
        }
      } else this.clearForm();
    },
    async onFilterChangeMaterial(event) {
      this.material = await getSuggest(this, "partobject", event.filterValue, {
        part_type: "material",
      });
    },
    async submitFormSave() {
      this.values.child = this.selected_id; // Ссылка на экземпляр
      if (this.pk) {
        // Если запись уже существует - обновляем данные
        this.$store.dispatch("patchData", {
          inc_url: "typesizemater",
          id: this.pk,
          params: this.values,
        });
      } else {
        this.$store.dispatch("postData", {
          inc_url: "typesizemater",
          params: this.values,
        });
      }
    },
  },
  created() {
    if (this.selected_id) this.fillForm();
  },
  watch: {
    selected_id() {
      this.fillForm();
    },
  },
};
</script>
