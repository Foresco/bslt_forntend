<template>
  <DataGrid
    :data="list_data"
    :pagination="true"
    :lazy="true"
    :total="total"
    :loading="loading"
    :pageNumber="pageNumber"
    :pageSize="pageSize"
    :pagePosition="pagePosition"
    selectionMode="single"
    @pageChange="onPageChange($event)"
    @rowSelect="onRowSelect($event)"
    style="height:auto"
  >
    <GridColumn field="class_id" title="ID" width="250"></GridColumn>
    <GridColumn field="class_name" title="Наименование класса"></GridColumn>
    <GridColumn field="preferred_name" title="Наименование полное"></GridColumn>
  </DataGrid>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      list_data: [], // Данные для списка объектов
      total: 0,
      pageNumber: 1,
      pageSize: 14,
      loading: false,
      pagePosition: "bottom",
    };
  },
  computed: mapState(["tool_class_id", "filter_text"]),
  mounted() {
    this.loadPage(this.pageNumber, this.pageSize);
  },
  watch: {
    tool_class_id(newValue, oldValue) {
      this.pageNumber = 1;
      this.loadPage(this.pageNumber, this.pageSize);
    },
    filter_text(newValue, oldValue) {
      this.pageNumber = 1;
      this.loadPage(this.pageNumber, this.pageSize);
    },
  },
  methods: {
    onPageChange(event) {
      this.loadPage(event.pageNumber, event.pageSize);
    },
    loadPage(pageNumber, pageSize) {
      const parseResponse = function (response, that) {
        that.total = response.count;
        that.list_data = response.results;
      };
      this.loading = true;
      // Предварительно формируем параметры запроса
      let params = {
        limit: pageSize,
        offset: (pageNumber - 1) * pageSize,
      };
      // Параметры, которые могут быть не указаны
      if (this.filter_text != "") {
        params["search"] = this.filter_text;
      }
      if (this.tool_class_id) {
        params["parent"] = this.tool_class_id;
      }

      axios
        .get("http://localhost:8000/rest/toolclass", {
          params: params,
        })
        .then((response) => parseResponse(response.data, this));

      this.pageNumber = pageNumber;
      this.loading = false;
    },
    onRowSelect(event) {
      // Отработка клика по строке списка (таблицы)
      this.$store.commit('setSelectedId', event.pk);
      // this.$store.commit('setPicturePath', event.icon.file_name);
    },
  },
};
</script>
