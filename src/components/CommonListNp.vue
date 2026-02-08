<template>
  <DataGrid
    id="dg"
    :data="list_data"
    :columnResizing="true"
    :loading="loading"
    selectionMode="single"
    :emptyMsg="emptyMsg"
    @rowSelect="onRowSelect($event)"
    @rowDblClick="onRowDblClick($event)"
    :rowCss="getRowClass"
    style="height: auto"
  >
    <slot />
  </DataGrid>
</template>

<script>
import { mapState } from "vuex";
import { getData } from "@/api/api";

export default {
  data() {
    return {
      list_data: [], // Данные для списка объектов
      loading: false,
      emptyMsg: "Соотвествующих отбору записей не найдено",
    };
  },
  props: {
    resturl: {
      // Адрес для запроса данных
      type: String,
      default: "",
    },
    suburl: {
      // Приращение к адресу при формировании ссылки на форму редактирования свойств экземпляра объекта
      type: String,
      default: "",
    },
    suburlpk: {
      // Имя праметра, где находится идентификатор объекта для формы редактирования свойств экземпляра объекта
      type: String,
      default: "pk",
    },
    prepareFilters: {
      type: Function,
      default() {
        // Формирование набора фильтров (в наследниках может быть переопределено)
        let params = this.$store.getters.getFilterParams; // Получаем набор фильтров из состояния
        return params;
      },
    },
    parseRow: {
      type: Function,
      default(row_node) {
        // Метод, разбирающий ответ сервера для таблицы списка
        return row_node; // Вариант по умолчанию. Никакого парсинга
      },
    },
    onRowSelect: {
      type: Function,
      default(event) {
        // Отработка клика по строке списка (таблицы)
        this.$store.commit("setSelectedId", event.pk);
      },
    },
  },
  computed: mapState(["type_key", "list_reload_needed"]),
  mounted() {
    this.loadListData();
  },
  watch: {
    list_reload_needed() {
      this.loadListData();
    },
  },
  methods: {
    async loadListData(pageNumber = this.pageNumber, pageSize = this.pageSize) {
      this.loading = true;
      // Предварительно формируем параметры запроса
      let params = this.prepareFilters(null, null); // Без пагинации
      const url = this.resturl ? this.resturl : `${this.type_key}/`;
      const lines = await getData(this, url, params);
      this.list_data = lines.map(this.parseRow);
      this.loading = false;
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${this.suburl}${event[this.suburlpk]}/`);
    },
    getRowClass(row) {
      // Опеределение класса выделения для строки
      if (row.highlighted) {
        return "highlighted";
      }
      return null;
    },
  },
};
</script>

<style>
.highlighted {
  background-color: #ffdfd7;
}
</style>