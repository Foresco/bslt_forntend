<template>
  <div>
    <Form labelWidth="0" :model="void_values" @submit.prevent>
      <FormField key="hidden" v-show="false">
        <TextBox>Без этого Enter перезагружает страницу</TextBox>
      </FormField>
      <FormField key="date">
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
      <FormField key="ordermaker">
        <ComboBox
          v-model="list_filters.ordermaker"
          :data="ordermakers"
          valueField="pk"
          textField="value"
          :lazy="true"
          placeholder="Заказчик"
          @filterChange="getOrderMaker($event)"
        ></ComboBox>
      </FormField>
      <FormField key="search">
        <TextBox
          ref="tbsearch"
          inputId="search"
          v-model="list_filters.search"
          placeholder="Текст для фильтрации заказов"
          v-on:keypress.native="onKeyDown($event)"
        >
        </TextBox>
      </FormField>
      <FormField key="creator">
        <ComboBox
          v-model="list_filters.creator"
          :data="creators"
          valueField="pk"
          textField="value"
          :lazy="true"
          placeholder="Исполнитель"
          @filterChange="getCreator($event)"
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
import { getSuggest, getCodes } from "@/api/utils";
// import { getListValues } from "@/api/utils";

export default {
  name: "ListFilters",
  data() {
    return {
      void_values: {}, // Пустой словарь
      list_filters: {
        search: null, // Тест для фильтрации
        date_sign: "min_date", // Знак сравнения даты
        date: null, // Дата для фильтрации
        ordermaker: null, // Заказчик для фильтрации
        creator: null, // Исполнитель для фильтрации
      },
      ordermakers: [], // Список заказчиков для подстановки в поле Заказчик
      creators: [], // Список исполнителей для подстановки в поле Исполнитель
      sign_data: [
        // Данные для знака сравнения даты
        { value: "min_date", text: ">" },
        { value: "max_date", text: "<" },
        { value: "equal_date", text: "=" },
      ],
    };
  },
  methods: {
    getOrderMaker(event) {
      getCodes(this, event.filterValue, "place", { is_buyer: "True" }).then(
        (response) => (this.ordermakers = response)
      );
    },
    getCreator(event) {
      getSuggest(this, "systemuser", event.filterValue).then(
        (response) => (this.creators = response)
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
      // console.log(this.$store.getters.getFilterParams);
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
      this.onFilterClick();
    },
    onKeyDown(event) {
      if (event.keyCode == 13) {
        // Нажато Enter
        this.onFilterClick(); // Обновление списка с фильтрацией
      }
    },
  },
  created() {
    // Первичая загрузка списка
    this.onClearClick();
  },
};
</script>
