<template>
  <div id="App">
    <Layout ref="layout" style="width: 100%; height: 100%">
      <LayoutPanel region="North" style="width: 100%; height: 62px">
        <menu-bar></menu-bar>
        <message-bar></message-bar>
      </LayoutPanel>
      <LayoutPanel region="center" bodyCls="f-column" style="height: 100%">
        <div>
          <Form
            :model="params_values"
            :labelWidth="250"
            labelAlign="right"
            style="max-width: 600px"
          >
            <FormField
              v-for="(f, index) of params_fields"
              :key="index"
              :name="f.param_name"
              :label="f.caption"
            >
              <TextBox
                v-if="f.param_type == 'TextBox'"
                v-model="params_values[f.param_name]"
              ></TextBox>
              <ComboBox
                v-if="f.param_type == 'List'"
                v-model="params_values[f.param_name]"
                :data="f.data"
              ></ComboBox>
              <ComboBox
                v-if="f.param_type == 'Link'"
                v-model="params_values[f.param_name]"
                valueField="pk"
                textField="value"
                :data="ref_data[f.param_name]"
                :lazy="true"
                @filterChange="
                  onFilterChange(
                    $event,
                    f.param_name,
                    f.extra_value || 'partobject'
                  )
                "
              ></ComboBox>
              <CheckBox
                v-if="f.param_type == 'CheckBox'"
                v-model="params_values[f.param_name]"
              ></CheckBox>
              <DateBox
                v-if="f.param_type == 'DateBox'"
                v-model="params_values[f.param_name]"
                format="dd.MM.yyyy"
                :firstDay="1"
              ></DateBox>
              <NumberBox
                v-if="f.param_type == 'NumberBox'"
                v-model="params_values[f.param_name]"
                :precision="0"
                :groupSeparator="' '"
              ></NumberBox>
              <div v-if="f.param_type == 'RadioButton'">
                <div v-for="(val, id) in f.values_list" :key="id">
                  <RadioButton
                    :name="f.param_name"
                    :inputId="id"
                    :value="id"
                    v-model="params_values[f.param_name]"
                  ></RadioButton>
                  <Label :for="id">{{ val }}</Label>
                </div>
              </div>
            </FormField>
            <FormField label="Формат отчета">
              <ComboBox
                v-model="params_values['output_format']"
                valueField="pk"
                textField="value"
                :data="report_formats"
              ></ComboBox>
            </FormField>
            <FormField>
              <LinkButton
                v-show="!loading"
                iconCls="icon-print"
                style="margin: 10px"
                @click="submitPrint()"
                >Сформировать</LinkButton
              >
              <img
                v-show="loading"
                src="@/assets/images/preloader.gif"
                alt="Loading"
                style="margin-left: 100px"
              />
            </FormField>
          </Form>
        </div>
      </LayoutPanel>
      <LayoutPanel region="south">
        <status></status>
      </LayoutPanel>
    </Layout>
  </div>
</template>

<script>
// import axios from "axios";
import { getData, dowloadFile } from "@/api/api";
import { getSuggest, isValidHttpUrl } from "@/api/utils";
import { dateToStr } from "@/api/formatters";
import { page } from "@/pages/Page/mixin.js"; // Общий функционал всех страниц

// Импорт компонентов
import MenuBar from "@/components/MenuBar.vue";
import MessageBar from "@/components/MessageBar.vue";
import Status from "@/components/Status.vue";

export default {
  mixins: [page],
  data() {
    return {
      params_values: {
        output_format: "PDF", // Формат отчета по умолчанию
      }, // Словарь со значениями свойств
      params_fields: [], // Список с перечнем полей формы
      ref_data: {}, // Данные для справочных полей подстановки
      list_keys: {}, // Дополнительные ключи для отбора значений в полях подстановки
      report_name: "", // Имя формируемого отчета
      file_name: "", // Имя формируемого файла
      module_url: "", // Адрес внешнего модуля формирования
      report_formats: [
        { pk: "PDF", value: "pdf" },
        { pk: "XLS", value: "xls" },
      ],
      loading: false, // Признак протекания загрузки отчета
      object_field: null,
      object_id: null, // Идентификатор объекта, на который формируется отчет
      // code: "", // Обозначение объекта, на который формируется отчет
    };
  },
  components: {
    MenuBar,
    MessageBar,
    Status,
  },
  methods: {
    prepareForm() {
      const parseRow = (row_node) => {
        // Превращаем текст со значениями в массив
        if (row_node["values_list"])
          row_node["values_list"] = JSON.parse(row_node["values_list"]);
        // Запоминание значения по умолчанию
        if (row_node["default_value"])
          if (row_node["param_type"] == "NumberBox")
            // Преобразуем в целое число
            this.params_values[row_node["param_name"]] = parseInt(
              row_node["default_value"]
            );
          else if (row_node["param_type"] == "CheckBox")
            // Если какое-то значение задано, то True
            this.params_values[row_node["param_name"]] = row_node[
              "default_value"
            ]
              ? true
              : false;
          else if (row_node["param_type"] == "RadioButton")
            this.$set(
              this.params_values,
              row_node["param_name"],
              row_node["default_value"]
            );
          // Чтобы радиокнопка работала корректно
          else
            this.params_values[row_node["param_name"]] =
              row_node["default_value"];
        else this.params_values[row_node["param_name"]] = null; // Иначе просто пустое значение
        if (row_node["is_file_name"]) {
          // Запоминаем название поля, в котором будет ключ для определения названия отчета
          this.object_field = row_node["param_name"];
        }
        if (row_node.list_keys) {
          // Проверяем наличие дополнительных фильтров для постановки
          // Добавляем дополнительные параметры фильтрации в массив
          this.list_keys[row_node["param_name"]] = JSON.parse(
            row_node.list_keys
          );
        } else this.list_keys[row_node["param_name"]] = {}; // Пустой набор
        return row_node;
      };
      // Получаем параметры формирования указанного отчета
      try {
        getData(this, `reportparams/${this.report_name}/`).then((response) => {
          this.params_fields = response.map(parseRow);
          // Заполнение поля "Обозначение" переданным идентификатором
          if (this.object_id && "object_id" in this.params_values) {
            getData(this, `entity/${this.object_id}`).then((response) => {
              this.ref_data["object_id"] = [
                {
                  pk: response.pk,
                  value: response.code,
                },
              ];
              this.params_values["object_id"] = this.object_id;
              this.ref_data = Object.assign({}, this.ref_data);
            });
          }
        });
      } catch (error) {
        throw new Error(
          `Не удалось получить параметры формирования отчета ${this.report_name}`
        );
      }
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
    getFullUrl() {
      // Формирование полного адреса запроса к отчету (с параметрами)
      let full_url = "";
      let par = (key, value) => {
        return `&${key}=${value}`;
      }; // Способ описания параметров
      if (this.module_url) {
        // Если запрос идет ко внешнему модулю формирования
        // Способ описания параметров другой
        full_url = this.module_url;
        full_url += "&btnReport=Do"; // Отметка о нажатии кнопки Формировать
        par = (key, value) => {
          return `&val[${key}]=${value}`;
        };
        // Добавляем идентификатор сессии пользователя
        const status = this.$store.getters.getStatus;
        full_url += `&val[session]=${status["user_session_id"]}`;
      } else {
        full_url = `report/${this.report_name}/get_report/?`; // Адрес во внутренней системе генерации отчетов
      }
      // Наполнение параметрами запроса
      Object.entries(this.params_values).forEach(([key, value]) => {
        if (value) {
          // Заполняем только параметры, имеющие значения
          if (value instanceof Date) {
            // Приведение даты к нужному формату (31.12.2021)
            full_url += par(key, dateToStr(value));
          } else full_url += par(key, value);
        }
      });
      return full_url;
    },
    async prepareFileName() {
      // Формирование имени загружаемого файла
      let fn = this.file_name;
      if (this.object_field && this.params_values[this.object_field]) {
        // Если указано поле с параметром объекта
        // Получние данных для названия
        const response = await getData(
          this,
          `entity/${this.params_values[this.object_field]}`
        );
        if (response.code) {
          if (fn && fn.indexOf("{%code%}") > 0)
            fn = fn.replace(
              "{%code%}",
              response.code
            ); // Если это шаблон, заменяем
          else fn = response.code + " " + fn; // Добавляем обозначение к названию файла
        }
      }
      return `${fn}.${this.params_values.output_format.toLowerCase()}`;
    },
    async downloadReport() {
      // Скачивание отчета по указанной ссылке
      const url = this.getFullUrl(); // Формируем адрес для запроса
      const file_name = await this.prepareFileName(); // Формируем имя скачиваемого файла
      // Скачиваем файл
      dowloadFile(url, file_name, this);
    },
    redirectToReport() {
      // Переход на соотвествующую ссылку отчета
      const host = this.$store.getters.getHostUrl;
      let url = this.getFullUrl(); // Формируем адрес для запроса
      window.open(`${host}/${url}`, "_self"); // Открыть в текущем окне
      this.loading = false;
    },
    submitPrint(event) {
      this.loading = true;
      // Проверяем, является ли адрес модуля внешней http-ссылкой
      if (isValidHttpUrl(this.module_url))
        this.downloadReport(); // Скачиваем извне
      // Иначе отпавляем на встроенный отчет
      else this.redirectToReport();
    },
  },
  created() {
    if (typeof host_url != "undefined")
      this.$store.commit("setHostUrl", host_url);
    if (typeof module_url != "undefined") this.module_url = module_url;
    if (typeof report_name != "undefined") this.report_name = report_name;
    if (typeof file_name != "undefined") this.file_name = file_name;
    else this.file_name = "file";
    if (typeof only_format != "undefined") {
      // Если указан единственный возможный формат отчета
      this.report_formats = [{ pk: only_format, value: only_format }];
      this.params_values.output_format = only_format;
    }
    // Если в параметрах формирования передан идентификатор объекта
    if (typeof object_id != "undefined") this.object_id = object_id;

    this.prepareForm();
  },
};
</script>

<style>
html,
body,
#App {
  height: 100%;
  margin: 0;
  padding: 0;
  background: linear-gradient(45deg, #a9c6e1, #c6f7fc);
}
</style>
