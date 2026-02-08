<template>
  <div>
    <common-list
      resturl="supplymater/"
      :parseRow="parseRow"
      :onRowSelect="onRowSelect"
      :onRowDblClick="onRowDblClick"
    >
      <GridColumn field="code" title="Номер заказа" width="80">
        <template slot="body" slot-scope="scope">
          <a :href="scope.row.url" target="_blank">{{ scope.row.code }}</a>
        </template>
      </GridColumn>
      <GridColumn field="child" title="Позиция заказа" width="250"></GridColumn>
      <GridColumn
        field="ssquantity"
        title="Кол-во"
        width="55"
        :cellCss="getBGColour"
      ></GridColumn>
      <GridColumn
        title="М"
        width="25"
        :cellCss="getIconM"
        align="center"
      ></GridColumn>
      <GridColumn field="material" title="Материал" width="120"></GridColumn>
      <GridColumn title="Заказы на поставку" width="107">
        <template slot="body" slot-scope="scope">
          <links-bar :links="scope.row.supply_orders"></links-bar>
        </template>
      </GridColumn>
      <GridColumn field="supplier" title="Поставщики" width="130">
        <template slot="body" slot-scope="scope">
          <strings-bar
            :strings="scope.row.supply_orders"
          ></strings-bar> </template
      ></GridColumn>
    </common-list>
    <div class="buttons_bar" v-if="checkEdit('supplymaterslist')">
      <ComboBox
        placeholder="Заказ на поставку"
        v-model="order_id"
        style="width: 200px; margin-right: 5px"
        :data="supply_orders"
        valueField="pk"
        textField="value"
        :lazy="true"
        :limitToList="false"
        @filterChange="getSupplyOrders($event)"
      ></ComboBox>
      <LinkButton
        iconCls="icon-add"
        title="Включить отмеченные позиции в заказ на поставку материалов"
        @click="onAddClick()"
        >Включить в заказ</LinkButton
      >
    </div>
  </div>
</template>

<script>
import { getSuggest } from "@/api/utils";
import CommonList from "@/components/CommonList.vue"; // Общий компонент всех списков
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования
import LinksBar from "@/components/LinksBar.vue";
import StringsBar from "@/components/StringsBar.vue";
import { getBGColour } from "@/components/prod/common.js";

export default {
  mixins: [editable_component],
  components: {
    CommonList,
    LinksBar,
    StringsBar,
  },
  data() {
    return {
      order_id: null, // Заказ на поставку
      supply_orders: [], // Список заказов на поставку для подстановки
    };
  },
  methods: {
    getIconM(row) {
      return row.mater_state;
    },
    parseRow(row_node) {
      // Метод, разбирающий ответ сервера для таблицы списка
      if (row_node["title"])
        row_node["child"] = row_node["child"] + " " + row_node["title"];
      if (row_node["ship_quantity"])
        row_node["ssquantity"] =
          row_node["quantity"] + "/" + row_node["ship_quantity"];
      else row_node["ssquantity"] = row_node["quantity"];
      row_node.url = `/${row_node.parent_id}/`;
      row_node.so_url = `/${row_node.order_id}/`;
      return row_node;
    },
    getBGColour,
    onRowSelect(event) {
      // Отработка клика по строке списка (таблицы)
      this.$store.commit("setSelectedId", event.child_id);
      this.$store.commit("setTypeKey", event.type_key);
      this.$store.commit("setLinkId", event.pk);
      this.$store.commit("setSubSelectedId", event.child_id);
      this.$store.commit("setPictureObjectId", event.child_id);
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event.type_key}/${event.child_id}/`);
    },
    async getSupplyOrders(event) {
      // Получение списка подстановки для поля Обозначение
      this.supply_orders = await getSuggest(
        this,
        "supplyorder",
        event.filterValue
      );
    },
    onAddClick() {
      // TODO: Нужна проверка указания идентификаторов
      const new_link = {
        prod_order_link: this.$store.getters.getLinkId,
        supply_order: this.order_id,
      };
      this.$store
        .dispatch("postData", {
          inc_url: "orderprodposition",
          params: new_link,
        })
        .then((response) => this.$store.commit("setListReloadNeeded")); // Перезагружаем список
    },
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
.greenbg {
  background-color: #b5e51d;
}
</style>