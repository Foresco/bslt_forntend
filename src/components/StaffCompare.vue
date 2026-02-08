<template>
  <div>
    <form style="margin: 3px">
      Второй:
      <ComboBox
        placeholder="Обозначение для сравнения"
        v-model="second"
        style="width: 250px"
        :data="codes"
        valueField="pk"
        textField="value"
        :lazy="true"
        :limitToList="false"
        @filterChange="getCodes($event)"
      ></ComboBox>
      <LinkButton
        iconCls="icon-more"
        style="margin-left: 10px"
        @click="getListData()"
        >Сравнить</LinkButton
      >
    </form>
    <div>
      <DataGrid
        :data="list_data"
        :loading="loading"
        :columnResizing="true"
        groupField="group"
        style="height: 100%"
      >
        <GridColumn width="18px" :cellCss="getIcon"></GridColumn>
        <GridColumn field="child" title="Обозначение" width="350">
          <template slot="body" slot-scope="scope">
            <a :href="scope.row.url">{{ scope.row.code }}</a>
          </template>
        </GridColumn>
        <GridColumn field="title" title="Наименование" ></GridColumn>
        <template slot="group" slot-scope="scope">
          <span style="font-weight: bold">
            {{ scope.value }}: {{ scope.rows.length }}
          </span>
        </template>
      </DataGrid>
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import FileIcons from "@/components/FileIcons.vue";
import { getSuggest } from "@/api/utils";

export default {
  name: "StaffCompare",
  data() {
    return {
      list_data: [], // Данные для различий состава
      codes: [], // Список обозначений для подстановки
      second: null, // Идентификатор выбранного для сравнения объекта
      loading: false,
    };
  },
  methods: {
    getIcon(row) {
      return row.part_type.pk;
    },
    reduceRow(nodes, row_node) {
      row_node.url = `/${row_node.child}/`;
      // row_node["div_name"] = row_node["part_type"]["div_name"];
      nodes.push(row_node);
      return nodes;
    },
    getListData() {
      // Получение различий состава
      if (this.second) {
        const params = {
          first: this.$store.getters.getSelectedId,
          second: this.second,
        };
        getData(this, "partscompare/", params).then((res) => {
          this.list_data = res.reduce(this.reduceRow, []);
        });
      } else {
        this.$store.commit("setMessage", {
          msg_icon: "error-message",
          msg_text: "Укажите второй объект для сравнения составов",
        });
      }
    },
    async getCodes(event) {
      let params = {};
      // if (this.part_type) params.part_type = this.part_type;
      this.codes = await getSuggest(
        this,
        "partobject",
        event.filterValue,
        params
      );
    },
  },
  components: {
    FileIcons,
  },
};
</script>
