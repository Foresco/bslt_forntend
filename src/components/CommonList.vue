<template>
  <DataGrid
    id="dg"
    :data="list_data"
    :pagination="true"
    :lazy="true"
    :columnResizing="true"
    :total="total"
    :loading="loading"
    :pageNumber="pageNumber"
    :pageSize="pageSize"
    pagePosition="top"
    selectionMode="single"
    @pageChange="onPageChange($event)"
    @rowSelect="onRowSelect($event)"
    @rowDblClick="onRowDblClick($event)"
    @sortChange="onSortChange($event)"
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
      total: 0,
      pageNumber: 1,
      pageSize: 25,
      loading: false,
    };
  },
  props: {
    resturl: {
      // Адрес для запроса данных
      type: String,
      default: "",
    },
    extra_params: {
      // Дополнительные параметры для запроса данных
      type: Object,
      default() {
        return {};
      },
    },
    suburl: {
      // Приращение к адресу при формировании ссылки на форму редактирования свойств экземпляра объекта
      type: String,
      default: "",
    },
    suburlpk: {
      // Имя параметра, где находится идентификатор экземпляра для клика вызова формы редактирования свойств экземпляра
      type: String,
      default: "pk",
    },
    prepareFilters: {
      type: Function,
      default(pageSize, pageNumber) {
        // Формирование набора фильтров (в наследниках может быть переопределено)
        let params = this.$store.getters.getFilterParams; // Получаем набор фильтров из состояния
        // Добавляем информацию о страницах
        params["limit"] = pageSize;
        params["offset"] = (pageNumber - 1) * pageSize;
        return params;
      },
    },
    parseRow: {
      type: Function,
      default(row_node, previous) {
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
    onRowDblClick: {
      type: Function,
      default(event) {
        const host = this.$store.getters.getHostUrl;
        window.open(`${host}/${this.suburl}${event[this.suburlpk]}/`);
      },
    },
    onSortChange: {
      // Обработка кликов сортировки по шапке таблицы
      type: Function,
      default(event) {},
    },
    loadOnMount: {
      // Обновлять ли список в момент загрузки
      type: Boolean,
      default: false,
    }
  },
  computed: mapState([
    "type_key",
    "sub_type_key", // Получать значение через getter не подошло
    "list_reload_needed",
  ]),
  watch: {
    list_reload_needed() {
      this.loadListData();
      // Очистка выбора строки
      this.$store.commit("setSelectedId", null);
      this.$store.commit("setLinkId", null);
      this.$store.commit("setSubSelectedId", null);
      this.$store.commit("setPictureObjectId", null);
    },
  },
  methods: {
    onPageChange(event) {
      this.loadListData(event.pageNumber, event.pageSize);
    },
    async loadListData(pageNumber = this.pageNumber, pageSize = this.pageSize) {
      this.loading = true;
      this.$store.commit("setPrevious", null); // Чтобы не осталось с прошлого раза
      // Предварительно формируем параметры запроса
      let params = null;
      params = JSON.parse(
        JSON.stringify(this.prepareFilters(pageSize, pageNumber))
      ); // JSON чтобы не происходило связывания со store и ошибок из-за этого

      // Если переданы дополнительные параметры - добавляем
      Object.entries(this.extra_params).forEach(([key, value]) => {
        params[key] = value;
      });
      // Адрес берется из переданного параметра или из типа объектов
      const url = this.resturl ? this.resturl : `${this.type_key}/`;
      const lines = await getData(this, url, params);
      this.total = lines.count;
      this.list_data = lines.results.map(this.parseRow);
      this.pageNumber = pageNumber;
      this.loading = false;
    },
    getRowClass(row) {
      // Опеределение класса выделения для строки
      if (row.highlighted) {
        return "highlighted";
      }
      return null;
    },
  },
  mounted() {
    if (this.loadOnMount) this.loadListData(); // На случай, если список
  },
};
</script>

<style>
.highlighted {
  background-color: #ffdfd7;
}
</style>