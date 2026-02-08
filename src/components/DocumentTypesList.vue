<template>
  <common-list suburl="documenttype/" :prepareFilters="prepareFilters">
    <GridColumn field="value_code" title="Код" width="100"></GridColumn>
    <GridColumn field="list_value" title="Наименование"></GridColumn>
    <GridColumn
      field="order_num"
      title="Порядок в списке"
      width="120"
    ></GridColumn>
  </common-list>
</template>

<script>
import CommonList from "@/components/CommonList.vue"; // Общий компонент всех списков

export default {
  components: {
    CommonList,
  },
  methods: {
    prepareFilters(pageSize, pageNumber) {
      // Формирование набора фильтров
      let params = this.$store.getters.getFilterParams; // Получаем набор фильтров из состояния
      params["s_key"] = 1; // Дополниельный ключ для фильтрации
      // Добавляем информацию о страницах
      params["limit"] = pageSize;
      params["offset"] = (pageNumber - 1) * pageSize;
      return params;
    },
  },
};
</script>
