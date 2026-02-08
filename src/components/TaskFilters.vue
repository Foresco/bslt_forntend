<template>
  <div>
    <Form labelWidth="0" :model="list_filters">
      <FormField key="task_type">
        <ComboBox
          placeholder="Тип задания"
          v-model="list_filters.task_type"
          :data="task_types"
          valueField="pk"
          textField="list_value"
          :limitToList="true"
        ></ComboBox>
      </FormField>
      <FormField key="search">
        <TextBox
          v-model="list_filters.search"
          placeholder="Входящий номер или тема"
        >
        </TextBox>
      </FormField>
      <FormField key="date_sign">
        <ComboBox
          v-model="list_filters.date_sign"
          :data="sign_data"
          style="width: 20px"
        ></ComboBox>
        <DateBox
          v-model="list_filters.date"
          format="dd.MM.yyyy"
          placeholder="Срок выполнения"
          :firstDay="1"
        ></DateBox>
      </FormField>
      <FormField key="refer">
        <ComboBox
          v-model="list_filters.refer"
          :data="refers"
          valueField="pk"
          textField="value"
          :lazy="true"
          placeholder="Касается"
          @filterChange="getRefer($event)"
        ></ComboBox>
      </FormField>
      <FormField key="author">
        <ComboBox
          placeholder="Задание выдал"
          v-model="list_filters.author"
          :data="authors"
          valueField="pk"
          textField="value"
          :lazy="true"
          @filterChange="getAuthors($event)"
        ></ComboBox>
      </FormField>
      <FormField key="receiver">
        <ComboBox
          placeholder="Задание получил"
          v-model="list_filters.receiver"
          :data="receivers"
          valueField="pk"
          textField="value"
          :lazy="true"
          @filterChange="getReceivers($event)"
        ></ComboBox>
      </FormField>
      <FormField key="taker">
        <ComboBox
          placeholder="Задание взял"
          v-model="list_filters.taker"
          :data="takers"
          valueField="pk"
          textField="value"
          :lazy="true"
          @filterChange="getTakers($event)"
        ></ComboBox>
      </FormField>
      <FormField key="executor">
        <ComboBox
          placeholder="Задание выполнил"
          v-model="list_filters.executor"
          :data="executors"
          valueField="pk"
          textField="value"
          :lazy="true"
          @filterChange="getExecutors($event)"
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
import { getCodes, getSuggest } from "@/api/utils";
import { getListValues } from "@/api/utils";

export default {
  name: "TaskFilters",
  data() {
    return {
      // void_values: {}, // Пустой словарь
      list_filters: {
        search: "", // Текст для фильтрации
        date_sign: "min_date", // Знак сравнения даты
        date: null, // Дата для фильтрации
        task_type: null, // Тип задания для фильтрации
        refer: null, // Касается для фильтрации
        author: null, // Выдавший задание
        receiver: null, // Получивший задание
        taker: null, // Взявший задание
        executor: null, // Выполнивший задание
      },
      refers: [], // Список обозначений для подстановки в поле Касается
      task_types: [], // Список возможных типов заданий
      authors: [], // Список подстановки для поля Автор
      receivers: [], // Список подстановки для поля Получил
      takers: [], // Список подстановки для поля Взял
      executors: [], // Список подстановки для поля Выполнил
      sign_data: [
        // Данные для знака сравнения даты
        { value: "min_date", text: ">" },
        { value: "max_date", text: "<" },
        { value: "equal_date", text: "=" },
      ],
    };
  },
  methods: {
    getRefer(event) {
      getCodes(this, event.filterValue, "partobject").then(
        (response) => (this.refers = response)
      );
    },
    getAuthors(event) {
      getSuggest(this, "systemuser", event.filterValue).then(
        (response) => (this.authors = response)
      );
    },
    getReceivers(event) {
      getSuggest(this, "userprofile", event.filterValue).then(
        (response) => (this.receivers = response)
      );
    },
    getTakers(event) {
      getSuggest(this, "userprofile", event.filterValue).then(
        (response) => (this.takers = response)
      );
    },
    getExecutors(event) {
      getSuggest(this, "userprofile", event.filterValue).then(
        (response) => (this.executors = response)
      );
    },
    onFilterClick: function () {
      this.$store.commit(
        "setListFilters",
        JSON.parse(JSON.stringify(this.list_filters))
      ); // JSON чтобы не происходило связывания со store и общибок из-за этого
      this.$store.commit("setListReloadNeeded");
    },
    onClearClick: function () {
      // Обнуление всех фильтров
      for (const key in this.list_filters) {
        // console.log(key);
        this.list_filters[key] = null;
      }
      // Значения, отличные от нулевых
      this.list_filters.search = "";
      this.list_filters.date_sign = "min_date";

      this.onFilterClick();
    },
  },
  created() {
    // Получение списка типов заданий
    getListValues(this, "tasktype").then(
      (response) => (this.task_types = response)
    );
    this.onClearClick();
  },
};
</script>
