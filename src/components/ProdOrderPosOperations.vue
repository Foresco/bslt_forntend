<template>
  <div>
    <div style="margin: 5px">
      <a
        :href="`${this.$store.getters.getHostUrl}/arm/processtree/${this.sub_selected_id}`"
        target="_blank"
        >Редактировать техпроцесс</a
      >
      <LinkButton
        iconCls="icon-reload"
        style="margin-left: 10px"
        @click="loadListData()"
        title="Обновить перечень операций"
      ></LinkButton>
    </div>
    <DataGrid
      :data="list_data"
      :columnResizing="true"
      selectionMode="single"
      @rowSelect="onRowSelect($event)"
    >
      <GridColumn field="place_code" title="Подразделение"> </GridColumn>
      <GridColumn field="operation_name" title="Операция"></GridColumn>
      <GridColumn field="set_quantity" title="Выдано" width="60px"></GridColumn>
      <GridColumn
        field="done_quantity"
        title="Сделано"
        width="60px"
      ></GridColumn>
    </DataGrid>
    <div>
      <Form
        :model="new_report"
        :labelWidth="160"
        labelAlign="right"
        style="margin-top: 10px; max-width: 600px"
      >
        <FormField :key="1" name="worker" label="Исполнитель">
          <ComboBox
            v-model="new_report.worker"
            :data="workers"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getWorkers($event)"
          ></ComboBox>
        </FormField>
        <FormField :key="2" name="report_date" label="Дата отчета">
          <DateBox
            v-model="new_report.report_date_j"
            :firstDay="1"
            format="dd.MM.yyyy"
            @selectionChange="checkDate()"
          ></DateBox>
        </FormField>
        <FormField :key="3" name="workshift" label="Смена">
          <ComboBox
            v-model="new_report.work_shift"
            :data="workshifts_list"
            valueField="pk"
            textField="list_value"
          ></ComboBox>
        </FormField>
        <FormField :key="4" name="task_quantity" label="Количество задание">
          <NumberBox v-model="new_report.task_quantity"></NumberBox>
        </FormField>
        <FormField :key="5" name="quantity" label="Количество сделано">
          <NumberBox v-model="new_report.quantity"></NumberBox>
        </FormField>
        <FormField :key="6" name="work_time" label="Время штучное, мин.">
          <NumberBox v-model="new_report.work_time" :precision="1"></NumberBox>
        </FormField>
        <FormField :key="7" name="aux_time" label="Время настройки, час">
          <NumberBox v-model="new_report.aux_time" :precision="1"></NumberBox>
        </FormField>
        <FormField :key="8" name="comment" label="Примечание">
          <TextBox :multiline="true" v-model="new_report.comment"></TextBox>
        </FormField>
        <div class="buttons_bar" v-if="operation_id">
          <LinkButton
            iconCls="icon-add"
            style="margin-left: 160px"
            @click="submitFormAdd()"
            title="Создать задание"
            >Выдать</LinkButton
          >
          <LinkButton
            iconCls="icon-ok"
            style="margin-left: 100px"
            @click="submitFormComplete()"
            title="Создать выполненное задание"
            >Сделано</LinkButton
          >
        </div>
      </Form>
    </div>
    <prod-order-pos-tp-row></prod-order-pos-tp-row>
  </div>
</template>

<script>
import { getData, getResponseId } from "@/api/api";
import { mapState } from "vuex";
import { getSuggest, getListValues } from "@/api/utils";
import { dateToPythonStr } from "@/api/formatters";
import ProdOrderPosTpRow from "@/components/ProdOrderPosTpRow.vue";

export default {
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
      new_report: {
        worker: null,
        work_shift: 1,
        quantity: null,
        task_quantity: 0,
        bad_quantity: 0,
        work_time: 0,
        aux_time: 0,
        comment: null,
        task_link: null,
        report_date_j: new Date(), // report_date будет получено после преобразования
      }, // Информация о новом отчете
      workers: [], // Список исполнителей для подстановки
      workshifts_list: [], // Список смен
    };
  },
  components: {
    ProdOrderPosTpRow,
  },
  computed: mapState(["sub_selected_id", "operation_id", "link_id"]),
  methods: {
    async loadListData() {
      this.list_data = []; // Очистка списка
      if (this.sub_selected_id && this.link_id) {
        const url = `prodorderposoperation/${this.link_id}`;
        this.loading = true;
        this.list_data = await getData(this, url);
        this.loading = false;
      }
      this.$store.commit("setOperationId", null); // Очищаем идентифкатор выбранной операции
    },
    async getWorkers(event) {
      let params = {};
      // Получение списка подстановки для поля Исполнитель
      this.workers = await getSuggest(
        this,
        "userprofile",
        event.filterValue,
        params
      );
    },
    onRowSelect(event) {
      // Отработка клика по строке списка (таблицы)
      this.$store.commit("setOperationId", event.pk);
    },
    submitForm(create_report = false) {
      // Создание задания исполнителю
      const new_link = {
        prod_order_link: this.link_id,
        tp_row: this.$store.getters.getOperationId,
        worker: this.new_report.worker,
        comment: this.new_report.comment,
        quantity: this.new_report.task_quantity,
      };
      this.$store
        .dispatch("postData", {
          inc_url: "prodorderlinkworker",
          params: new_link,
        })
        .then(() => {
          if (create_report) {
            // Если указана необходимость создания отчета
            this.new_report.task_link = getResponseId(this); // Получение идентификатора созданного задания
            this.new_report.report_date = dateToPythonStr(
              this.new_report.report_date_j
            );
            if (this.new_report.task_link) {
              // Привязка отчета к заданию
              this.$store
                .dispatch("postData", {
                  inc_url: "workerreport",
                  params: this.new_report,
                })
                .then(() => this.loadListData()); // Обновление списка операций
              // Выставляем флаг необходимости перезагрузки списка заданий
              // this.$store.commit("setListReloadNeeded", true));
            }
          } else this.loadListData(); // Обновление списка операций
        });
    },
    submitFormAdd() {
      this.submitForm(false);
    },
    submitFormComplete() {
      this.submitForm(true);
    },
  },
  watch: {
    link_id() {
      this.loadListData();
    },
  },
  mounted() {
    // Загружаем список рабочих смен
    getListValues(this, "workshift").then(
      (response) => (this.workshifts_list = response)
    );
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>
