<template>
  <div>
    <common-list resturl="filedocuments/" :parseRow="parseRow">
      <GridColumn field="file_name" title="Файл">
        <template slot="body" slot-scope="scope">
          <a
            :href="scope.row.url"
            download
            :title="`${scope.row.username} ${scope.row.session_datetime}`"
            >{{ scope.row.file_name }}</a
          >
        </template>
      </GridColumn>
      <GridColumn field="doc_type" title="Тип" width="150"></GridColumn>
      <GridColumn field="description" title="Описание" width="200"></GridColumn>
      <GridColumn field="version_num" title="Версия" width="50"></GridColumn>
      <GridColumn field="notice_num" title="Извещение" width="110">
        <template slot="body" slot-scope="scope">
          <a :href="scope.row.notice_url" target="_blank">{{
            scope.row.notice_num
          }}</a>
          {{ scope.row.izm }}
        </template>
      </GridColumn>
      <GridColumn field="edit" width="35" v-if="checkEdit('filedocumentslist')">
        <template slot="body" slot-scope="scope">
          <LinkButton
            iconCls="icon-no"
            @click="onDeleteClick(scope)"
            title="Удалить версию файла"
          ></LinkButton>
        </template>
      </GridColumn>
    </common-list>
  </div>
</template>

<script>
import CommonList from "@/components/CommonList.vue"; // Общий компонент всех списков
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  components: {
    CommonList,
  },
  methods: {
    parseRow(row_node) {
      const host = this.$store.getters.getHostUrl;
      row_node.url = host + row_node.url;
      row_node.notice_url = `${host}/${row_node.notice_id}`;
      row_node.izm = row_node.change_num
        ? `изм. ${row_node.change_num} ${row_node.change_type || ""}`
        : row_node.change_type || "";
      return row_node;
    },
    onDeleteClick(scope) {
      this.$messager.confirm({
        title: "Подтверждение удаления",
        msg: "Вы уверены, что удаление необходимо?",
        result: (answer) => {
          if (answer) {
            this.$store
              .dispatch("deleteData", {
                inc_url: "documentversion",
                id: scope.row.version_id,
              })
              // Обновление списка
              .then(this.$store.commit("setListReloadNeeded"));
          }
        },
      });
    },
  },
};
</script>
