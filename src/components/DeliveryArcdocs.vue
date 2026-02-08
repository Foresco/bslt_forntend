<template>
  <div>
    <div>
      <Form
        :model="new_doc"
        :labelWidth="0"
        v-if="checkEdit('deliveryarcdocs')"
      >
        <FormField :key="1" name="exemplar_num">
          <TextBox
            v-model="new_doc.exemplar_num"
            placeholder="Номер экземпляра"
          ></TextBox>
        </FormField>
        <FormField :key="2" name="arc_doc">
          <ComboBox
            placeholder="Архивный документ"
            v-model="new_doc.arc_doc"
            :data="arc_docs"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getArcDocs($event)"
          ></ComboBox>
        </FormField>
        <FormField :key="3" name="comment">
          <TextBox placeholder="Примечание" v-model="new_doc.comment"></TextBox>
        </FormField>
        <div class="buttons_bar">
          <LinkButton iconCls="icon-add" @click="onAddClick"
            >Добавить</LinkButton
          >
        </div>
      </Form>
    </div>
    <div>
      <DataGrid
        :data="list_data"
        :columnResizing="true"
        :clickToEdit="true"
        editMode="row"
        @rowDblClick="onRowDblClick($event)"
        selectionMode="single"
        @rowSelect="onRowSelect($event)"
      >
        <GridColumn
          field="exemplar_num"
          title="Номер экземпляра"
          width="150"
          :editable="true"
          ><template slot="edit" slot-scope="scope">
            <TextBox v-model="scope.row.exemplar_num"></TextBox> </template
        ></GridColumn>
        <GridColumn field="arc_doc_code" title="Архивный документ"></GridColumn>
        <GridColumn field="comment" title="Примечание"></GridColumn>
      </DataGrid>
      <div class="buttons_bar" v-if="checkEdit('deliveryarcdocs')">
        <LinkButton v-show="link_id" iconCls="icon-no" @click="onDeleteClick()"
          >Удалить</LinkButton
        >
        <LinkButton
          v-show="link_id"
          iconCls="icon-save"
          @click="onSaveClick()"
          style="margin-left: 5px"
          >Сохранить</LinkButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { mapState } from "vuex";
import { getSuggest } from "@/api/utils";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
      new_doc: {
        // Информация о новом документе в выдаче
        exemplar_num: "1",
        arc_doc: null,
        comment: null,
      },
      edit_doc: {
        // Информация о редактируемос документе в выдаче
        exemplar_num: null,
      }, // Информация о редактируемой связи с извещением
      arc_docs: [], // Список архивных документов
      link_id: null, // Идентификатор выбранной строки
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
      this.list_data = [];
      if (this.selected_id) {
        let params = { delivery: this.selected_id };
        this.loading = true;
        const url = "deliveryarcdoc/";
        const res = await getData(this, url, params);
        this.list_data = res.map(this.parseRow);
        this.loading = false;
      }
      this.link_id = null;
    },
    onRowSelect(event) {
      // Отработка клика по строке списка (таблицы)
      this.link_id = event.pk;
    },
    async getArcDocs(event) {
      // Получение списка архивных документов
      this.arc_docs = await getSuggest(this, "arcdocument", event.filterValue);
    },
    onAddClick() {
      this.new_doc["delivery"] = this.$store.getters.getSelectedId;
      this.$store
        .dispatch("postData", {
          inc_url: "deliveryarcdoc",
          params: this.new_doc,
        })
        .then(() => this.loadListData());
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event["arc_doc_id"]}/`);
    },
    onDeleteClick() {
      // Удаляем отмеченную строку
      this.$store
        .dispatch("deleteData", {
          inc_url: "deliveryarcdoc",
          id: this.link_id,
        })
        // Обновление списка
        .then(() => this.loadListData());
    },
    onSaveClick() {
      for (const q of this.list_data.filter(
        (row) => (row.link_id = this.link_id)
      )) {
        // Значения для редактирования
        this.edit_doc.exemplar_num = q.exemplar_num;
      }
      this.$store
        .dispatch("patchData", {
          inc_url: "deliveryarcdoc",
          id: this.link_id,
          params: this.edit_doc,
        })
        // Обновление списка извещений
        .then(() => this.loadListData());
    },
  },
  watch: {
    selected_id() {
      this.loadListData();
    },
  },
  mounted() {
    if (this.selected_id) this.loadListData(); // На случай, если выдача уже указана
  },
};
</script>
