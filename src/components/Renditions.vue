<template>
  <div v-if="checkEdit('renditions')">
    <form style="margin: 3px">
      <ComboBox
        placeholder="Приращение"
        style="width: 150px"
        v-model="new_rendition.tail"
        :data="tails"
        valueField="pk"
        textField="list_value"
        :limitToList="true"
      ></ComboBox>
      <LinkButton iconCls="icon-add" @click="onCreateClick">Создать</LinkButton>
    </form>
    <div v-show="parent_code" class="parent_link">
      Базовое исполнение: <a :href="parent_href" target="_blank">{{ parent_code }}</a>
    </div>
    <div>
      <DataGrid :data="list_data" :columnResizing="true" @rowDblClick="onRowDblClick($event)">
        <GridColumn field="rendition" title="Исполнение"></GridColumn>
        <GridColumn field="tail" title="Приращение" width="80px"></GridColumn>
      </DataGrid>
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { mapState } from "vuex";
import { getListValues } from "@/api/utils";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
      new_rendition: {
        parent: null,
        tail: null,
      }, // Информация о новом элементе состава
      tails: [], // Список приращений
      used_tails: [], // Список уже использованных приращений
      parent_href: '', // Ссылка на родителя
      parent_code: '' // Обозначение родителя
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    parseRow(row_node) {
      this.new_rendition.parent = row_node["parent"]["pk"];
      // Сслыка на родителя
      this.parent_href = `/${row_node["parent"]["pk"]}/`;
      this.parent_code = row_node["parent"]["value"];
      // Использованное приращение
      this.used_tails.push(row_node["tail"]);
      return row_node;
    },
    filterTails(response) {
      // Удаление использованных приращений
      this.tails = response.filter((el) => !this.used_tails.includes(el.list_value));
    },
    async loadRenditions() {
      this.list_data = []; // Очистка списка
      let params = { parent: this.selected_id };
      this.loading = true;
      const url = "rendition/";
      const res = await getData(this, url, params);
      // Запоминать использованные приращения и далее убирать их из списка приращений
      this.list_data = res.map(this.parseRow);
      // Список возможных приращений
      getListValues(this, "renditiontail").then(
        (response) => (this.filterTails(response))
      );
      this.loading = false;
    },
    onCreateClick() {
      // Если родтитель не указан, то родитель - текущий объект
      if (this.new_rendition["parent"] == null)
        this.new_rendition["parent"] = this.$store.getters.getSelectedId;
      this.$store
        .dispatch("postData", {
          inc_url: "rendition",
          params: this.new_rendition,
        })
        // Обновление дерева состава заказа
        .then(() => this.loadRenditions());
      this.new_rendition.tail = null; // Очищаем значение
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event.rendition_id}/`);
    },
  },
  watch: {
    selected_id(newValue, oldValue) {
      this.loadRenditions();
    },
  },
  mounted() {
    if (this.selected_id) this.loadRenditions(); // На случай, если объект уже указан
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
.parent_link {
  padding: 3px;
}
</style>