<template>
  <div>
    <Form labelWidth="0" :model="void_values" @submit.prevent>
      <FormField key="min_date">
        <DateBox
          v-model="min_date_j"
          format="dd.MM.yyyy"
          placeholder="Начальная дата"
          :firstDay="1"
        ></DateBox>
      </FormField>
      <FormField key="max_date">
        <DateBox
          v-model="max_date_j"
          format="dd.MM.yyyy"
          placeholder="Конечная дата"
          :firstDay="1"
        ></DateBox>
      </FormField>
      <FormField key="worker">
        <ComboBox
          v-model="list_filters.worker"
          :data="workers"
          valueField="pk"
          textField="value"
          :lazy="true"
          placeholder="Работник"
          @filterChange="getWorker($event)"
        ></ComboBox>
      </FormField>
      <FormField key="work_shift">
        <ComboBox
          v-model="list_filters.work_shift"
          :data="work_shifts"
          valueField="pk"
          textField="list_value"
          placeholder="Смена"
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
import { dateToPythonStr } from "@/api/formatters";

export default {
  name: "WorkShiftFilters",
  data() {
    return {
      void_values: {}, // Пустой словарь
      list_filters: {
        min_date: null, // Начальная дата для фильтрации
        max_date: null, // Конечная дата для фильтрации
        worker: null, // Работник для фильтрации
        work_shift: null, // Смена для фильтрации
      },
      min_date_j: null, // Для дальнейшего преобразования
      max_date_j: null, // Для дальнейшего преобразования
      workers: [], // Список работников для подстановки в поле Работник
      work_shifts: [], // Список сменй для подстановки в поле Смена
    };
  },
  methods: {
    getWorker(event) {
      getSuggest(this, "userprofile", event.filterValue).then(
        (response) => (this.workers = response)
      );
    },
    setListFilters() {

      this.$store.commit(
        "setListFilters",
        JSON.parse(JSON.stringify(this.list_filters))
      ); // JSON чтобы не происходило связывания со store и ошибок из-за этого
    },
    onFilterClick: function () {
      this.list_filters.min_date = dateToPythonStr(this.min_date_j);
      this.list_filters.max_date = dateToPythonStr(this.max_date_j);
      this.setListFilters();
      this.$store.commit("setListReloadNeeded");
    },
    clearFilters() {
      // Очистка фильтров, устновка значений по умолчанию
      for (const key in this.list_filters) {
        this.list_filters[key] = null; // Обнуление всех фильтров
      }
    },
    onClearClick: function () {
      this.clearFilters();
      this.onFilterClick(); // Обновление списка с фильтрацией
    },
    onKeyDown(event) {
      if (event.keyCode == 13) {
        // Нажато Enter
        this.onFilterClick(); // Обновление списка с фильтрацией
      }
    },
  },
  created() {
    // Загружаем список рабочих смен
    getListValues(this, "workshift").then((response) => {
      this.work_shifts = response;
      this.onClearClick();
    });
  },
};
</script>
