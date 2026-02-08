<template>
  <div>
    <DataGrid :data="list_data" selectionMode="single" :columnResizing="true">
      <GridColumn field="file_name" title="Файл">
        <template slot="body" slot-scope="scope">
          <a :href="scope.row.url" download>{{ scope.row.file_name }}</a>
        </template>
      </GridColumn>
      <GridColumn field="doc_type" title="Тип" width="100"></GridColumn>
      <GridColumn field="description" title="Описание" width="200"></GridColumn>
      <GridColumn field="version_num" title="Версия" width="50"></GridColumn>
      <GridColumn field="edit" width="35">
        <template slot="body" slot-scope="scope">
          <LinkButton
            iconCls="icon-edit"
            @click="submitFormEdit(scope)"
            title="Редактировать файл"
          ></LinkButton>
        </template>
      </GridColumn>
    </DataGrid>
    <div class="buttons_bar" v-if="checkEdit('objectfiles')">
      <LinkButton
        iconCls="icon-no"
        style="margin: 10px"
        @click="onDeleteClick()"
        >Удалить</LinkButton
      >
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getData } from "@/api/api";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      list_data: [],
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    parseRow(row_node) {
      const host = this.$store.getters.getHostUrl;
      row_node.url = host + row_node.url;
      return row_node;
    },
    async loadListData() {
      this.list_data = []; // Очистка списка
      if (this.selected_id) {
        let params = { entity: this.selected_id };
        this.loading = true;
        const url = "entitydocuments/";
        const lines = await getData(this, url, params);
        this.list_data = lines.map(this.parseRow);
        this.loading = false;
      }
    },
  },
  watch: {
    selected_id() {
      this.loadListData();
    },
  },
  mounted() {
    this.loadListData(); // На случай, если объект уже указан
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>
