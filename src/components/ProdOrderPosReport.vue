<template>
  <div>
    <div>
      <Form
        :model="new_report"
        :labelWidth="160"
        labelAlign="right"
        style="max-width: 600px"
      >
        <FormField :key="1" name="report_date" label="Дата отчета">
          <DateBox
            v-model="new_report.report_date_j"
            :firstDay="1"
            format="dd.MM.yyyy"
            :invalid="date_invalid"
            @selectionChange="checkDate()"
          ></DateBox>
        </FormField>
        <FormField :key="2" name="workshift" label="Смена">
          <ComboBox
            v-model="new_report.work_shift"
            :data="workshifts_list"
            valueField="pk"
            textField="list_value"
          ></ComboBox>
        </FormField>
        <FormField :key="3" name="quantity" label="Количество">
          <NumberBox v-model="new_report.quantity"></NumberBox>
        </FormField>
        <FormField :key="4" name="bad_quantity" label="Брак">
          <NumberBox v-model="new_report.bad_quantity"></NumberBox>
        </FormField>
        <FormField :key="5" name="work_time" label="Время штучное, мин.">
          <NumberBox v-model="new_report.work_time" :precision="1"></NumberBox>
        </FormField>
        <FormField :key="6" name="aux_time" label="Время настройки, час">
          <NumberBox v-model="new_report.aux_time" :precision="1"></NumberBox>
        </FormField>
        <FormField :key="7" name="comment" label="Примечание">
          <TextBox :multiline="true" v-model="new_report.comment"></TextBox>
        </FormField>
        <div class="buttons_bar">
          <LinkButton
            v-show="row_id"
            iconCls="icon-add"
            style="margin-left: 120px"
            title="Добавить отчет к заданию"
            @click="submitFormAdd()"
            >Добавить</LinkButton
          >
          <LinkButton
            v-show="row_id"
            iconCls="icon-ok"
            style="margin-left: 80px"
            title="Завершить выполнение задания, убрать из списка"
            @click="submitComplete()"
            >Завершить</LinkButton
          >
          <LinkButton
            v-show="operation_id"
            iconCls="icon-ok"
            style="margin-left: 120px"
            @click="submitNewComplete()"
            title="Создать новое выполненное задание"
            >Сделано</LinkButton
          >
        </div>
      </Form>
    </div>
    <div>
      <DataGrid :data="list_data" :columnResizing="true">
        <GridColumn field="сk" width="28" align="center">
          <template slot="body" slot-scope="scope">
            <CheckBox v-model="scope.row.selected"></CheckBox>
          </template>
        </GridColumn>
        <GridColumn
          field="report_date"
          title="Дата отчета"
          width="75"
        ></GridColumn>
        <GridColumn field="quantity" title="Количество" width="72"></GridColumn>
        <GridColumn field="bad_quantity" title="Брак" width="40"></GridColumn>
        <GridColumn
          field="work_time"
          title="Время работы"
          width="82"
        ></GridColumn>
        <GridColumn
          field="aux_time"
          title="Время настройки"
          width="85"
        ></GridColumn>
        <GridColumn field="comment" title="Примечание"></GridColumn>
      </DataGrid>
    </div>
    <div class="buttons_bar">
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
import { mapState } from "vuex";
import { getData, getResponseId } from "@/api/api";
import { getListValues } from "@/api/utils";
import { dateToPythonStr } from "@/api/formatters";

export default {
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида отчетов исполнителя
      workshifts_list: [], // Список смен
      new_report: {
        task_link: null,
        report_date_j: new Date(), // report_date будет получено после преобразования
        work_shift: 1,
        quantity: null,
        bad_quantity: null,
        work_time: 0,
        aux_time: 0,
        comment: null,
      }, // Информация о новом отчете
      date_invalid: false, // Признак, что дата указана неверно
      date_invalid_message:
        "Допустимо указание только текущей или вчерашней даты",
    };
  },
  computed: mapState(["link_id", "row_id", "operation_id", "page_key"]),
  mounted() {
    // Загружаем список рабочих смен
    getListValues(this, "workshift").then(
      (response) => (this.workshifts_list = response)
    );
  },
  methods: {
    async loadListData() {
      // Загрузка отчетов для выбранного задания исполнителю
      const parseRow = (row_node) => {
        row_node["selected"] = false;
        // row_node["report_date"] = pythonDateToStr(row_node["report_date"]);
        return row_node;
      };
      let res = [];
      if (this.row_id) {
        // Если выбрана строка задания
        const url = "workerreport/";
        res = await getData(this, url, {
          task_link: this.row_id,
        });
      } else if (this.link_id && this.operation_id) {
        // Это операция позиции заказа
        const url = `positionsoperationreport/${this.link_id}/${this.operation_id}`;
        res = await getData(this, url);
      }
      this.list_data = res.map(parseRow);
    },
    checkDate() {
      // Проверка корректности ввода даты
      const today = new Date().setHours(0, 0, 0, 0); // Сегодня (с нулевым временем)
      const yesterday = new Date(Date.now() - 86400000).setHours(0, 0, 0, 0); // Вчера с (с нулевым временем)
      if (
        yesterday > this.new_report.report_date_j ||
        today < this.new_report.report_date_j
      ) {
        this.date_invalid = true; // Подсвечиваем дату
        this.$store.commit("setMessage", {
          msg_icon: "error-message",
          msg_text: this.date_invalid_message,
        });
      } else this.date_invalid = false;
    },
    submitFormAdd() {
      if (!this.row_id) {
        this.$store.commit("setMessage", {
          msg_icon: "error-message",
          msg_text: `Выберите задание для добавления отчета`,
        });
        return;
      }
      if (this.date_invalid) {
        this.$store.commit("setMessage", {
          msg_icon: "error-message",
          msg_text: this.date_invalid_message,
        });
        return;
      }
      this.new_report["task_link"] = this.row_id;
      this.new_report["report_date"] = dateToPythonStr(
        this.new_report["report_date_j"]
      );
      // Добавление отчета исполнителя
      this.$store
        .dispatch("postData", {
          inc_url: "workerreport",
          params: this.new_report,
        })
        // Обновление списка отчетов
        .then(() => this.loadListData())
        // Выставляем флаг необходимости перезагрузки списка заданий
        .then(() => this.$store.commit("setListReloadNeeded"));
    },
    submitComplete() {
      // Отмечаем выполнение выделенного задания
      this.$store
        .dispatch("patchData", {
          inc_url: "prodorderlinkworker",
          id: this.row_id,
          params: {
            link_state: 3, // Состояние Завершено
          },
        })
        // Выставляем флаг необходимости перезагрузки списка
        .then(() => this.$store.commit("setListReloadNeeded"));
    },
    onDeleteClick() {
      // Удаляем отмеченные строки
      let deleted_rows = [];
      for (const q of this.list_data.filter((row) => row.selected)) {
        deleted_rows.push(q.pk);
      }
      this.$store
        .dispatch("deleteDataMany", {
          inc_url: "workerreport",
          ids: deleted_rows,
        })
        // Обновление дерева состава заказа
        .then(() => this.loadListData())
        // Выставляем флаг необходимости перезагрузки списка заданий
        .then(() => this.$store.commit("setListReloadNeeded"));
    },
    submitNewComplete() {
      // Создание задания исполнителю
      const new_link = {
        prod_order_link: this.link_id,
        tp_row: this.operation_id,
        comment: this.new_report.comment,
        quantity: this.new_report.quantity,
      };
      this.$store
        .dispatch("postData", {
          inc_url: "prodorderlinkworker",
          params: new_link,
        })
        .then(() => {
          this.new_report.task_link = getResponseId(this); // Получение идентификатора созданного задания
          if (this.new_report.task_link) {
            // Привязка отчета к заданию
            this.new_report["report_date"] = dateToPythonStr(
              this.new_report["report_date_j"]
            );
            this.$store
              .dispatch("postData", {
                inc_url: "workerreport",
                params: this.new_report,
              })
              .then(() => this.loadListData()); // Обновление списка операций
          }
        });
    },
  },
  watch: {
    link_id() {
      this.loadListData();
    },
    row_id() {
      this.loadListData();
    },
    operation_id() {
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