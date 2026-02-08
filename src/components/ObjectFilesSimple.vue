<template>
  <div>
    <Form
      :model="new_file"
      :labelWidth="100"
      labelAlign="right"
      style="max-width: 600px"
      v-if="checkEdit('objectfilessimple')"
    >
      <FormField :key="1" name="doc_type" label="Тип документа">
        <ComboBox
          v-model="new_file.doc_type"
          :data="doc_types"
          valueField="pk"
          textField="list_value"
        ></ComboBox>
      </FormField>
      <FormField :key="3" name="file" label="Файл">
        <FileButton style="width: 100px" @select="onFileSelect($event)"
          >Выбрать...</FileButton
        >
        {{ new_file.file_name }}
      </FormField>
      <FormField :key="5" name="description" label="Описание">
        <TextBox v-model="new_file.description"></TextBox>
      </FormField>
      <div class="buttons_bar">
        <LinkButton iconCls="icon-add" @click="submitFormAdd()"
          >Добавить</LinkButton
        >
      </div>
    </Form>
    <DataGrid
      :data="list_data"
      selectionMode="single"
      :columnResizing="true"
      :rowCss="getRowClass"
      @rowSelect="onRowSelect($event)"
    >
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
      <GridColumn field="doc_type" title="Тип" width="100"></GridColumn>
      <GridColumn field="description" title="Описание" width="200"></GridColumn>
      <GridColumn field="version_num" title="Версия" width="50"></GridColumn>
    </DataGrid>
    <div class="buttons_bar">
      <CheckBox v-model="all_versions" inputId="av" @></CheckBox>
      <Label for="av"> Все версии</Label>
      <LinkButton
        v-if="checkEdit('objectfilessimple')"
        v-show="row_id"
        iconCls="icon-no"
        style="margin: 10px"
        @click="onDeleteClick()"
        >Удалить</LinkButton
      >
      <LinkButton
        v-if="checkEdit('objectfilessimple')"
        v-show="row_id"
        iconCls="icon-clear"
        style="margin: 10px"
        @click="onArchiveClick()"
        >В архив</LinkButton
      >
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { getListValues } from "@/api/utils";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования
import { mapState } from "vuex";

export default {
  mixins: [editable_component],
  data() {
    return {
      list_data: [],
      new_file: this.getNewFileData(),
      doc_types: [], // Список с типами документов
      row_id: null, // Идентификатор выбранной строки
      all_versions: false, // Признак отображения всех версий
      loading: false, // Признак, что идет загрузка
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    getNewFileData() {
      return {
        doc_code: "",
        data_format: "",
        doc_type: 1, // Вариант пустое значение
        file_name: "",
        description: null,
        file: null,
        entity: null,
      };
    },
    parseRow(row_node) {
      const host = this.$store.getters.getHostUrl;
      row_node.url = host + row_node.url;
      return row_node;
    },
    getRowClass(row) {
      // Опеределение класса выделения для строки
      if (row.old_version) {
        return "old_version";
      }
      return null;
    },
    async loadListData() {
      this.list_data = []; // Очистка списка
      if (this.selected_id) {
        // Если выбран объект
        let params = {
          entity: this.selected_id,
          all_versions: this.all_versions,
        };
        this.loading = true;
        const url = "entitydocuments/";
        const lines = await getData(this, url, params);
        this.list_data = lines.map(this.parseRow);
      }
      this.loading = false;
    },
    async getDocTypes() {
      // Получение списка подстановки для поля Тип документа
      this.doc_types = await getListValues(this, "documenttype");
    },
    onFileSelect(event) {
      this.new_file.file = event[0];
      this.new_file.file_name = event[0].name;
      this.new_file.data_format = event[0].type || "detect"; // Если не определился, то попробуем определить на сервере
    },
    onRowSelect(event) {
      this.row_id = event.pk; // Запоминаем выбранную строку
    },
    submitFormAdd() {
      // Добавление файла в архив
      if (!this.$store.getters.getSelectedId) {
        this.$store.commit("setMessage", {
          msg_icon: "error-message",
          msg_text: "Выберите объект для добавления файла",
        });
        return;
      }
      this.new_file.entity = this.$store.getters.getSelectedId;
      const getFormData = (object) =>
        Object.keys(object).reduce((formData, key) => {
          formData.append(key, object[key]);
          return formData;
        }, new FormData());
      const form = getFormData(this.new_file);

      // Добавление файла в базу данных
      this.$store
        .dispatch("putData", {
          inc_url: "uploadfile",
          data: form,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        // Обновление списка файлов
        .then((value) => {
          this.loadListData();
          this.clearForm();
        });
    },
    clearForm() {
      // Очистка содержимого формы
      this.new_file = this.getNewFileData();
    },
    onDeleteClick() {
      // Удаляем отмеченную строку
      this.$store
        .dispatch("deleteData", {
          inc_url: "entitydocumentversion",
          id: this.row_id,
        })
        // Обновление списка
        .then(() => this.loadListData());
    },
    onArchiveClick() {
      // Помещаем в архив отмеченную строку
      this.$store
        .dispatch("patchData", {
          inc_url: "entitydocumentversion",
          id: this.row_id,
          params: { old_version: true },
        })
        // Обновление списка
        .then(() => this.loadListData());
    },
  },
  watch: {
    selected_id() {
      this.loadListData();
    },
    all_versions() {
      this.loadListData();
    },
  },
  mounted() {
    this.getDocTypes();
    if (this.selected_id) this.loadListData(); // На случай, если объект уже указан
  },
};
</script>

<style>
.buttons_bar {
  margin-left: 5px;
}
.old_version {
  opacity: 0.6;
}
</style>