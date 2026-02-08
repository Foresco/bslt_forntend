<template>
  <div>
    <div>
      <Form
        :model="new_link"
        :labelWidth="0"
        v-if="checkEdit('docversionobjects')"
        v-show="selected_id"
      >
        <FormField :key="1" name="entity">
          <ComboBox
            placeholder="Объект"
            style="width: 150px"
            v-model="new_link.entity"
            :data="codes"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getCodesAll($event)"
          ></ComboBox>
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
        selectionMode="single"
        @rowSelect="onRowSelect($event)"
        @rowDblClick="onRowDblClick($event)"
      >
        <GridColumn
          field="entity"
          title="Объект, связанный с файлом"
        ></GridColumn>
      </DataGrid>
    </div>
    <div class="buttons_bar" v-if="checkEdit('docversionobjects')">
      <LinkButton
        iconCls="icon-remove"
        @click="onDisconnectClick()"
        >Отвязать</LinkButton
      >
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { getCodes } from "@/api/utils";
import { mapState } from "vuex";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
      new_link: {
        entity: null,
        document_version: null,
      }, // Информация о новой связи с извещением
      codes: [], // Список для выбора объекта
      link_id: null, // Идентификатор выбранной строки
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    parseRow(row) {
      return {
        pk: row.pk,
        entity_id: row["entity"]["pk"],
        entity: row["entity"]["value"],
      };
    },
    loadListData() {
      this.loading = true;
      const url = "entitydocumentversion/";
      this.list_data = [];
      if (this.selected_id) {
        getData(this, url, { document_version: this.selected_id }).then(
          (response) => (this.list_data = response.map(this.parseRow))
        );
      }
      this.loading = false;
    },
    getCodesAll(event) {
      // Чтобы зарегистрировать внешнюю фукнцию
      getCodes(this, event.filterValue, "partobjectall").then(
        (response) => (this.codes = response)
      );
    },
    onRowSelect(event) {
      this.link_id = event.pk;
    },
    onAddClick() {
      this.new_link.document_version = this.$store.getters.getSelectedId;
      this.$store
        .dispatch("postData", {
          inc_url: "entitydocumentversion",
          params: this.new_link,
        })
        // Обновление списка
        .then(() => this.loadListData());
    },
    onDisconnectClick() {
      // Удаляем отмеченную строку
      this.$store
        .dispatch("deleteData", {
          inc_url: "entitydocumentversion",
          id: this.link_id,
        })
        // Обновление списка
        .then(() => this.loadListData());
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event["entity_id"]}/`);
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

<style>
.buttons_bar {
  margin: 5px;
}
</style>