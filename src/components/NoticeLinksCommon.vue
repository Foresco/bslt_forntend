<template>
  <div>
    <div>
      <Form
        :model="new_link"
        :labelWidth="0"
        v-if="checkEdit('noticelinks') || checkEdit('objectnotices')"
      >
        <FormField :key="1" name="parent" v-if="side == 'child'">
          <ComboBox
            placeholder="Извещение"
            style="width: 150px"
            v-model="new_link.parent"
            :data="notices"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getNotices($event)"
          ></ComboBox>
        </FormField>
        <FormField :key="2" name="child" v-if="side == 'parent'">
          <ComboBox
            placeholder="Объект"
            style="width: 150px"
            v-model="new_link.child"
            :data="codes"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getCodes($event)"
          ></ComboBox>
        </FormField>
        <FormField :key="3" name="order" v-if="side == 'parent'">
          <ComboBox
            placeholder="Заказ"
            style="width: 150px"
            v-model="notice_order_id"
            :data="codes"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getOrderCodes($event)"
          ></ComboBox>
        </FormField>
        <FormField :key="4" name="change_type">
          <NumberBox
            placeholder="Номер изменения"
            v-model="new_link.change_num"
            :precision="0"
            :min="1"
            style="width: 60px"
          ></NumberBox>
          <ComboBox
            placeholder="Тип изменения"
            v-model="new_link.change_type"
            :data="change_types"
            valueField="pk"
            textField="list_value"
            style="width: 80px"
            :limitToList="true"
          ></ComboBox>
        </FormField>
        <FormField :key="5" name="comment">
          <TextBox
            placeholder="Примечание"
            v-model="new_link.comment"
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
        @rowSelect="onRowSelect($event)"
      >
        <slot />
      </DataGrid>
    </div>
    <div
      class="buttons_bar"
      v-if="checkEdit('noticelinks') || checkEdit('objectnotices')"
      v-show="show_buttons"
    >
      <LinkButton iconCls="icon-redo" @click="onTraceClick()"
        >Провести</LinkButton
      >
      <LinkButton
        iconCls="icon-no"
        style="margin: 10px"
        @click="onDeleteClick()"
        >Удалить</LinkButton
      >
    </div>
    <div>
      <Form
        :model="edit_link"
        :labelWidth="0"
        v-if="checkEdit('noticelinks') || checkEdit('objectnotices')"
        v-show="show_buttons"
      >
        <FormField :key="3" name="change_type">
          <NumberBox
            placeholder="Номер изменения"
            v-model="edit_link.change_num"
            :precision="0"
            :min="1"
            style="width: 60px"
          ></NumberBox>
          <ComboBox
            placeholder="Тип изменения"
            v-model="edit_link.change_type"
            :data="change_types"
            valueField="pk"
            textField="list_value"
            style="width: 80px"
            :limitToList="true"
          ></ComboBox>
        </FormField>
        <FormField :key="4" name="comment">
          <TextBox
            placeholder="Примечание"
            v-model="edit_link.comment"
          ></TextBox>
        </FormField>
        <div class="buttons_bar">
          <LinkButton iconCls="icon-add" @click="onSaveClick"
            >Сохранить</LinkButton
          >
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { getListValues, getCodes } from "@/api/utils";
import { mapState } from "vuex";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      // TODO: Объединить функционал с NoticeLinks
      list_data: [], // Собранные и сформированные данные для грида
      new_link: {
        child: null,
        parent: null,
        change_type: null,
        change_num: null,
        comment: null,
      }, // Информация о новой связи с извещением
      edit_link: {
        change_type: null,
        change_num: null,
        comment: null,
      }, // Информация о редактируемой связи с извещением
      notices: [], // Список для выбора извещения
      codes: [], // Список для выбора объекта
      change_types: [], // Список для выбора типа изменения
      show_buttons: false, // Признак того, что для выделенной строки надо показывать кнопки
      notice_order_id: null, // Идентификатор заказа
    };
  },
  props: {
    side: {
      // Сторона, с которой отображаются связи (parent - извещение, child - объект)
      default: "parent",
    },
  },
  computed: mapState(["selected_id", "order_id", "sub_type_key"]),
  methods: {
    parseRow(row_node) {
      row_node.notice_url = `/${row_node.parent_id}/`;
      row_node.object_url = `/${row_node.child_id}/`;
      row_node.is_done_str = row_node.is_done ? "Да" : "Нет";
      return row_node;
    },
    async loadNoticeLinks() {
      this.loading = true;
      const url = "noticelink/";
      let params = {};
      params[this.side] = this.selected_id; // Строки, связанные непосредственно с объектом или извещением
      let res = await getData(this, url, params);
      // К объекту заказа добавляем еще и извещения от заказа
      if (this.order_id && sub_type_key != 'order') {
        params[this.side] = this.order_id; // Строки, связанные заказом
        // Добавялем в предыдущий
        res = res.concat(await getData(this, url, params));
      }
      this.list_data = res.map(this.parseRow);
      this.show_buttons = false; // Изначально кнопки не отображаем
      this.loading = false;
    },
    getCodes(event) {
      // Чтобы зарегистрировать внешнюю фукнцию и искать только объекты констуркции
      getCodes(this, event.filterValue, "partobject").then(
        (response) => (this.codes = response)
      );
    },
    getOrderCodes(event) {
      // Чтобы зарегистрировать внешнюю фукнцию и искать только заказы
      getCodes(
        this,
        event.filterValue,
        "partobject",
        { part_type: "order" }
      ).then((response) => (this.codes = response));
    },
    getNotices(event) {
      // Чтобы зарегистрировать внешнюю фукнцию
      getCodes(this, event.filterValue, "notice").then(
        (response) => (this.notices = response)
      );
    },
    onRowSelect(event) {
      this.$store.commit("setLinkId", event.pk);
      this.show_buttons = !event.is_done; // Проведенные строки только для чтения
      // Значения для редактирования
      this.edit_link.change_num = event.change_num;
      this.edit_link.change_type = event.change_type_id; // Для отображения и сохранения передаем идентификатор
      this.edit_link.comment = event.comment;
    },
    onAddClick() {
      this.new_link[this.side] = this.$store.getters.getSelectedId;
      // Если указан заказ, а не объект
      if (!this.new_link.child && this.notice_order_id) this.new_link.child = this.notice_order_id;
      // Отправляем запрос
      this.$store
        .dispatch("postData", {
          inc_url: "noticelink",
          params: this.new_link,
        })
        // Обновление списка извещений
        .then(() => this.loadNoticeLinks());
    },
    onTraceClick() {
      // Проводим отмеченную строку
      this.$store
        .dispatch("patchData", {
          inc_url: "noticelink",
          id: this.$store.getters.getLinkId,
          params: { is_done: true },
        })
        // Обновление списка
        .then(() => this.loadNoticeLinks());
    },
    onSaveClick() {
      this.$store
        .dispatch("patchData", {
          inc_url: "noticelink",
          id: this.$store.getters.getLinkId,
          params: this.edit_link,
        })
        // Обновление списка извещений
        .then(() => this.loadNoticeLinks());
    },
    onDeleteClick() {
      // Удаляем отмеченную строку
      this.$store
        .dispatch("deleteData", {
          inc_url: "noticelink",
          id: this.$store.getters.getLinkId,
        })
        // Обновление списка
        .then(() => this.loadNoticeLinks());
    },
  },
  watch: {
    selected_id(newValue, oldValue) {
      this.loadNoticeLinks();
    },
  },
  mounted() {
    // Получение списка подстановки для поля Тип изменения
    getListValues(this, "changetype").then(
      (response) => (this.change_types = response)
    );
    if (this.selected_id) this.loadNoticeLinks(); // На случай, если извещение или объект уже указаны
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>