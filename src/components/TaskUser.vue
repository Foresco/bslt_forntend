<template>
  <div>
    <div>
      <Form :model="new_link" :labelWidth="0" v-if="checkEdit('taskuser')">
        <FormField :key="1" name="user">
          <ComboBox
            placeholder="Исполнитель"
            v-model="new_link.user"
            :data="users"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getUsers($event)"
          ></ComboBox>
          <DateBox
            title="Срок"
            v-model="deadline"
            format="dd.MM.yyyy"
            style="width: 80px"
            :firstDay="1"
          ></DateBox>
        </FormField>
        <!-- пока скрыто 
        <FormField :key="3" name="time_norm">
          <NumberBox
            v-model="new_link.time_norm"
            label="норма времени"
          ></NumberBox>
          <ComboBox
            v-model="new_link.unit"
            style="width: 60px"
            :data="units"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getUnits($event)"
          ></ComboBox>
        </FormField>
        -->
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
        selectionMode="single"
        @rowSelect="onRowSelect($event)"
      >
        <GridColumn width="18px" :cellCss="getIconT" title="Взято"></GridColumn>
        <GridColumn width="18px" :cellCss="getIconE" title="Выполнено"></GridColumn>
        <GridColumn field="user" title="Пользователь"></GridColumn>
        <GridColumn
          field="deadline"
          title="Крайний срок"
          width="80px"
        ></GridColumn>
        <!-- пока скрыто
        <GridColumn
          field="time_norm"
          title="Норма времени"
          width="80px"
        ></GridColumn>
        <GridColumn field="unit" title="ЕИ" width="50px"></GridColumn>
        -->
      </DataGrid>
    </div>
    <div class="buttons_bar" v-if="checkEdit('taskuser')">
      <LinkButton
        iconCls="icon-no"
        @click="onExcludeClick()"
        v-if="buttons.exclude"
        >Исключить</LinkButton
      >
      <LinkButton
        iconCls="icon-take"
        style="margin: 3px"
        @click="onRowAct('take')"
        v-if="buttons.take"
        >Взять</LinkButton
      >
      <LinkButton
        iconCls="icon-ok"
        style="margin: 3px"
        @click="onRowAct('execute')"
        v-if="buttons.execute"
        >Выполнено</LinkButton
      >
      <LinkButton
        iconCls="icon-undo"
        style="margin: 3px"
        @click="onRowAct('unexecute')"
        v-if="buttons.unexecute"
        >Не выполнено</LinkButton
      >
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { getSuggest } from "@/api/utils";
import { mapState } from "vuex";
import { dateToPythonStr } from "@/api/formatters";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      link_id: null, // Идентификатор выбранной строки
      list_data: [], // Собранные и сформированные данные для грида
      new_link: {
        user: null,
        time_norm: null,
        unit: null,
      }, // Информация о новой связи с извещением
      deadline: new Date(),
      users: [], // Список для выбора пользователя
      units: [], // Список для выбора единицы измерения
      buttons: {
        exclude: false, // Исключить
        take: false, // Взять
        execute: false, // Выполнить
        unexecute: false, // Не выполнено
      }, // Список отображаемых кнопок
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    getIconT(row) {
      if (row.taker_sess) return "icon-take";
      return null;
    },
    getIconE(row) {
      if (row.executor_sess) return "icon-ok";
      return null;
    },
    hideButtons() {
      // Сокрытие кнопок
      for (let key in this.buttons) {
        this.buttons[key] = false;
      }
    },
    async loadTaskUser() {
      this.loading = true;
      let params = { task: this.selected_id };
      const url = "taskuser/";
      this.list_data = await getData(this, url, params);
      this.loading = false;
      this.link_id = null; // Снимаем выбор строки
      this.hideButtons(); // Убираем кнопки
    },
    onRowSelect(event) {
      this.link_id = event.pk;
      this.buttons.exclude = true;
      this.buttons.take = !event.taker_sess;
      this.buttons.execute = event.taker_sess && !event.executor_sess;
      this.buttons.unexecute = event.executor_sess;
    },
    async getUsers(event) {
      // Получение списка подстановки для поля Исполнитель
      this.users = await getSuggest(this, "userprofile", event.filterValue);
    },
    async getUnits(event) {
      this.units = await getSuggest(this, "measureunit", event.filterValue);
    },
    onAddClick() {
      this.new_link["task"] = this.selected_id;
      this.new_link["deadline"] = dateToPythonStr(this.deadline);
      this.$store
        .dispatch("postData", {
          inc_url: "taskuser",
          params: this.new_link,
        })
        // Обновление списка извещений
        .then(() => this.loadTaskUser());
    },
    onExcludeClick() {
      // Удаляем отмеченную строку
      this.$store
        .dispatch("deleteData", {
          inc_url: "taskuser",
          id: this.link_id,
        })
        // Обновление списка
        .then(() => this.loadTaskUser());
    },
    onRowAct(action_id) {
      // Выполнение действий над строкой
      this.$store
        .dispatch("patchData", {
          inc_url: "taskuser",
          id: this.link_id,
          params: { action_id: action_id },
        })
        // Обновление списка
        .then(() => this.loadTaskUser());
    },
  },
  watch: {
    selected_id(newValue, oldValue) {
      this.loadTaskUser();
    },
  },
  mounted() {
    if (this.selected_id) this.loadTaskUser(); // На случай, если задача уже указана
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>