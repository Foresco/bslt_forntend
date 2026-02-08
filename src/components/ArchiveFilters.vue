<template>
  <div>
    <Form labelWidth="0" :model="void_values">
      <FormField key="search">
        <TextBox
          inputId="search"
          v-model="list_filters.search"
          placeholder="Текст для фильтрации"
        >
        </TextBox>
      </FormField>
      <FormField key="date" v-if="checkField('date')">
        <ComboBox
          inputId="sign"
          v-model="list_filters.date_sign"
          :data="sign_data"
          style="width: 20px"
        ></ComboBox>
        <DateBox
          v-model="list_filters.date"
          format="dd.MM.yyyy"
          placeholder="Дата для фильтрации"
          :firstDay="1"
          style="width: 120px"
        ></DateBox>
      </FormField>
      <FormField key="place" v-if="checkField('place')">
        <ComboBox
          v-model="list_filters.place"
          :data="places"
          valueField="pk"
          textField="value"
          :lazy="true"
          placeholder="Получатель"
          @filterChange="getPlace($event)"
        ></ComboBox>
      </FormField>
      <FormField>
        <LinkButton
          iconCls="icon-filter"
          style="margin: 5px"
          @click="onFilterClick"
          >Фильтровать</LinkButton
        >
        <LinkButton
          iconCls="icon-clear"
          title="Очистить параметры фильтрации"
          @click="onClearClick"
          >Очистить</LinkButton
        >
      </FormField>
    </Form>
  </div>
</template>

<script>
import { getCodes } from "@/api/utils";

export default {
  name: "ListFilters",
  data() {
    return {
      void_values: {}, // Пустой словарь
      list_filters: {
        search: null, // Тест для фильтрации
        date_sign: "min_date", // Знак сравнения даты
        date: null, // Дата для фильтрации
        place: null, // Производственное подразделение для фильтрации
      },
      places: [], // Список производственных подразделений для подстановки в поле Подразделение
      filter_fields: [], // список отображаемых полей при поиске
      sign_data: [
        // Данные для знака сравнения даты
        { value: "min_date", text: ">" },
        { value: "max_date", text: "<" },
        { value: "equal_date", text: "=" },
      ],
    };
  },
  methods: {
    getPlace(event) {
      getCodes(this, event.filterValue, "place").then(
        (response) => (this.places = response)
      );
    },
    setListFilters() {
      this.$store.commit(
        "setListFilters",
        JSON.parse(JSON.stringify(this.list_filters))
      ); // JSON чтобы не происходило связывания со store и ошибок из-за этого
    },
    onFilterClick: function () {
      this.setListFilters();
      this.$store.commit("setListReloadNeeded");
    },
    clearFilters() {
      // Очистка фильтров, устновка значений по умолчанию
      for (const key in this.list_filters) {
        this.list_filters[key] = null; // Обнуление всех фильтров
      }
      // Значения, отличные от нулевых
      this.list_filters.date_sign = "min_date";
    },
    onClearClick: function () {
      this.clearFilters();
      this.onFilterClick(); // Обновление списка с фильтрацией
    },
    checkField: function (field_name) {
      // Получение признака отображения поля
      return this.filter_fields.includes(field_name);
    },
  },
  created() {
    // Получение списка отображаемых полей
    if (typeof filter_fields != "undefined") {
      this.filter_fields = filter_fields;
    } else this.filter_fields = [];
    this.onClearClick(); // Обновление списка с пустыми фильтрами
  },
};
</script>
