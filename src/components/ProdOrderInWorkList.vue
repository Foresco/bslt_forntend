<template>
  <common-list
    ref="lst"
    :resturl="resturl"
    :extra_params="extra_params"
    :parseRow="parseRow"
    :onRowSelect="onRowSelect"
    :onRowDblClick="onRowDblClick"
    :onSortChange="onSortChange"
  >
    <GridColumn width="18px" :cellCss="getIcon"></GridColumn>  
    <GridColumn field="code" title="Номер заказа" width="100" :sortable="true">
      <template slot="body" slot-scope="scope">
        <a :href="scope.row.url" target="_blank">{{ scope.row.code }}</a>
      </template>
    </GridColumn>
    <GridColumn
      field="child"
      title="Позиция заказа"
      :sortable="true"
    ></GridColumn>
    <GridColumn field="order_maker" title="Заказчик" width="100"></GridColumn>
    <GridColumn field="order_date" title="Дата" width="70"></GridColumn>
    <GridColumn field="parent_state" title="Состояние" width="110"></GridColumn>
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
      title="И"
      width="25"
      :cellCss="getIconT"
      align="center"
    ></GridColumn>
    <GridColumn field="state" title="Операции" width="205">
      <template slot="body" slot-scope="scope">
        <operations-bar :operations="scope.row.operations"></operations-bar>
      </template>
    </GridColumn>
  </common-list>
</template>

<script>
import CommonList from "@/components/CommonList.vue"; // Общий компонент всех списков
import OperationsBar from "@/components/OperationsBar.vue";
import {
  getIconM,
  getIconT,
  getBGColour,
  onRowSelect,
  onRowDblClick,
  getOperations,
} from "@/components/prod/common.js";

export default {
  components: {
    CommonList,
    OperationsBar,
  },
  data() {
    return {
      extra_params: {}, // Дополнительные параметры фильтрации
      resturl: "prodorderinwork/", // Адрес для запроса
      hide_repeat: true, // Признак необходимости сокрытия 
    };
  },
  methods: {
    getIconM,
    getIconT,
    getBGColour,
    getIcon(row) {
      // Для входящих в сборку деталей отдельный стиль
      if (row.part_type == 'detail' && row.parent_quantity > 0) return 'component';
      return row.part_type;
    },
    onRowSelect(event) {
      onRowSelect(event, this);
    },
    onRowDblClick(event) {
      onRowDblClick(event, this);
    },
    parseRow(row_node) {
      // Метод, разбирающий ответ сервера для таблицы списка
      row_node.url = `/${row_node.parent_id}/`;
      if (row_node["title"])
        row_node["child"] = row_node["child"] + " " + row_node["title"];
      // Добавляем отгруженное количество
      if (row_node["ship_quantity"])
        row_node["ssquantity"] =
          row_node["quantity"] + "/" + row_node["ship_quantity"];
      else row_node["ssquantity"] = row_node["quantity"];
      // Преобразуем массив операций
      row_node["operations"] = getOperations(
        row_node["operations"],
        row_node["quantity"]
      );
      if (this.hide_repeat && row_node["child"] == this.$store.getters.getPrevious) {
        // В повторах позиций не выводятся заказ и позиция
        row_node["child"] = "";
      } else {
        this.$store.commit("setPrevious", row_node["child"]);
      }
      return row_node;
    },
    onSortChange(event) {
      const signs = { asc: "", desc: "-" };
      const fld = event[0].field;
      const srt = signs[event[0].order];
      if (fld == "child") {
        // Сортировка по полю Позиция
        this.resturl = "positioninwork/";
        this.extra_params["ordering"] = srt + "child__code";
        this.hide_repeat = true; // Скрывать повторы позиции
      } else if (fld == "code") {
        // Сортировка по полю Заказ
        this.resturl = "prodorderinwork/";
        this.extra_params["ordering"] = srt + "parent__code";
        this.hide_repeat = false; // Не скрывать повторы позиции
      }
      this.$store.commit("setListReloadNeeded"); // Перезагружаем список
    },
  },
};
</script>
