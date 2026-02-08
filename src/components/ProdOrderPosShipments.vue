<template>
  <div>
    <div v-if="checkEdit('prodorderposshipments')">
      <Form
        :model="new_shipment"
        :labelWidth="160"
        labelAlign="right"
        style="margin-top: 10px; max-width: 600px"
      >
        <FormField :key="1" name="report_date" label="Дата отгрузки">
          <DateBox
            v-model="new_shipment.shipment_date_j"
            format="dd.MM.yyyy"
            :firstDay="1"
          ></DateBox>
        </FormField>
        <FormField :key="2" name="quantity" label="Количество">
          <NumberBox v-model="new_shipment.quantity"></NumberBox>
        </FormField>
        <FormField :key="3" name="comment" label="Примечание">
          <TextBox :multiline="true" v-model="new_shipment.comment"></TextBox>
        </FormField>
        <div class="buttons_bar" v-if="link_id">
          <LinkButton
            style="margin-left: 160px"
            @click="submitFormAdd()"
            title="Создать отгрузку"
            >Отгружено</LinkButton
          >
        </div>
      </Form>
    </div>
    <DataGrid
      :data="list_data"
      :columnResizing="true"
      selectionMode="single"
      @rowSelect="onRowSelect($event)"
    >
      <GridColumn
        field="shipment_date"
        title="Дата отгрузки"
        width="90"
      ></GridColumn>
      <GridColumn field="quantity" title="Количество" width="77"></GridColumn>
      <GridColumn field="comment" title="Примечание"></GridColumn>
    </DataGrid>
    <div
      class="buttons_bar"
      v-show="row_id"
      v-if="checkEdit('prodorderposshipments')"
    >
      <LinkButton iconCls="icon-no" @click="onDeleteClick()"
        >Удалить</LinkButton
      >
      <a
        style="margin-left: 10px"
        :href="`${this.$store.getters.getHostUrl}/report/passport/get_report/?id=${this.row_id}`"
        target="_blank"
        title="Скачать сопроводительный паспорт"
        >Паспорт</a
      >
      <a
        style="margin-left: 10px"
        :href="`${this.$store.getters.getHostUrl}/report/sticker/get_report/?id=${this.row_id}`"
        target="_blank"
        title="Скачать этикетку"
        >Этикетка</a
      >
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { mapState } from "vuex";
import { dateToPythonStr } from "@/api/formatters";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
      new_shipment: {
        shipment_date_j: new Date(),
        quantity: null,
        comment: null,
      }, // Информация о новой отгрузке
      row_id: null, // Идентификатор выделенной строки
    };
  },
  computed: mapState(["link_id"]),
  methods: {
    async loadListData() {
      this.list_data = []; // Очистка списка
      if (this.link_id) {
        this.loading = true;
        this.list_data = await getData(this, "shipment", {
          prod_order_link: this.link_id,
        });
        this.loading = false;
      }
      this.row_id = null; // Очищаем идентифкатор выбранной строки
    },
    onRowSelect(event) {
      // Отработка клика по строке списка (таблицы)
      this.row_id = event.pk;
    },
    submitFormAdd() {
      // Создание задания исполнителю
      const new_link = {
        prod_order_link: this.link_id,
        shipment_date: dateToPythonStr(this.new_shipment.shipment_date_j),
        comment: this.new_shipment.comment,
        quantity: this.new_shipment.quantity,
      };
      this.$store
        .dispatch("postData", {
          inc_url: "shipment",
          params: new_link,
        })
        .then((response) => {
          // this.loadListData(); // Обновление списка
          this.list_data = []; // Очистка списка
          // Выставляем флаг необходимости перезагрузки списка заданий
          this.$store.commit("setListReloadNeeded", true);
        });
    },
    onDeleteClick() {
      this.$messager.confirm({
        title: "Подтверждение удаления",
        msg: "Вы уверены, что удаление необходимо?",
        result: (answer) => {
          if (answer) {
            // Удаляем отмеченную строку
            this.$store
              .dispatch("deleteData", {
                inc_url: "shipment",
                id: this.row_id,
              })
              // Обновление списка
              .then((response) => {
                // this.loadListData(); 
                this.list_data = []; // Очистка списка
                // Выставляем флаг необходимости перезагрузки списка заданий
                this.$store.commit("setListReloadNeeded", true);
              });
          }
        },
      });
    },
  },
  watch: {
    link_id() {
      this.loadListData();
    },
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>
