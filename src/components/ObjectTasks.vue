<template>
  <div>
    <div>
      <Form :model="new_link" :labelWidth="0" v-if="checkEdit('objecttasks')">
        <FormField :key="1" name="parent">
          <ComboBox
            placeholder="Задание"
            style="width: 150px"
            v-model="new_link.parent"
            :data="codes"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getTasks($event)"
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
      >
        <GridColumn field="parent" title="Задание"></GridColumn>
      </DataGrid>
    </div>
    <div class="buttons_bar" v-if="checkEdit('objecttasks')">
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
import { getSuggest } from "@/api/utils";
import { mapState } from "vuex";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
      new_link: {
        child: null,
      }, // Информация о новой связи с извещением
      codes: [], // Список для выбора объекта
      link_id: null, // Идентификатор выбранной строки
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    async loadObjectTasks() {
      let params = {};
      params['child'] = this.selected_id;
      this.loading = true;
      const url = "objecttask/";
      this.list_data = await getData(this, url, params);
      this.loading = false;
    },
    async getTasks(event) {
      this.codes = await getSuggest(this, "task", event.filterValue);
    },
    onRowSelect(event) {
      this.link_id = event.pk;
    },
    onAddClick() {
      this.new_link['child'] = this.$store.getters.getSelectedId;
      this.$store
        .dispatch("postData", {
          inc_url: "objecttask",
          params: this.new_link,
        })
        // Обновление списка
        .then(() => this.loadObjectTasks());
    },
    onDeleteClick() {
      // Удаляем отмеченную строку
      this.$store
        .dispatch("deleteData", {
          inc_url: "objecttask",
          id: this.link_id,
        })
        // Обновление списка
        .then(() => this.loadObjectTasks());
    },
  },
  watch: {
    selected_id(newValue, oldValue) {
      this.loadObjectTasks();
    },
  },
  mounted() {
    if (this.selected_id) this.loadObjectTasks(); // На случай, если объект уже указан
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>