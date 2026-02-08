<template>
  <DataGrid
    id="dg"
    :data="list_data"
    :clickToEdit="true"
    :pagination="true"
    :lazy="true"
    :columnResizing="true"
    :total="total"
    :loading="loading"
    :pageNumber="pageNumber"
    :pageSize="pageSize"
    pagePosition="top"
    selectionMode="cell"
    editMode="cell"
    :footerData="footer_data"
    :showFooter="true"
    @pageChange="onPageChange($event)"
    style="height: auto"
  >
    <GridColumn :expander="true" width="30"></GridColumn>
    <GridColumn field="shift_date" title="Дата" width="80"></GridColumn>
    <GridColumn field="worker" title="Работник"></GridColumn>
    <GridColumn field="work_shift" title="Смена" width="90"></GridColumn>
    <GridColumn field="aux_time" title="Наладка" width="60"></GridColumn>
    <GridColumn field="work_time" title="Время" width="60"></GridColumn>
    <GridColumn field="ratio" title="Коэф." :editable="true" width="70">
      <template slot="edit" slot-scope="scope">
        <NumberBox
          v-model="scope.row.ratio"
          :precision="2"
          :increment="0.1"
          :min="0.01"
        ></NumberBox>
      </template>
      <template slot="footer" slot-scope="{ row }">
        {{ row.ratio_sum }}
      </template>
    </GridColumn>
    <GridColumn field="save" width="33">
      <template slot="body" slot-scope="scope">
        <LinkButton
          iconCls="icon-save"
          @click="saveRatio(scope)"
          title="Сохранить введенный коэффициент"
        ></LinkButton>
      </template>
    </GridColumn>
    <template slot="detail" slot-scope="scope">
      <div style="padding: 2px 2px 2px 30px">
        <DataGrid
          :data="scope.row.positions"
          selectionMode="single"
          @rowSelect="onRowSelect($event)"
          @rowDblClick="onRowDblClick($event)"
        >
          <GridColumn field="parent_code" title="Заказ" width="80"></GridColumn>
          <GridColumn field="full_code" title="Позиция заказа"></GridColumn>
          <GridColumn
            field="place_code"
            title="Участок"
            width="125"
          ></GridColumn>
          <GridColumn
            field="operation_name"
            title="Операция"
            width="125"
          ></GridColumn>
          <GridColumn field="aux_time" title="Наладка" width="60"></GridColumn>
          <GridColumn field="work_time" title="Время" width="60"></GridColumn>
          <GridColumn
            field="quantity"
            title="Количество"
            width="75"
          ></GridColumn>
          <GridColumn field="bad_quantity" title="Брак" width="50"></GridColumn>
        </DataGrid>
      </div>
    </template>
  </DataGrid>
</template>

<script>
import { mapState } from "vuex";
import { getData } from "@/api/api";

export default {
  data() {
    return {
      list_data: [], // Данные для списка объектов
      footer_data: [
        {
          ratio_sum: 0, // Сумма коэффициентов
        },
      ], // Данные для подвала
      total: 0,
      pageNumber: 1,
      pageSize: 20,
      loading: false,
    };
  },
  computed: mapState(["list_reload_needed"]),
  watch: {
    list_reload_needed() {
      this.loadListData();
    },
  },
  methods: {
    prepareFilters(pageSize, pageNumber) {
      // Формирование набора фильтров
      let params = this.$store.getters.getFilterParams; // Получаем набор фильтров из состояния
      // Добавляем информацию о страницах
      params["limit"] = pageSize;
      params["offset"] = (pageNumber - 1) * pageSize;
      return params;
    },
    onPageChange(event) {
      this.loadListData(event.pageNumber, event.pageSize);
    },
    async loadListData(pageNumber = this.pageNumber, pageSize = this.pageSize) {
      const parseRow = (row_node) => {
        this.footer_data[0].ratio_sum += row_node["ratio"]; // Считаем суммарный коэффициент
        return row_node;
      };
      this.loading = true;
      this.footer_data[0].ratio_sum = 0;
      this.$store.commit("setPrevious", null); // Чтобы не осталось с прошлого раза
      // Предварительно формируем параметры запроса
      let params = null;
      params = JSON.parse(
        JSON.stringify(this.prepareFilters(pageSize, pageNumber))
      ); // JSON чтобы не происходило связывания со store и ошибок из-за этого
      // Адрес берется из переданного параметра или из типа объектов
      const lines = await getData(this, "workershift/", params);
      this.total = lines.count;
      this.list_data = lines.results.map(parseRow);
      this.pageNumber = pageNumber;
      this.loading = false;
      this.footer_data[0].ratio_sum = this.footer_data[0].ratio_sum.toFixed(2); // Почему-то требуется округление
    },
    onRowSelect(event) {
      // Отработка клика по строке списка (таблицы)
      this.$store.commit("setSelectedId", event.child_id); // Идентификатор объекта
      this.$store.commit("setLinkId", event.link_id); // Идентификатор связи с заказом
      this.$store.commit("setRowId", event.pk); // Идентификатор конкретного отчета
      this.$store.commit("setPictureObjectId", event.child_id); // Идентификатор объекта для иллюстрации
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event["child_id"]}/`);
    },
    saveRatio(scope) {
      this.$store.dispatch("patchData", {
        inc_url: "workershift",
        id: scope.row.pk,
        params: { ratio: scope.row.ratio },
      });
    },
  },
};
</script>

