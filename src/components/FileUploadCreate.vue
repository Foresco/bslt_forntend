<template>
  <div>
    <Form
      :model="new_file"
      :labelWidth="100"
      labelAlign="right"
      style="max-width: 600px"
    >
      <FormField :key="1" name="file" label="Файл">
        <FileButton style="width: 100px" @select="onFileSelect($event)"
          >Выбрать...</FileButton
        >
        {{ new_file.file_name }}
      </FormField>
      <FormField :key="2" name="stage" label="Стадия">
        <ComboBox
          v-model="new_file.stage"
          :data="stages"
          valueField="pk"
          textField="value"
          :lazy="true"
          @filterChange="getStages($event)"
        ></ComboBox>
      </FormField>
      <FormField :key="3" name="prefix" label="Префикс">
        <ComboBox
          :title="'Префикс'"
          v-model="new_file.prefix"
          :data="prefixes"
          valueField="pk"
          textField="value"
          :lazy="true"
          @filterChange="getPrefixes($event)"
        ></ComboBox>
      </FormField>
      <div class="buttons_bar">
        <LinkButton
          iconCls="icon-add"
          style="margin-left: 10px"
          @click="submitFormAdd()"
          >Загрузить</LinkButton
        >
      </div>
    </Form>
    <div v-show="report" style="margin: 5px">
      {{ report }}
    </div>
  </div>
</template>

<script>
import { getSuggest } from "@/api/utils";

export default {
  data() {
    return {
      new_file: {
        data_format: "",
        file_name: "",
        file: null,
        prefix: null,
        stage: null,
      },
      prefixes: [], // Список с префиксами
      stages: [], // Список со стадиями
      report: "", // Отчет о результатах
    };
  },
  methods: {
    async getStages(event) {
      // Получение списка подстановки для поля Стадия
      this.stages = await getSuggest(this, "stage", event.filterValue);
    },
    async getPrefixes(event) {
      // Получение списка подстановки для поля Префикс
      this.prefixes = await getSuggest(this, "codeprefix", event.filterValue);
    },
    onFileSelect(event) {
      this.new_file.file = event[0];
      this.new_file.file_name = event[0].name;
      this.new_file.data_format = event[0].type;
    },
    submitFormAdd() {
      // Добавление загрузки в архив
      const getFormData = (object) =>
        Object.keys(object).reduce((formData, key) => {
          formData.append(key, object[key]);
          return formData;
        }, new FormData());
      const form = getFormData(this.new_file);

      this.$store
        .dispatch("putData", {
          inc_url: "fileuploadput",
          data: form,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        // Обновление списка
        .then(() => {
          this.$store.commit("setListReloadNeeded");
          const a = this.$store.getters.getResponseData;
          this.report = a.report || ''; // Получение отчета о загрузке
    });
    },
  },
};
</script>