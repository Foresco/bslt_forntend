<template>
  <div>
    <form ref="fileform">
      <Form
        ref="fileform"
        :model="new_file"
        :labelWidth="100"
        labelAlign="right"
        style="max-width: 600px"
        v-if="checkEdit('objectfiles')"
      >
        <FormField :key="1" name="doc_type" label="Тип документа">
          <ComboBox
            v-model="new_file.doc_type"
            :data="doc_types"
            valueField="pk"
            textField="list_value"
          ></ComboBox>
        </FormField>
        <FormField :key="2" name="notice" label="Извещение">
          <ComboBox
            ref="notice"
            v-model="new_file.notice"
            style="width: 150px"
            :data="notices"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getNotices($event)"
          ></ComboBox>
          <NumberBox
            :title="'Номер изменения'"
            v-model="new_file.change_num"
            :precision="0"
            :min="1"
            style="width: 60px"
          ></NumberBox>
          <ComboBox
            :title="'Тип изменения'"
            v-model="new_file.change_type"
            :data="change_types"
            valueField="pk"
            textField="list_value"
            style="width: 80px"
            :limitToList="true"
          ></ComboBox>
        </FormField>
        <FormField :key="3" name="file" label="Файл">
          <FileButton
            style="width: 100px"
            :multiple="true"
            @select="onFilesSelect($event)"
            >Выбрать...</FileButton
          >
          {{ files_names }}
        </FormField>
        <FormField :key="4" name="stage" label="Стадия">
          <ComboBox
            v-model="new_file.version_stage"
            :data="stages"
            valueField="pk"
            textField="value"
            :lazy="true"
          ></ComboBox>
        </FormField>
        <FormField :key="5" name="designer" label="Разработал">
          <ComboBox
            v-model="new_file.designer"
            :data="designers"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getDesigners($event)"
          ></ComboBox>
        </FormField>
        <FormField :key="6" name="description" label="Описание">
          <TextBox v-model="new_file.description"></TextBox>
        </FormField>
        <FormField :key="7" name="watemark" label="Метка на pdf">
          <CheckBox v-model="new_file.watemark"></CheckBox>
          <DateBox
            v-model="new_file.watemark_date_d"
            format="dd.MM.yyyy"
            :firstDay="1"
          ></DateBox>
        </FormField>
        <div class="buttons_bar">
          <LinkButton
            iconCls="icon-add"
            v-show="regime == 'create' && !loading"
            style="margin-left: 100px"
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
      <GridColumn field="version_stage" title="Стадия" width="70"></GridColumn>
      <GridColumn field="doc_type" title="Тип" width="100"></GridColumn>
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
      <GridColumn field="edit" width="35" v-if="checkEdit('objectfiles')">
        <template slot="body" slot-scope="scope">
          <LinkButton
            iconCls="icon-edit"
            @click="onEditClick(scope)"
            title="Редактировать файл и свойства документа"
          ></LinkButton>
        </template>
      </GridColumn>
      <GridColumn
        field="upversion"
        width="35"
        v-if="checkEdit('newversionattache') && !all_versions"
      >
        <template
          slot="body"
          slot-scope="scope"
          v-if="scope.row.next_version_id"
        >
          <LinkButton
            iconCls="icon-arrow-up"
            @click="onUpVersionClick(scope)"
            title="Повысить версию файла"
          ></LinkButton>
        </template>
      </GridColumn>
    </DataGrid>
    <div class="buttons_bar">
      <CheckBox v-model="all_versions" inputId="av" @></CheckBox>
      <Label for="av"> Все версии</Label>
      <LinkButton
        v-if="checkEdit('objectfiles')"
        v-show="row_id"
        iconCls="icon-remove"
        title="Файл останется в архиве, но не будет связан с данным объектом"
        @click="onDisconnectClick()"
        >Отвязать</LinkButton
      >
      <LinkButton
        v-if="checkEdit('objectfiles')"
        v-show="row_id"
        style="margin-left: 5px"
        iconCls="icon-no"
        title="Файл, версия, роль и связи будут полностью удалены"
        @click="onDeleteClick()"
        >Удалить из архива</LinkButton
      >
      <DateBox
        v-if="checkEdit('wmdownload')"
        style="margin-left: 15px"
        v-show="row_id"
        v-model="download_watemark_date_d"
        format="dd.MM.yyyy"
        :firstDay="1"
      ></DateBox>
      <LinkButton
        v-if="checkEdit('wmdownload')"
        v-show="row_id"
        style="margin-left: 5px"
        iconCls="icon-arrow-down"
        title="Скачать файл с меткой"
        @click="onWmDownloadClick()"
        >Скачать с меткой</LinkButton
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
import { dateToStr } from "@/api/formatters";

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
      change_types: [], // Список с типами изменений
      notices: [], // Список с извещениями
      designers: [], // Список разработчиков
      stages: [], // Список со стадиями
      row_id: null, // Идентификатор выбранной строки
      version_id: null, // Идентификатор выбранной версии документа
      regime: "create", // Режим работы формы
      all_versions: false, // Признак отображения всех версий
      download_watemark_date_d: new Date(), // Дата для скачивания с меткой
      loading: false, // Признак, что идет загрузка
    };
  },
  computed: mapState(["root_id"]),
  methods: {
    getNewFileData() {
      return {
        data_format: "",
        doc_type: 1, // Вариант пустое значение
        file_name: "",
        description: null,
        file: null,
        entity: null,
        notice: null,
        change_type: null,
        change_num: null,
        version_stage: null,
        designer: null,
        watemark: true,
        watemark_date_d: new Date(),
        watemark_date: null,
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
      row_node.notice_url = `${host}/${row_node.notice_id}`;
      row_node.izm = row_node.change_num
        ? `изм. ${row_node.change_num} ${row_node.change_type || ""}`
        : row_node.change_type || "";
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
      this.doc_types = await getListValues(this, "documenttype");
    },
    async getChangeTypes() {
      // Получение списка подстановки для поля Тип изменения
      this.change_types = await getListValues(this, "changetype");
    },
    async getCurDesigner() {
      // Получение соответствующего текущему пользователю дизайнера
      const d = await getData(this, "curdesingner");
      if (Object.keys(d).length) {
        this.designers.push(d);
        this.new_file.designer = d.pk;
      }
    },
    async getStages(event) {
      // Получение списка подстановки для поля Стадия
      this.stages = await getSuggest(this, "stage");
    },
    async getNotices(event) {
      // Получение списка подстановки для поля Извещение
      this.notices = await getSuggest(this, "notice", event.filterValue);
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
        this.new_file.watemark_date = dateToStr(this.new_file.watemark_date_d);
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
      this.new_file.change_num = scope.row.change_num;
      this.new_file.change_type = scope.row.change_type_id;
      this.new_file.description = scope.row.description;
      this.new_file.file_document_id = scope.row.file_document_id;
      this.new_file.document_version = scope.row.document_version_id; // без id потому, что так надо
      this.new_file.design_role_id = scope.row.design_role_id;
      this.new_file.digital_file_id = scope.row.file_id;
      this.check_file_name = scope.row.file_name;
      this.files_names = `Выберите файл: ${scope.row.file_name}!`; // Для отображения на форме
      // Поля со списками подстановки
      this.notices = [{ pk: scope.row.notice_id, value: scope.row.notice_num }];
      this.new_file.notice = scope.row.notice_id;
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
    onUpVersionClick(scope) {
      // Повышаем версию файла
      this.$store
        .dispatch("patchData", {
          inc_url: "entitydocumentversion",
          id: scope.row.pk,
          params: { document_version: scope.row.next_version_id },
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
    redirectToReport() {
      // Скачивание файла с меткой
      const host = this.$store.getters.getHostUrl;
      let url = this.getFullUrl(); // Формируем адрес для запроса
      window.open(`${host}/${url}`, "_self"); // Открыть в текущем окне
      this.loading = false;
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
    this.getChangeTypes();
    this.getStages();
    this.getCurDesigner();
    bindEvents(this); // Подключение drag-n-drop
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