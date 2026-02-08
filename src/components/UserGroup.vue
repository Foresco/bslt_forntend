<template>
  <div>
    <div>
      <DataGrid :data="data" :columnResizing="true">
        <GridColumn field="сk" :width="50" align="center">
          <template slot="header">
          </template>
          <template slot="body" slot-scope="scope">
            <CheckBox
              v-model="scope.row.selected"
              @checkedChange="onCheckedChange($event)"
            ></CheckBox>
          </template>
        </GridColumn>
        <GridColumn field="name" title="Группа пользователей"></GridColumn>
      </DataGrid>
    </div>
    <div class="buttons_bar">
      <LinkButton iconCls="icon-save" @click="onSaveClick"
        >Сохранить</LinkButton
      >
    </div>
  </div>
</template>

<script>
import { getData, patchData } from "@/api/api";
import { mapState } from "vuex";

export default {
  data() {
    return {
      total: 0, // Общее количествогрупп в списке
      data: [], // Собранные и сформированные данные для грида групп пользователя
      rowClicked: false, // Клик по строке
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    async loadListData() {
      // Загрузка перечня групп пользователя с отметкой групп, в которые он входит
      const parseResponse = function (response, that) {
        let list_nodes = [];
        const user_id = that.selected_id;
        for (let i = 0; i < response.results.length; i++) {
          let tnode = response.results[i];
          if (response.results[i].user_set.includes(parseInt(user_id))) // Без parseInt не срабатывает
            tnode.selected = true;
          list_nodes.push(tnode);
        }
        that.total = response.count;
        that.data = list_nodes;
      };
      this.loading = true;

      const lines = await getData(this, "usergroup");
      parseResponse(lines, this);

      this.loading = false;
    },
    onCheckedChange(checked) {
      // Клик по галочке в строке
      const checkedRows = () => this.data.filter((row) => row.selected);
      this.allChecked = checkedRows.length === this.data.length;
      this.rowClicked = true;
    },
    onSaveClick() {
      const user_groups = this.data.filter(group => group.selected).map(group => group.pk);
      this.$store.dispatch("patchData", {inc_url: "systemuser", id: this.selected_id, params: {
        groups: user_groups,
      }});
    },
  },
  watch: {
    selected_id() {
      // Формируем грид групп пользователя
      this.loadListData();
    },
  },
  mounted() {
    if (this.selected_id) this.loadListData(); // На случай, если задача уже указана
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>