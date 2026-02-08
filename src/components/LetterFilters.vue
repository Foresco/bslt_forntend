<template>
  <div>
    <Form labelWidth="0" :model="list_filters">
      <FormField key="direction">
        <ComboBox
          placeholder="Направление"
          v-model="list_filters.direction"
          :data="directions"
          valueField="pk"
          textField="list_value"
          :limitToList="true"
        ></ComboBox>
      </FormField>
      <FormField key="letter_type">
        <ComboBox
          placeholder="Тип"
          v-model="list_filters.letter_type"
          :data="letter_types"
          valueField="pk"
          textField="list_value"
          :limitToList="true"
        ></ComboBox>
      </FormField>
      <FormField key="search">
        <TextBox
          v-model="list_filters.search"
          placeholder="Номер, примечание или тема"
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
          placeholder="Дата"
          :firstDay="1"
        ></DateBox>
      </FormField>
      <FormField key="sender">
        <ComboBox
          placeholder="Отправитель"
          v-model="list_filters.sender"
          :data="senders"
          valueField="pk"
          textField="value"
          :lazy="true"
          @filterChange="getSenders($event)"
        ></ComboBox>
      </FormField>
      <FormField key="receiver">
        <ComboBox
          placeholder="Получатель"
          v-model="list_filters.receiver"
          :data="receivers"
          valueField="pk"
          textField="value"
          :lazy="true"
          @filterChange="getReceivers($event)"
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
import { getSuggest } from "@/api/utils";
import { getListValues } from "@/api/utils";

export default {
  name: "LetterFilters",
  data() {
    return {
      list_filters: {
        search: "", // Текст для фильтрации
        date_sign: "min_date", // Знак сравнения даты
        date: null, // Дата для фильтрации
        direction: null, // Направление письма
        letter_type: null, // Тип письма для фильтрации
        sender: null, // Отправитель письма
        receiver: null, // Получатель письма
      },
      letter_types: [], // Список возможных типов писем
      directions: [], // Список возможных направлений писем
      senders: [], // Список подстановки для поля Отправитель
      receivers: [], // Список подстановки для поля Получатель
      sign_data: [
        // Данные для знака сравнения даты
        { value: "min_date", text: ">" },
        { value: "max_date", text: "<" },
        { value: "equal_date", text: "=" },
      ],
    };
  },
  methods: {
    getSenders(event) {
      getSuggest(this, "place", event.filterValue).then(
        (response) => (this.senders = response)
      );
    },
    getReceivers(event) {
      getSuggest(this, "place", event.filterValue).then(
        (response) => (this.receivers = response)
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
    getListValues(this, "letterdirection").then(
      (response) => (this.directions = response)
    );
    getListValues(this, "lettertype").then(
      (response) => (this.letter_types = response)
    );
    this.onClearClick();
  },
};
</script>
