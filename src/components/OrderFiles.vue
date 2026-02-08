<template>
  <div>
    <form ref="fileform">
      <Form
        ref="fileform"
        :model="new_file"
        :labelWidth="160"
        labelAlign="right"
        style="max-width: 600px"
        v-if="checkEdit('orderfiles')"
      >
        <FormField :key="1" name="doc_type" label="Тип документа">
          <ComboBox
            v-model="new_file.doc_type"
            :data="doc_types"
            valueField="pk"
            textField="list_value"
          ></ComboBox>
        </FormField>
        <FormField :key="2" name="doc_name" label="Наименование документа">
          <TextBox v-model="new_file.doc_name"></TextBox>
        </FormField>
        <FormField :key="3" name="doc_code" label="Обозначение документа">
          <TextBox v-model="new_file.doc_code"></TextBox>
        </FormField>
        <FormField :key="4" name="designer" label="Разработал">
          <ComboBox
            v-model="new_file.designer"
            :data="designers"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getDesigners($event)"
          ></ComboBox>
        </FormField>
        <FormField :key="5" name="file" label="Файл">
          <FileButton
            style="width: 100px"
            :multiple="true"
            @select="onFilesSelect($event)"
            >Выбрать...</FileButton
          >
          {{ files_names }}
        </FormField>
        <div class="buttons_bar">
          <LinkButton
            iconCls="icon-add"
            v-show="regime == 'create' && !loading"
            style="margin-left: 160px"
            @click="submitFormAdd()"
            >Добавить</LinkButton
          >
          <LinkButton
            v-show="regime == 'save' && !loading"
            iconCls="icon-save"
            style="margin-left: 100px"
            @click="submitFormSave()"
            >Сохранить</LinkButton
          >
          <LinkButton
            v-show="!loading"
            iconCls="icon-clear"
            style="margin-left: 10px"
            @click="clearForm()"
            >Очистить форму</LinkButton
          >
          <img
            v-show="loading"
            src="@/assets/images/preloader.gif"
            alt="Loading"
            style="margin-left: 100px"
          />
        </div>
      </Form>
    </form>
    <DataGrid
      :data="list_data"
      selectionMode="single"
      :columnResizing="true"
      @rowSelect="onRowSelect($event)"
    >
      <GridColumn field="doc_type" title="Тип" width="100"></GridColumn>
      <GridColumn
        field="doc_name"
        title="Наименование документа"
        width="200"
      ></GridColumn>
      <GridColumn
        field="doc_code"
        title="Обозначение документа"
        width="200"
      ></GridColumn>
      <GridColumn
        field="designer"
        title="Разработал"
        width="110"
      ></GridColumn>
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
      <GridColumn field="edit" width="35" v-if="checkEdit('orderfiles')">
        <template slot="body" slot-scope="scope">
          <LinkButton
            iconCls="icon-edit"
            @click="onEditClick(scope)"
            title="Редактировать файл и свойства документа"
          ></LinkButton>
        </template>
      </GridColumn>
    </DataGrid>
    <div class="buttons_bar">
      <LinkButton
        v-if="checkEdit('orderfiles')"
        v-show="row_id"
        iconCls="icon-remove"
        title="Файл останется в архиве, но не будет связан с данным объектом"
        @click="onDisconnectClick()"
        >Отвязать</LinkButton
      >
      <LinkButton
        v-if="checkEdit('orderfiles')"
        v-show="row_id"
        style="margin-left: 5px"
        iconCls="icon-no"
        title="Файл, версия, роль и связи будут полностью удалены"
        @click="onDeleteClick()"
        >Удалить из архива</LinkButton
      >
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { getSuggest, getListValues } from "@/api/utils";
import { bindEvents } from "@/api/dragndrop";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования
import { mapState } from "vuex";

export default {
  mixins: [editable_component],
  data() {
    return {
      list_data: [],
      new_file: this.getNewFileData(),
      selected_files: [], // Выбранные для добавления файлы
      check_file_name: "", // Название редактируемого файла для контроля
      files_names: "", // Название файла для отображение на форме
      doc_types: [], // Список с типами документов
      designers: [], // Список разработчиков
      row_id: null, // Идентификатор выбранной строки
      version_id: null, // Идентификатор выбранной версии документа
      regime: "create", // Режим работы формы
      all_versions: false, // Признак отображения всех версий
      loading: false, // Признак, что идет загрузка
    };
  },
  computed: mapState(["root_id"]),
  methods: {
    getNewFileData() {
      return {
        data_format: "",
        doc_type: null,
        file_name: "",
        doc_code: null,
        doc_name: null,
        file: null,
        entity: null,
        designer: null,
        // Ссылки, заполняемые при редактировании
        file_document_id: null,
        document_version_id: null,
        design_role_id: null,
        digital_file_id: null,
      };
    },
    parseRow(row_node) {
      const host = this.$store.getters.getHostUrl;
      row_node.url = host + row_node.url;
      return row_node;
    },
    async loadListData() {
      this.list_data = []; // Очистка списка
      if (this.root_id) {
        // Если выбран объект
        this.loading = true;
        let params = {
          entity: this.root_id,
          all_versions: this.all_versions,
        };
        const url = "entitydocuments/";
        const lines = await getData(this, url, params);
        this.list_data = lines.map(this.parseRow);
        this.loading = false; // Завершение загрузки
        this.new_file.entity = this.root_id; // Изначально не заполнен
      }
    },
    async getDocTypes() {
      // Получение списка подстановки для поля Тип документа
      this.doc_types = await getListValues(this, "documenttype", 1);
    },
    async getCurDesigner() {
      // Получение соответствующего текущему пользователю дизайнера
      const d = await getData(this, "curdesingner");
      if (Object.keys(d).length) {
        this.designers.push(d);
        this.new_file.designer = d.pk;
      }
    },
    async getDesigners(event) {
      // Получение списка подстановки для поля Разработчик
      this.designers = await getSuggest(this, "designer", event.filterValue);
    },
    onFilesSelect(event) {
      // Обработка события выбора файлов
      this.selected_files = this.selected_files.concat(event); // Запоминаем выбранные файлы
    },
    onRowSelect(event) {
      this.row_id = event.pk; // Запоминаем выбранную строку
      this.version_id = event.document_version_id; // Запоминаем выбранную версию документа
    },
    fnProcessFile(n) {
      // Функция манипуляций с файлом в архиве
      if (this.selected_files[n] != undefined) {
        // Заполняем информацию о файле
        this.new_file.file = this.selected_files[n];
        this.new_file.file_name = this.selected_files[n].name;
        this.new_file.data_format = this.selected_files[n].type || "detect"; // Если не определился, то попробуем определить на сервере
      }
      const getFormData = (object) =>
        Object.keys(object).reduce((formData, key) => {
          formData.append(key, object[key]);
          return formData;
        }, new FormData());
      const form = getFormData(this.new_file);

      // Добавление файла в базу данных
      this.loading = true;
      return this.$store.dispatch("putData", {
        inc_url: "uploadfile",
        data: form,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    submitFormAdd() {
      // Добавление файла в архив
      if (!this.root_id) {
        this.$store.commit("setMessage", {
          msg_icon: "error-message",
          msg_text: "Выберите объект для добавления файла",
        });
        return;
      }
      if (this.selected_files.length == 0) {
        this.$store.commit("setMessage", {
          msg_icon: "error-message",
          msg_text: "Выберите файлы для добавления/редактирования",
        });
        return;
      }
      let promises_list = [];
      for (let n in this.selected_files) {
        // Создаем запрос на загрузку
        let p = this.fnProcessFile(n);
        // Добавляем в очередь
        promises_list.push(p);
      }
      // Обновление списка файлов после выполнения всех запросов
      Promise.all(promises_list).then((values) => {
        this.selected_files = []; // Очищаем выбранные файлы
        this.loadListData();
      });
    },
    submitFormSave() {
      // Сохранение изменений в свойствах файла
      // Проверяем, правильно ли выбран файл (совпадает ли имя)
      if (
        this.selected_files[0] != undefined &&
        // При редактировании может измениться регистр
        this.check_file_name.toUpperCase() !=
          this.selected_files[0].name.toUpperCase()
      ) {
        this.$store.commit("setMessage", {
          msg_icon: "error-message",
          msg_text: `Выберите файл: ${this.check_file_name}!`,
        });
        this.selected_files = []; // Удаляем неверный файл
        return;
      }
      // Заполняем информацию о файле. Берем первый из списка (0)
      const p = this.fnProcessFile(0);
      p.then((value) => {
        this.loadListData();
        this.clearForm();
      });
    },
    onEditClick(scope) {
      this.row_id = scope.row.pk;
      this.new_file.doc_type = scope.row.doc_type_id;
      this.new_file.doc_code = scope.row.doc_code;
      this.new_file.doc_name = scope.row.doc_name;
      this.new_file.file_document_id = scope.row.file_document_id;
      this.new_file.document_version = scope.row.document_version_id; // без id потому, что так надо
      this.new_file.design_role_id = scope.row.design_role_id;
      this.new_file.digital_file_id = scope.row.file_id;
      this.check_file_name = scope.row.file_name;
      this.files_names = `Выберите файл: ${scope.row.file_name}!`; // Для отображения на форме
      // Поля со списками подстановки
      this.designers = [
        { pk: scope.row.designer_id, value: scope.row.designer },
      ];
      this.new_file.designer = scope.row.designer_id;

      // Очищаем данные о файле
      this.new_file.file = null;
      this.new_file.files_names = null;
      this.new_file.data_format = "";

      this.regime = "save";
    },
    clearForm() {
      // Очистка содержимого формы
      this.new_file = this.getNewFileData();
      this.selected_files = [];
      this.files_names = "";
      this.check_file_name = "";
      this.new_file.entity = this.root_id;
      this.regime = "create";
    },
    onDisconnectClick() {
      // Отвязываем отмеченную строку
      this.$store
        .dispatch("deleteData", {
          inc_url: "entitydocumentversion",
          id: this.row_id,
        })
        .then(() => this.loadListData());
    },
    onDeleteClick() {
      // Удаляем отмеченную строку
      this.$messager.confirm({
        title: "Подтверждение удаления",
        msg: "Вы уверены, что удаление версии и файла необходимо?",
        result: (answer) => {
          if (answer) {
            this.$store
              .dispatch("deleteData", {
                inc_url: "documentversion",
                id: this.version_id,
              })
              .then(() => this.loadListData());
          }
        },
      });
    },
    fnCheckFileNames() {
      // Проверка наличия файла в архиве
      let versions = []; // Обнаруженные версии файлов в архиве
      getData(this, "digitalfile", {
        file_names: this.selected_files.map((x) => x.name),
        entity: this.root_id,
      }).then((response) => {
        versions = response.map(
          (x) => `${x.file_name} версия ${x.version_num}`
        );
        if (versions.length) {
          this.$store.commit("setMessage", {
            msg_icon: "warning-message",
            msg_text: "Архив уже содержит: " + versions.join(", "),
          });
        }
      });
    },
  },
  watch: {
    all_versions() {
      this.loadListData();
    },
    selected_files() {
      this.files_names = this.selected_files
        .map((value) => value.name)
        .join(", "); // Для отображения на форме
      // Выполняем запрос на проверку наличия файлов в архиве
      if (this.files_names) this.fnCheckFileNames();
    },
  },
  mounted() {
    this.getDocTypes();
    this.getCurDesigner();
    bindEvents(this, 'orderfiles'); // Подключение drag-n-drop
    if (this.root_id) this.loadListData(); // На случай, если объект уже указан
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
.old_version {
  opacity: 0.6;
}
</style>