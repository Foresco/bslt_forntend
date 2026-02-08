<template>
  <div>
    <Form
      :model="values"
      :labelWidth="120"
      labelAlign="right"
      style="max-width: 500px"
      v-if="checkEdit('typesizesort')"
    >
      <FormField :key="1" label="Сортамент">
        <ComboBox
          v-model="values.parent"
          valueField="pk"
          textField="value"
          :data="sortament"
          :lazy="true"
          @filterChange="onFilterChangeSortament($event)"
        ></ComboBox>
      </FormField>
      <FormField :key="2" label="Толщина">
        <NumberBox
          v-model="values.thickness"
          :precision="-1"
          :groupSeparator="' '"
        ></NumberBox>
      </FormField>
      <FormField :key="3" label="Ширина">
        <NumberBox
          v-model="values.width"
          :precision="-1"
          :min="0"
          :groupSeparator="' '"
        ></NumberBox>
      </FormField>
      <FormField :key="4" label="Стенка">
        <NumberBox
          v-model="values.wall"
          :precision="-1"
          :min="0"
          :groupSeparator="' '"
        ></NumberBox>
      </FormField>
      <FormField :key="5" label="ЕИ размеров">
        <ComboBox
          v-model="values.unit"
          valueField="pk"
          textField="value"
          :data="unit"
          :lazy="true"
          @filterChange="getUnit($event)"
        ></ComboBox>
      </FormField>
      <FormField :key="6" label="Типоразмер">
        <TextBox v-model="values.typesize"></TextBox>
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
      pk: null, // Идентификатор записи
      values: {
        child: null,
        parent: null,
        thickness: null,
        wall: null,
        width: null,
        unit: null,
        typesize: null,
      }, // Словарь со значениями свойств экземпляра сортамента
      pk: null, // Идентификатор связи
      sortament: [], // Набор данных для выбора сортамента
      unit: null, // Набор данных для выбора единицы измерения
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    clearForm() {
      // Очистка формы
      // Ссылочные значения
      this.values.parent = null;
      this.sortament = null;
      this.values.unit = null;
      this.unit = null;
      // Обычные значения
      this.pk = null;
      this.values.thickness = null;
      this.values.wall = null;
      this.values.width = null;
      this.values.typesize = null;
    },
    async fillForm() {
      if (this.selected_id) {
        // Получаем свойства экземпляра сортамента
        const params = { child: this.selected_id };
        const ts = await getData(this, `typesizesort/`, params);
        if (ts.count > 0) {
          const props = ts.results[0]; // Теоретически может прийти несколько строк
          // console.log(props);
          // Ссылочные значения
          this.values.parent = props.parent.pk;
          this.sortament = [props.parent];
          this.values.unit = props.unit ? props.unit.pk : null;
          this.unit = [props.unit];
          // Обычние значения
          this.pk = props.pk;
          this.values.thickness = props.thickness;
          this.values.wall = props.wall;
          this.values.width = props.width;
          this.values.typesize = props.typesize;
        } else {
          // Если нет экземпляра сортамента
          this.clearForm();
        }
      } else this.clearForm();
    },
    async onFilterChangeSortament(event) {
      this.sortament = await getSuggest(this, "partobject", event.filterValue, {
        part_type: "sortament",
      });
    },
    async getUnits(event) {
      this.unit = await getSuggest(this, "measureunit", event.filterValue);
    },
    async submitFormSave() {
      this.values.child = this.selected_id; // Ссылка на экземпляр
      if (this.pk) {
        // Если запись уже существует - обновляем данные
        this.$store.dispatch("patchData", {
          inc_url: "typesizesort",
          id: this.pk,
          params: this.values,
        });
      } else {
        this.$store.dispatch("postData", {
          inc_url: "typesizesort",
          params: this.values,
        });
      }
    },
  },
  created() {
    if (this.selected_id) this.fillForm();
  },
  watch: {
    selected_id(newValue, oldValue) {
      this.fillForm();
    },
  },
};
</script>
