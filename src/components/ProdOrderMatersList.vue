<template>
  <div>
    <common-list
      resturl="prodordermater/"
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
      <GridColumn field="quantity" title="Кол-во" width="55"></GridColumn>
      <GridColumn
        title="М"
        width="25"
        :cellCss="getIconM"
        align="center"
      ></GridColumn>
      <GridColumn field="material" title="Материал" width="120"></GridColumn>
      <GridColumn
        field="surface"
        title="Габариты обработка"
        width="125"
      ></GridColumn>
      <GridColumn
        field="billet_desc"
        title="Заготовка"
        width="150"
      ></GridColumn>
    </common-list>
    <div style="margin: 3px">
      Показать обеспеченные материалами
      <SwitchButton
        v-model="show_mater_state_3"
        title="Показать обеспеченные материалами"
      ></SwitchButton>
    </div>
  </div>
</template>

<script>
import CommonList from "@/components/CommonList.vue"; // Общий компонент всех списков

export default {
  components: {
    CommonList,
  },
  data() {
    return { show_mater_state_3: false };
  },
  methods: {
    getIconM(row) {
      return row.mater_state;
    },
    parseRow(row_node) {
      // Метод, разбирающий ответ сервера для таблицы списка
      const host = this.$store.getters.getHostUrl;
      if (row_node["title"])
        row_node["child"] = `${row_node["child"]} ${row_node["title"]}`;
      row_node.url = `/${row_node.parent_id}/`;
      return row_node;
    },
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
  },
  watch: {
    show_mater_state_3() {
      this.$store.commit("setListSubFilter", {
        name: "show_mater_state_3",
        value: this.show_mater_state_3,
      });
    },
  },
};
</script>

