<template>
  <div>
    <div v-if="checkEdit('objectcomments')">
      <TextBox
        inputId="tc"
        :multiline="true"
        v-model="new_comment.comment_text"
        style="width: 100%; height: 70px"
      ></TextBox>
      <div class="buttons_bar">
        <LinkButton iconCls="icon-add" @click="onAddClick">Добавить</LinkButton>
      </div>
    </div>
    <div>
      <DataGrid
        :data="list_data"
        :columnResizing="true"
        selectionMode="single"
        @rowSelect="onRowSelect($event)"
      >
        <GridColumn field="comment_text" title="Комментарий">
          <template slot="body" slot-scope="scope">
            <span v-Tooltip="scope.row.tooltip">{{
              scope.row.comment_text
            }}</span>
          </template>
        </GridColumn>
      </DataGrid>
    </div>
    <div class="buttons_bar" v-if="checkEdit('objectcomments')">
      <LinkButton v-show="comment_id" iconCls="icon-no" @click="onDeleteClick()"
        >Удалить</LinkButton
      >
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { datetimeToPythonStr } from "@/api/formatters.js";
import { mapState } from "vuex";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
      new_comment: {
        entity: null,
        comment_type: "C", // Пока всегда тип Комментарий
        parent: null,
        comment_text: "",
      }, // Информация о новом комментарии
      comment_id: null, // Идентификатор выбранного комментария
      //   comment_text: '',
      codes: [], // Список для выбора объекта
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    parseRow(row) {
      return {
        pk: row.pk,
        tooltip: `${row.crtd_user} ${row.comment_datetime}: ${row.comment_text}`,
        comment_text: row.comment_text,
      };
    },
    loadListData() {
      this.list_data = [];
      if (this.selected_id) {
        this.loading = true;
        getData(this, "comment/", {
          entity: this.selected_id,
        }).then((response) => (this.list_data = response.map(this.parseRow)));
        this.loading = false;
        this.comment_id = null;
        this.new_comment.comment_text = "";
      }
    },
    onRowSelect(event) {
      this.comment_id = event.pk;
    },
    onAddClick() {
      this.new_comment.entity = this.selected_id;
      this.new_comment.comment_datetime = datetimeToPythonStr(new Date());
      this.new_comment.parent = this.comment_id; // Выделенный комментарий - на него ответ
      this.$store
        .dispatch("postData", {
          inc_url: "comment",
          params: this.new_comment,
        })
        // Обновление списка
        .then(() => this.loadListData());
    },
    onDeleteClick() {
      // Удаляем отмеченную строку
      this.$store
        .dispatch("deleteData", {
          inc_url: "comment",
          id: this.comment_id,
        })
        // Обновление списка
        .then(() => this.loadListData());
    },
  },
  watch: {
    selected_id() {
      this.loadListData();
    },
  },
  mounted() {
    if (this.selected_id) this.loadListData(); // На случай, если объект уже указан
  },
};
</script>

<style>
.buttons_bar {
  margin-left: 5px;
}
</style>