<template>
  <div>
    <Form
      :model="prop_values"
      :labelWidth="label_width"
      v-if="Object.keys(prop_values).length > 0"
    >
      <FormField
        v-for="(f, index) of prop_fields.filter((el) => el.type != 'Hide')"
        :key="index"
        :name="f.name"
      >
        <TextBox
          v-if="f.type == 'EntityLabel'"
          v-model="prop_values[f.name]"
          :readonly="true"
          :editable="false"
          :inputStyle="{ backgroundColor: '#fd97b0' }"
        >
        </TextBox>
        <TextBox
          v-if="f.type == 'TextBox'"
          v-model="prop_values[f.name]"
          :title="f.label"
        ></TextBox>
        <TextBox
          v-if="f.type == 'TextBoxMultiline'"
          v-model="prop_values[f.name]"
          :multiline="true"
          :title="f.label"
          style="height: 50px"
        ></TextBox>
        <ComboBox
          v-if="f.type == 'List'"
          v-model="prop_values[f.name]"
          :data="f.data"
          :title="f.label"
        ></ComboBox>
        <ComboBox
          v-if="f.type == 'Link'"
          v-model="prop_values[f.name]"
          :title="f.label"
          valueField="pk"
          textField="value"
          :data="ref_data[f.name]"
          :lazy="true"
          @filterChange="onFilterChange($event, f.name, f.target)"
        ></ComboBox>
        <CheckBox
          v-if="f.type == 'CheckBox'"
          v-model="prop_values[f.name]"
          :title="f.label"
        ></CheckBox>
        <DateBox
          v-if="f.type == 'DateBox'"
          v-model="prop_values[f.name]"
          :title="f.label"
          format="dd.MM.yyyy"
          :firstDay="1"
        ></DateBox>
        <NumberBox
          v-if="f.type == 'NumberBox'"
          v-model="prop_values[f.name]"
          :title="f.label"
          :precision="-1"
          :groupSeparator="' '"
        ></NumberBox>
        <NumberBox
          v-if="f.type == 'NumberBoxInt'"
          v-model="prop_values[f.name]"
          :precision="0"
        ></NumberBox>
        <TextBox
          v-if="f.type == 'FormatFrom'"
          v-model="prop_values[f.name]"
          :title="f.label"
        >
        </TextBox>
        <TextBox v-if="f.type == 'Ref'" v-model="prop_values[f.name]"
          ><Addon align="left"
            ><a :href="prop_links[f.name].pk + '/'">{{
              prop_links[f.name].value
            }}</a></Addon
          ></TextBox
        >
      </FormField>
    </Form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getPropValues, getPropsList, getSuggest } from "@/api/utils";

export default {
  data() {
    return {
      prop_values: {}, // Словарь со значениями свойств
      prop_links: {}, // Словарь со значениями ссылок (pk, value)
      prop_fields: [], // Список с перечнем полей формы
      ref_data: {}, // Данные для справочных полей подстановки
    };
  },
  props: {
    // mode: String, // Режим работы формы (create - создание, edit - редактрование, view - просмотр)
    form_fields: Array, // Список с перечнем полей формы (может быть передан или не передан извне)
    label_width: {
      // Ширина панелей подписей у полей
      default: 0,
    },
  },
  computed: mapState(["selected_id", "type_key"]),
  methods: {
    async prepareForm() {
      if (typeof this.form_fields != "undefined") {
        this.prop_fields = this.form_fields;
      } else {
        if (!this.type_key) return; // Если не указан тип - выходим
        // Если ничего не передано в параметр - получаем из свойств
        this.prop_fields = await getPropsList(
          this,
          this.type_key,
          this.$store.getters.getSubTypeKey
        );
      }
      if (this.prop_fields == []) return; // Если нет описаний полей, то нет смысла дальше

      let properties = {};
      this.prop_values = {}; // Почему-то без этого не работает
      if (this.mode != "create") {
        // Свойства экземпляра получаем только для режима просмотра или редактирования если выбран экземпляр
        if (this.selected_id)
          properties = await getPropValues(
            this,
            this.type_key,
            this.selected_id
          );
      } else {
        // Заполняем значениями по умолчанию из свойств
        for (let p in this.prop_fields) {
          properties[this.prop_fields[p].name] = this.prop_fields[p].default;
        }
      }
      for (let i = 0; i < this.prop_fields.length; i++) {
        // проходим по массиву описаний свойств
        let field_name = this.prop_fields[i].name;
        // TODO: Упростить и сделать отдельной функцией
        if (field_name in properties) {
          // если свойство есть в массиве значений
          // заполняем значение и добавляем в массив
          if (this.prop_fields[i].type == "DateBox" && properties[field_name])
            // Преобразуем текст в дату
            this.prop_values[field_name] = new Date(properties[field_name]);
          else if (
            this.prop_fields[i].type == "Link" &&
            properties[field_name]
          ) {
            // Извлекаем ключ из ссылки
            this.prop_values[field_name] = properties[field_name].pk;
            // Добавляем строку в массов значений
            this.ref_data[field_name] = [properties[field_name]];
          } else if (
            this.prop_fields[i].type == "List" && // Поле - Фиксированный список
            properties[field_name]
          ) {
            // Извлекаем ключ из ссылки
            this.prop_values[field_name] = properties[field_name].pk;
            // Добавляем строку в массов значений
          } else if (
            this.prop_fields[i].type == "Ref" // Поле - фиксированная ссылка
          ) {
            if (properties[field_name]) {
              this.prop_values[field_name] = null; // Текст отображаться не будет
              this.prop_links[field_name] = properties[field_name];
              this.prop_links[field_name][
                "url"
              ] = `${this.$store.getters.getHostUrl}/${properties[field_name]["pk"]}/`; // Формируем абсолюную ссылку (отностительная формируется неправильно)
            } else {
              this.prop_fields[i].type = "Hide"; // Это поле будет скрыто
            }
          } else if (
            this.prop_fields[i].type == "CheckBox" &&
            !properties[field_name] // Поле Да/Нет и для него нет свойств
          ) {
            this.prop_values[field_name] = false; // По умолчанию, чтобы не было ошибок при сохранении
          } else if (this.prop_fields[i].type == "EntityLabel") {
            if (properties[field_name])
              this.prop_values[field_name] = properties[field_name];
            else this.prop_fields[i].type = "Hide"; // Это поле будет скрыто
          } else this.prop_values[field_name] = properties[field_name];
        } else this.prop_values[field_name] = null;
      }
      // Рекомендация разработчиков Easyui
      // Для надежного обновления данных в компоненте
      this.prop_values = Object.assign({}, this.prop_values);
    },
    async onFilterChange(event, field_name, target) {
      this.ref_data[field_name] = await getSuggest(
        this,
        target,
        event.filterValue
      );
      // Рекомендация разработчиков Easyui
      // Для надежного обновления данных в компоненте
      this.ref_data = Object.assign({}, this.ref_data);
    },
  },
  // created() {
  //   this.prepareForm();
  // },
  // Пока отключил, потому что возникает сбой из за разных типов объектов
  watch: {
    selected_id() {
      this.prepareForm();
    },
  },
};
</script>

<style>
</style>
