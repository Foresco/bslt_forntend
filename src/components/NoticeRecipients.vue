<template>
  <div>
    <div>
      <Form :model="new_recipient" :labelWidth="0" v-if="checkEdit('noticerecipients')">
        <FormField :key="1" name="place">
          <ComboBox
            placeholder="Получатель"
            style="width: 150px"
            v-model="new_recipient.child"
            :data="places"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getPlaces($event)"
          ></ComboBox>
        </FormField>
        <FormField :key="2" name="comment">
          <TextBox
            placeholder="Примечание"
            v-model="new_recipient.comment"
          ></TextBox>
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
        @rowClick="onRowSelect($event)"
      >
        <GridColumn
          field="child"
          title="Производственное подразделение"
        ></GridColumn>
        <GridColumn field="comment" title="Примечание"></GridColumn>
        <GridColumn
          field="is_sent"
          title="Отправлено"
          width="80px"
        ></GridColumn>
      </DataGrid>
    </div>
    <div class="buttons_bar" v-if="checkEdit('noticerecipients')">
      <LinkButton iconCls="icon-ok" @click="onSentClick()"
        >Отправлено</LinkButton
      >
      <LinkButton
        iconCls="icon-no"
        style="margin: 10px"
        @click="onDeleteClick()"
        >Удалить</LinkButton
      >
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
      new_recipient: {
        child: null,
        comment: null,
      }, // Информация о новом получателе извещения
      places: [], // Список подразделений
      selected: null, // Идентификатор выбранной записи
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    async loadRecipients() {
      const parseRow = (row_node) => {
        row_node.is_sent = row_node.is_sent ? "Да" : "Нет";
        return row_node;
      };
      this.list_data = []; // Очистка списка
      let params = { parent: this.selected_id };
      this.loading = true;
      const url = "noticerecipient/";
      const res = await getData(this, url, params);

      this.list_data = res.results.map(parseRow);
      this.loading = false;
    },
    async getPlaces(event) {
      // Получение списка подстановки для поля Получатель
      this.places = await getSuggest(this, "place", event.filterValue);
    },
    onAddClick() {
      this.new_recipient["parent"] = this.$store.getters.getSelectedId;
      this.$store
        .dispatch("postData", {
          inc_url: "noticerecipient",
          params: this.new_recipient,
        })
        .then(() => this.loadRecipients());
    },
    onDeleteClick() {
      // Удаляем отмеченную строку
      this.$store
        .dispatch("deleteData", {
          inc_url: "noticerecipient",
          id: this.selected,
        })
        .then(() => this.loadRecipients());
    },
    onRowSelect(event) {
      // Отработка клика по строке списка (таблицы)
      this.selected = event.pk;
    },
    onSentClick() {
      this.$store
        .dispatch("patchData", {
          inc_url: "noticerecipient",
          id: this.selected,
          params: {
            is_sent: true,
          },
        })
        .then(() => this.loadRecipients());
    },
  },
  watch: {
    selected_id(newValue, oldValue) {
      this.loadRecipients();
    },
  },
  mounted() {
    if (this.selected_id) this.loadRecipients(); // На случай, если объект уже указан
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>