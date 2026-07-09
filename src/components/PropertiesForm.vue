<template>
  <div>
    <Form
      :model="prop_values"
      :labelWidth="label_width"
      :rules="rules"
      labelAlign="right"
      style="max-width: 800px"
      v-if="Object.keys(prop_values).length > 0"
    >
      <FormField
        v-for="(f, index) of prop_fields.filter((el) => el.type != 'Hide')"
        :key="index"
        :name="f.name"
        :label="f.label"
      >
        <TextBox
          v-if="f.type == 'EntityLabel'"
          v-model="prop_values[f.name]"
          :readonly="true"
          :editable="false"
          :inputStyle="{ backgroundColor: '#fd97b0' }"
        >
        </TextBox>
        <TextBox
          v-if="f.type == 'TextBox'"
          v-model="prop_values[f.name]"
          :validateOnBlur="true"
          :readonly="f.read_only"
          :editable="!f.read_only"
          @blur="blur(f.leave_func)"
        ></TextBox>
        <TextBox
          v-if="f.type == 'TextBoxMultiline'"
          v-model="prop_values[f.name]"
          :multiline="true"
          :style="f.field_style"
        >
          <Addon>
            <span
              class="textbox-icon icon-edit"
              title="Редактировать"
              @click="openTextEditForm(f.name)"
            ></span> </Addon
        ></TextBox>
        <PasswordBox
          v-if="f.type == 'PasswordBox'"
          v-model="prop_values[f.name]"
        ></PasswordBox>
        <ComboBox
          v-if="f.type == 'List'"
          v-model="prop_values[f.name]"
          :data="f.data"
        ></ComboBox>
        <ComboBox
          v-if="f.type == 'Link'"
          v-model="prop_values[f.name]"
          valueField="pk"
          textField="value"
          :data="ref_data[f.name]"
          :lazy="true"
          @filterChange="onFilterChange($event, f.name, f.target)"
          ><Addon v-show="f.name in prop_links">
            <span
              class="textbox-icon icon-go"
              title="Открыть свойства"
              @click="openLink(prop_links[f.name].url)"
            ></span>
          </Addon>
        </ComboBox>
        <SwitchButton
          v-if="f.type == 'CheckBox'"
          v-model="prop_values[f.name]"
        ></SwitchButton>
        <DateBox
          v-if="f.type == 'DateBox'"
          v-model="prop_values[f.name]"
          format="dd.MM.yyyy"
          :firstDay="1"
        ></DateBox>
        <NumberBox
          v-if="f.type == 'NumberBox'"
          v-model="prop_values[f.name]"
          :precision="-1"
          :groupSeparator="' '"
        ></NumberBox>
        <NumberBox
          v-if="f.type == 'NumberBoxInt'"
          v-model="prop_values[f.name]"
          :precision="0"
          :readonly="f.read_only"
          :editable="!f.read_only"
        ></NumberBox>
        <TextBox
          v-if="f.type == 'FormatFrom'"
          v-model="prop_values[f.name]"
          :readonly="true"
          :editable="false"
          ><Addon v-show="checkEdit('edit')">
            <span
              class="textbox-icon icon-edit"
              title="Редактировать"
              @click="openFormatForm()"
            ></span>
          </Addon>
        </TextBox>
        <TextBox
          v-if="f.type == 'Ref'"
          v-model="prop_values[f.name]"
          :editable="false"
          ><Addon align="left"
            ><a :href="prop_links[f.name].url" style="padding-left: 3px">{{
              prop_links[f.name].value
            }}</a></Addon
          ></TextBox
        >
      </FormField>
      <FormField
        v-if="
          checkEdit('edit') ||
          checkEdit(this.create_right) ||
          checkEdit('properties')
        "
      >
        <LinkButton
          v-if="checkEdit(this.create_right)"
          iconCls="icon-add"
          style="margin: 5px"
          @click="submitFormCreate()"
          >Создать</LinkButton
        >
        <LinkButton
          v-if="mode == 'edit' || checkEdit('edit') || checkEdit('properties')"
          iconCls="icon-save"
          style="margin: 5px"
          @click="submitFormSave()"
          >Сохранить</LinkButton
        >
        <div v-if="show_staff_through">
          <CheckBox
            inputId="allstaff"
            v-model="staff_through"
            title="Изменить состояние у всех, входящих в состав, в.т.ч. исполнений"
          ></CheckBox>
          <Label for="allstaff" style="width: 120px">Включая входящие</Label>
        </div>
        <div v-if="base_rendition">
          <CheckBox
            inputId="allrenditions"
            v-model="all_renditions"
            title="Изменить состояние у всех исполнений"
          ></CheckBox>
          <Label for="allrenditions" style="width: 130px"
            >Включая исполнения</Label
          >
        </div>
        <LinkButton
          v-if="mode == 'edit' || checkEdit('edit')"
          iconCls="icon-no"
          style="margin: 5px"
          @click="submitFormDelete()"
          >Удалить</LinkButton
        >
        <LinkButton
          v-if="(mode == 'edit' || checkEdit('edit')) && sub_type_key == 'order'"
          iconCls="icon-clear"
          style="margin: 5px"
          @click="submitFormOrderClear()"
          >Очистить заказ</LinkButton
        >
        <LinkButton
          v-if="(mode != 'create')"
          iconCls="icon-excel"
          style="margin: 5px"
          title="Вывести свойства в файл"
          @click="submitFormPrint()"
        ></LinkButton>
      </FormField>
    </Form>
    <format-form
      ref="formatform"
      @formatsclosed="refreshFormats"
      :editable="checkEdit('edit')"
    ></format-form>
    <text-edit-form
      ref="texteditform"
      @texteditclosed="getTextValue"
      :editable="checkEdit('edit') || checkEdit(this.create_right)"
    ></text-edit-form>
    <spec-chars-form ref="speccharsform"></spec-chars-form>
  </div>
</template>

<script>
import { getData, dowloadFile } from "@/api/api";
import { getPropValues, getPropsList, getSuggest } from "@/api/utils";
import { toJson } from "@/api/formatters.js";

// Импорт компонентов
import FormatForm from "@/components/FormatForm.vue";
import TextEditForm from "@/components/TextEditForm.vue";
import SpecCharsForm from "@/components/common/SpecCharsForm.vue";
import { mapState } from "vuex";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования
import { extender } from "@/components/pdm/extra_modules.js"; // Дополнительный функционал
import { dateToPythonStr } from "@/api/formatters";

export default {
  mixins: [editable_component, extender],
  data() {
    return {
      prop_values: {}, // Словарь со значениями свойств
      prop_links: {}, // Словарь со значениями ссылок (pk, value)
      prop_fields: [], // Список с перечнем полей формы
      ref_data: {}, // Данные для справочных полей подстановки
      list_keys: {}, // Дополнительные ключи для отбора значений в полях подстановки
      rules: {}, // Правила для проверки значений в полях
      object_id: null, // Идентификатор просматриваемого объекта
      show_staff_through: false, // Признак отображения галочки "Включая входящие"
      staff_through: false, // Признак изменения состояний во всем составе
      base_rendition: false, // Признак отображения галочки "Включая исполнения"
      all_renditions: false, // Признак изменения состояний у всех состояний
      sub_type_key: '' // Тип объекта состава (для объектов состава)
    };
  },
  props: {
    mode: String, // Режим работы формы (create - создание, edit - редактрование)
    form_fields: Array, // Список с перечнем полей формы (может быть передан или не передан извне)
    label_width: {
      // Ширина панелей подписей у полей
      default: 200,
    },
    create_right: {
      // Название права, необходимого для отображения кнопки Создать
      default: "create",
    },
  },
  components: {
    FormatForm, // Форма назначения списка форматов
    TextEditForm, // Форма редактирования многотекстовых полей
    SpecCharsForm,
  },
  computed: mapState(["type_key", "root_id"]),
  methods: {
    openFormatForm() {
      this.$refs.formatform.openForm();
    },
    async refreshFormats() {
      // Обновление поля Форматы после редактирования их списка в отдельной форме
      const prepareFormats = (node) => {
        if (node["list_quantity"] == 1) return node["format"];
        return `${node["list_quantity"]}x${node["format"]}`;
      };
      const setGroup = (group_codes) => {
        if (group_codes.length) {
          // Заполняем поле Классификационная группа
          this.prop_values["group"] = group_codes[0]["pk"];
        }
      };
      const res = await getData(this, "partobjectformat/", {
        part_object: this.$store.getters.getRootId,
      });
      let formats = res.map(prepareFormats).join(", ");
      this.prop_values["formats"] = formats;
      if (this.prop_values["group"] == null) {
        // Если группа еще не указана
        // Назначение группы "Без чертежа" при наличии формата БЧ
        if (formats && formats.search("БЧ") > -1) {
          // Если формат содержит БЧ
          // Получение идентификатора группы "Без чертежа"
          this.ref_data["group"] = await getSuggest(
            this,
            "classification",
            "Детали без чертежа"
          );
          setGroup(this.ref_data["group"]);
          // Рекомендация разработчиков Easyui
          // Для надежного обновления данных в компоненте
          this.ref_data = Object.assign({}, this.ref_data);
        }
      }
    },
    openTextEditForm(field_id) {
      this.$refs.texteditform.openForm(
        field_id,
        this.prop_values[field_id] // Передаем текущее значение редактируемого поля
      );
    },
    getTextValue(field_id, value) {
      // Получение отредактированного текстового значения из формы
      this.prop_values[field_id] = value;
    },
    prepareLinkUrl(target, pk) {
      // Формирования текста ссылки из ссылочного поля
      // Разрешенные варинаты ссылок
      const permitted_targets = ["classification", "measureunit"];
      if (target == "partobject") return pk; // Для объектов конструкции
      // Для разрешенных вариантов
      if (permitted_targets.includes(target)) return `${target}/${pk}`;
      return null; // Для всех остальных
    },
    async prepareForm() {
      if (typeof this.form_fields != "undefined") {
        this.prop_fields = this.form_fields;
      } else {
        // Если ничего не передано в параметр - получаем из свойств
        if (!this.type_key) return; // Если не указан тип - выходим
        this.prop_fields = await getPropsList(
          this,
          this.type_key,
          this.$store.getters.getSubTypeKey
        );
      }
      if (this.prop_fields == []) return; // Если нет описаний полей, то нет смысла дальше

      let properties = {};
      this.prop_values = {}; // Почему-то без этого не работает
      if (this.mode != this.create_right) {
        // Свойства экземпляра получаем только для режима просмотра или редактирования если выбран экземпляр
        if (this.object_id)
          properties = await getPropValues(this, this.type_key, this.object_id);
      } else {
        // Заполняем значениями по умолчанию из свойств
        for (let p in this.prop_fields) {
          properties[this.prop_fields[p].name] = toJson(
            this.prop_fields[p].default
          );
        }
      }
      for (let i = 0; i < this.prop_fields.length; i++) {
        // проходим по массиву описаний свойств
        let field_name = this.prop_fields[i].name;
        // TODO: Упростить и сделать отдельной функцией
        if (field_name in properties) {
          // В режиме create отображаютя не все поля
          if (
            this.mode == "create" &&
            this.prop_fields[i].hide_in_create == true
          ) {
            this.prop_fields[i].type = "Hide"; // Это поле будет скрыто
          }
          // если свойство есть в массиве значений
          // заполняем значение и добавляем в массив
          if (this.prop_fields[i].type == "DateBox" && properties[field_name])
            // Преобразуем текст в дату
            this.prop_values[field_name] = new Date(properties[field_name]);
          else if (
            this.prop_fields[i].type == "Link" // Поле - Динамическая ссылка
          ) {
            if (properties[field_name]) {
              // Если для поля передано значение
              this.prop_values[field_name] = properties[field_name].pk; // Извлекаем ключ из ссылки
              // Добавляем строку (ЭЛЕМЕНТ СПИСКА) в массив значений
              this.ref_data[field_name] = [properties[field_name]];
              // Формируем ссылку для перехода из формы
              const url = this.prepareLinkUrl(
                this.prop_fields[i].target,
                properties[field_name]["pk"]
              );
              if (url) {
                // Записываем в массив только непустые ссылки
                this.prop_links[field_name] = properties[field_name];
                this.prop_links[field_name]["url"] = url;
              }
            }
            if (this.prop_fields[i].list_keys) {
              // Проверяем наличие дополнительных фильтров для постановки
              // Добавляем дополнительные параметры фильтрации в массив
              this.list_keys[field_name] = JSON.parse(
                this.prop_fields[i].list_keys
              );
            } else this.list_keys[field_name] = {}; // Пустой набор
          } else if (
            this.prop_fields[i].type == "List" && // Поле - Фиксированный список
            properties[field_name]
          ) {
            this.prop_values[field_name] = properties[field_name];
          } else if (
            this.prop_fields[i].type == "Ref" // Поле - фиксированная ссылка
          ) {
            if (properties[field_name]) {
              this.prop_values[field_name] = null; // Текст отображаться не будет
              this.prop_links[field_name] = properties[field_name];
              this.prop_links[field_name][
                "url"
              ] = `${this.$store.getters.getHostUrl}/${properties[field_name]["pk"]}/`; // Формируем абсолюную ссылку (отностительная формируется неправильно)
            } else {
              this.prop_fields[i].type = "Hide"; // Это поле будет скрыто
            }
          } else if (
            this.prop_fields[i].type == "CheckBox" &&
            !properties[field_name] // Поле Да/Нет и для него нет свойств
          ) {
            this.prop_values[field_name] = false; // По умолчанию, чтобы не было ошибок при сохранении
          } else if (this.prop_fields[i].type == "EntityLabel") {
            if (properties[field_name])
              this.prop_values[field_name] = properties[field_name];
            else this.prop_fields[i].type = "Hide"; // Это поле будет скрыто
          } else this.prop_values[field_name] = properties[field_name];
          // Если указано, что поле обязательное, то добавляем правило
          if (this.prop_fields[i].required || false == true) {
            this.rules[field_name] = "required";
          }
        } else this.prop_values[field_name] = null;
      }
      // Рекомендация разработчиков Easyui
      // Для надежного обновления данных в
      this.prop_values = Object.assign({}, this.prop_values);
    },
    async onFilterChange(event, field_name, target) {
      this.ref_data[field_name] = await getSuggest(
        this,
        target,
        event.filterValue,
        this.list_keys[field_name] // Дополнительные параметры для фильтрации
      );
      // Рекомендация разработчиков Easyui
      // Для надежного обновления данных в компоненте
      this.ref_data = Object.assign({}, this.ref_data);
    },
    prepareDataToSave(srcData) {
      // TODO: Перенести в утиллиты (есть така же еще в TypeSizeSort)
      // Форматирование данных перед передачей на сервер
      let res_data = {};
      Object.entries(srcData).forEach(([key, value]) => {
        if (value instanceof Date) {
          // Приведение даты к нужному формату (2021-12-31)
          res_data[key] = dateToPythonStr(value);
        } else res_data[key] = value;
      });
      // Признак изменения состояний всего состава
      if (this.show_staff_through)
        res_data["staff_through"] = this.staff_through;
      // Признак изменения состояний всех исполнений
      if (this.base_rendition) res_data["all_renditions"] = this.all_renditions;
      return res_data;
    },
    async submitFormCreate() {
      this.$store
        .dispatch("postData", {
          inc_url: this.type_key,
          params: this.prepareDataToSave(this.prop_values),
        })
        .then(this.afterCreate); // Выполняем действия после создания
    },
    async submitFormSave() {
      this.$store.dispatch("patchData", {
        inc_url: this.type_key,
        id: this.object_id,
        params: this.prepareDataToSave(this.prop_values),
      });
    },
    async submitFormDelete() {
      this.$messager.confirm({
        title: "Подтверждение удаления",
        msg: "Вы уверены, что удаление необходимо?",
        result: (answer) => {
          if (answer) {
            this.$store.dispatch("deleteData", {
              inc_url: this.type_key,
              id: this.object_id,
            });
          }
        },
      });
    },
    async submitFormOrderClear() {
      this.$messager.confirm({
        title: "Подтверждение очистки заказа",
        msg: "Вы уверены, что все позиции заказ нужно удалить?",
        result: (answer) => {
          if (answer) {
            this.$store.dispatch("postData", {
              inc_url: 'clearorder',
              params: {parent: this.object_id},
            });
          }
        },
      });
    },
    async submitFormPrint() {
      // Скачивание отчета со свойствами объекта
      // Формируем адрес для запроса
      let url = this.$store.getters.getHostUrl;
      // ФОрмируем адрес запроса к файлу
      url += `/report/object_properties/get_report/?object_id=${this.object_id}&type_key=${this.type_key}&sub_type_key=${this.$store.getters.getSubTypeKey}`;
      const file_name = `${this.prop_values.code} свойства.xls`; // Формируем имя скачиваемого файла
      // Скачиваем файл
      dowloadFile(url, file_name, this);
    },
    afterCreate() {
      // Выполняется после создания объекта
      this.$store.commit("setListReloadNeeded"); // Выставляем флаг необходимости перезагрузки списка
    },
    openLink(url) {
      // Открытие ссылки
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${url}/`);
    },
    blur(func_name) {
      // Вызов функции, указанной для поля при потере полем фокуса
      if (func_name) {
        this[func_name]();
      }
    },
  },
  created() {
    // Запоминаем исходные параметры
    this.object_id = this.$store.getters.getRootId;
    // Признаки отображения галочек
    this.show_staff_through = typeof show_staff_through != "undefined";
    this.base_rendition = typeof base_rendition != "undefined";
    // Для объектов состава дополнительно
    this.sub_type_key = this.$store.getters.getSubTypeKey;
    this.prepareForm();
  },
  watch: {
    root_id() {
      this.object_id = this.$store.getters.getRootId;
      this.prepareForm();
    },
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
.entity_label {
  background-color: #fd97b0;
  float: right;
  margin: 8px;
  padding: 0 5px 0 5px;
}
</style>
