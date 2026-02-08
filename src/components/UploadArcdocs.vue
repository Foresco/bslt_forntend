<template>
  <DataGrid
    :data="list_data"
    :columnResizing="true"
    @rowDblClick="onRowDblClick($event)"
  >
    <GridColumn field="arc_doc_code" title="Архивный документ"></GridColumn>
    <GridColumn field="files_arr" title="Файлы" width="75">
      <template slot="body" slot-scope="scope">
        <file-icons :file_links="scope.row.files"></file-icons>
      </template>
    </GridColumn>
  </DataGrid>
</template>

<script>
import { getData } from "@/api/api";
import { mapState } from "vuex";
import FileIcons from "@/components/FileIcons.vue";

export default {
  components: {
    FileIcons,
  },
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    parseRow(row_node) {
      row_node.arc_doc_id = row_node.arc_doc.pk;
      row_node.arc_doc_code = row_node.arc_doc.value;
      return row_node;
    },
    async loadListData() {
      if (this.selected_id) {
        let params = { file_upload: this.selected_id };
        this.loading = true;
        const url = "uploadarcdoc/";
        const res = await getData(this, url, params);
        this.list_data = res.map(this.parseRow);
        this.loading = false;
      } else this.list_data = [];
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event["arc_doc_id"]}/`);
    },
  },
  watch: {
    selected_id() {
      this.loadListData();
    },
  },
  mounted() {
    if (this.selected_id) this.loadListData(); // На случай, если извещение или объект уже указаны
  },
};
</script>
