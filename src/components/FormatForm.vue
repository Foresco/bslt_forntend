<template>
  <Dialog
    ref="frmtfrm"
    :title="'Форматы'"
    :dialogStyle="{ width: '200px' }"
    :modal="true"
    :closed="true"
    :draggable="true"
    @close="onClose"
  >
    <div>
      <Form :model="new_format" :labelWidth="0" >
        <FormField :key="3" name="change_type">
          <NumberBox
            placeholder="Количество листов"
            title="Количество листов"
            v-model="new_format.list_quantity"
            :precision="0"
            style="width: 60px"
          ></NumberBox>
          <ComboBox
            placeholder="Формат"
            title="Формат"
            v-model="new_format.format"
            :data="formats"
            valueField="pk"
            textField="list_value"
            :limitToList="true"
          ></ComboBox>
        </FormField>
        <div class="buttons_bar" v-if="editable">
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
        <GridColumn field="list_quantity" title="Кол-во" style="width: 60px"></GridColumn>
        <GridColumn field="format" title="Формат"></GridColumn>
      </DataGrid>
    </div>
    <div class="buttons_bar" v-if="editable">
      <LinkButton
        iconCls="icon-no"
        @click="onDeleteClick()"
        >Удалить</LinkButton
      >
      <LinkButton iconCls="icon-ok" style="margin-left: 10px" @click="btnClose()">Ok</LinkButton>
    </div>
  </Dialog>
</template>
    
<script>
import { getData } from "@/api/api";
import { getListValues } from "@/api/utils";

export default {
  data() {
    return {
      list_data: [], // Список с форматами
      link_id: null, // Идентификатор выбранной строки
      new_format: {
        part_object: this.$store.getters.getSelectedId,
        format: null,
        list_quantity: 1,
      }, // Информация о новом формате объекта
      formats: [], // Список для выбора формата
    };
  },
  props: {
    editable: Boolean, // Возможно ли редактирование
  },
  methods: {
    openForm: function () {
      // Открытие формы редактирования форматов объекта
      if (this.$store.getters.getSelectedId) this.loadObjectFormats();
      getListValues(this, "partformat").then(
        (response) => (this.formats = response)
      );
      this.$refs.frmtfrm.open();
    },
    async loadObjectFormats() {
      const params = { part_object: this.$store.getters.getSelectedId };
      this.loading = true;
      const url = "partobjectformat/";
      this.list_data = await getData(this, url, params);
      this.loading = false;
    },
    onRowSelect(event) {
      this.link_id = event.pk;
    },
    onAddClick() {
      this.$store
        .dispatch("postData", {
          inc_url: "partobjectformat",
          params: this.new_format,
        })
        // Обновление списка форматов
        .then(() => this.loadObjectFormats());
    },
    onDeleteClick() {
      // Удаляем отмеченную строку
      this.$store
        .dispatch("deleteData", {
          inc_url: "partobjectformat",
          id: this.link_id,
        })
        // Обновление списка
        .then(() => this.loadObjectFormats());
    },
    btnClose() {
      this.$refs.frmtfrm.close();
    },
    onClose() {
      this.$emit('formatsclosed'); // Сообщаем родительской форме о закрытии. Там это событие обрабатывается
    },
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>