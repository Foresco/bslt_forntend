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
    selectionMode="single"
    pagePosition="top"
    @pageChange="onPageChange($event)"
    @rowSelect="onRowSelect($event)"
    style="height: auto"
  >
    <GridColumn :expander="true" width="30"></GridColumn>
    <GridColumn field="code" title="Номер заказа">
      <template slot="body" slot-scope="scope">
        <a :href="scope.row.url" target="_blank">{{ scope.row.code }}</a>
      </template>
    </GridColumn>
    <GridColumn field="order_maker" title="Заказчик" width="100"></GridColumn>
    <GridColumn
      title="Отгр"
      width="33"
      :cellCss="getIconShip"
      align="center"
    ></GridColumn>
    <GridColumn
      title="М"
      width="23"
      :cellCss="getIconM"
      align="center"
    ></GridColumn>
    <GridColumn field="order_state" title="Состояние" width="90"></GridColumn>
    <GridColumn
      title="КД"
      width="24"
      :cellCss="getIconKD"
      align="center"
    ></GridColumn>
    <GridColumn field="spec_account" title="Спец" width="110"></GridColumn>
    <GridColumn field="order_date" title="Дата" width="70"></GridColumn>
    <GridColumn
      title="Кальк"
      width="40"
      :cellCss="getIconCalc"
      align="center"
    ></GridColumn>
    <GridColumn
      title="Оплата"
      width="45"
      :cellCss="getIconPay"
      align="center"
    ></GridColumn>
    <GridColumn
      field="milit_comment"
      title="Согласование с ВП"
      width="160"
      :cellCss="getVPBGColour"
    ></GridColumn>
    <template slot="detail" slot-scope="scope">
      <div style="padding: 2px 2px 2px 30px">
        <DataGrid
          :data="scope.row.positions"
          selectionMode="single"
          @rowSelect="onSubRowSelect($event)"
          @rowDblClick="onRowDblClick($event)"
        >
          <GridColumn field="child" title="Позиция заказа"></GridColumn>
          <GridColumn
            field="ssquantity"
            title="Кол-во"
            width="60"
            :cellCss="getBGColour"
          ></GridColumn>
          <GridColumn
            title="М"
            width="25"
            :cellCss="getIconM"
            align="center"
          ></GridColumn>
          <GridColumn
            field="price_no_nds"
            title="Цена без НДС"
            width="85"
          ></GridColumn>
          <GridColumn
            title="КД"
            width="24"
            :cellCss="getIconKD"
            align="center"
          ></GridColumn>
          <GridColumn title="Заказы на поставку" width="220">
            <template slot="body" slot-scope="scope">
              <links-bar :links="scope.row.supply_orders"></links-bar>
            </template>
          </GridColumn>
          <GridColumn field="supplier" title="Поставщики" width="230">
            <template slot="body" slot-scope="scope">
              <strings-bar
                :strings="scope.row.supply_orders"
              ></strings-bar> </template
          ></GridColumn>
        </DataGrid>
      </div>
    </template>
  </DataGrid>
</template>

<script>
import { mapState } from "vuex";
import { getData } from "@/api/api";
import { getIconM, getIconT, getBGColour } from "@/components/prod/common.js";
import LinksBar from "@/components/LinksBar.vue";
import StringsBar from "@/components/StringsBar.vue";

export default {
  components: {
    LinksBar,
    StringsBar,
  },
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
      // Формирование набора фильтров (в наследниках может быть переопределено)
      let params = this.$store.getters.getFilterParams; // Получаем набор фильтров из состояния
      // Добавляем информацию о страницах
      params["limit"] = pageSize;
      params["offset"] = (pageNumber - 1) * pageSize;
      return params;
    },
    onPageChange(event) {
      this.loadListData(event.pageNumber, event.pageSize);
    },
    parseRow(row_node) {
      const parseSubRow = (row_node) => {
        if (row_node["ship_quantity"])
          row_node["ssquantity"] =
            row_node["quantity"] + "/" + row_node["ship_quantity"];
        else row_node["ssquantity"] = row_node["quantity"];
        return row_node;
      };
      const host = this.$store.getters.getHostUrl;
      row_node.url = `/${row_node.pk}/`;
      if (row_node["title"])
        row_node["child"] = row_node["child"] + " " + row_node["title"];
      // Добавляем отгруженное количество
      if (row_node["ship_quantity"])
        row_node["ssquantity"] =
          row_node["quantity"] + "/" + row_node["ship_quantity"];
      else row_node["ssquantity"] = row_node["quantity"];
      // Добполнительно обрабатываем вложенные строки, если они не пустые
      if (row_node.positions)
        row_node.positions = row_node.positions.map(parseSubRow);
      return row_node;
    },
    async loadListData(pageNumber = this.pageNumber, pageSize = this.pageSize) {
      this.loading = true;
      this.footer_data[0].ratio_sum = 0;
      this.$store.commit("setPrevious", null); // Чтобы не осталось с прошлого раза
      // Предварительно формируем параметры запроса
      let params = null;
      params = JSON.parse(
        JSON.stringify(this.prepareFilters(pageSize, pageNumber))
      ); // JSON чтобы не происходило связывания со store и ошибок из-за этого
      // Адрес берется из переданного параметра или из типа объектов
      const lines = await getData(this, "prodordercontract/", params);
      this.total = lines.count;
      this.list_data = lines.results.map(this.parseRow);
      this.pageNumber = pageNumber;
      this.loading = false;
    },
    getIconM,
    getIconT,
    getBGColour,
    onRowSelect(event) {
      // console.log('onRowSelect', event.pk);
      this.$store.commit("setSelectedId", event.pk);
      this.$store.commit("setTypeKey", event.type_key);
      this.$store.commit("setSubTypeKey", event.type_key);
    },
    onSubRowSelect(event) {
      // console.log('onSubRowSelect', event.pk);
      this.$store.commit("setTypeKey", "prodorderposition");
      this.$store.commit("setLinkId", event.pk);
    },
    getIconShip(row) {
      // Иконка для оценки отгрузок
      if (row.shipment_count > 0) {
        // Отгрузки были
        if (row.unshipped_quantity > 0) return "state_ordered"; // Есть неотгруженные
        return "state_yes";
      }
      return null;
    },
    getIconKD(row) {
      return row.design_doc;
    },
    getIconCalc(row) {
      // Иконка для калькуляции
      if (row.calc_date) return "state_yes";
      return null;
    },
    getIconPay(row) {
      return row.payment_state;
    },
    getVPBGColour(row) {
      // Делаем фон ячейки зеленым
      if (row.milit_test) return "greenbg";
    },
  },
};
</script>