<template>
  <div>
    <DataGrid :data="list_data" :columnResizing="true">
      <GridColumn
        field="session_datetime"
        title="Дата и время"
        width="120"
        :sortable="true"
      ></GridColumn>
      <GridColumn field="username" title="Автор" width="120"></GridColumn>
      <GridColumn field="param" title="Свойство" width="120"></GridColumn>
      <GridColumn field="value" title="Значение"></GridColumn>
    </DataGrid>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getData } from "@/api/api";
import { getPropsList } from "@/api/utils";

export default {
  data() {
    return {
      label_map: new Map(), // Массив для маппинга имен параметров
      list_data: [], // Собранные и сформированные данные для грида истории
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    async loadHistory() {
      // Получение названий для параметров из настроек полей формы
      const parseRow = function (row, row_list, label_map) {
        // Разбор массива-ответа сервера в список строк
        for (const [key, value] of Object.entries(row.changes)) {
          let ln = {};
          ln.param = label_map.get(key) || null; // Замена на названия полей в форме
          if (!ln.param) continue; // Нераспознанные параметры не отображаем
          ln.pk = row.pk;
          ln.username = row.username;
          ln.session_datetime = row.session_datetime;


          // Установленное значение параметра
          if (typeof value == "boolean") {
            // Булеан отображаем отдельным
            ln.value = value ? "Да" : "Нет";
          } else ln.value = value;
          row_list.push(ln);
        }
      };
      if (!this.selected_id) {
        // Если не указан идентификатор
        this.list_data = []; // Просто чистим список
        return;
      }
      this.loading = true;
      let rows = await getPropsList(
        this,
        this.$store.getters.getTypeKey,
        this.$store.getters.getSubTypeKey
      );
      rows.push({ name: "create", label: "Создание" }); // Добавляем заголовок для записи о создании
      rows.map(this.parseLabelRow); // Преобразование в пару Параметр -> надпись

      this.list_data = []; // Очистка списка

      const url = `history/${this.$store.getters.getTypeKey}/${this.selected_id}`;
      const lines = await getData(this, url);
      lines.forEach((x) => parseRow(x, this.list_data, this.label_map));
      this.loading = false;
    },
    parseLabelRow(row) {
      // Формирование строки соответствия Параметр - надпись
      this.label_map.set(row["name"], row["label"]);
    },
  },
  watch: {
    selected_id() {
      this.loadHistory();
    },
  },
  mounted() {
    if (this.selected_id) this.loadHistory(); // На случай, если объект уже указан
  },
};
</script>
