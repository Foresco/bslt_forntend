<template>
  <div>
    <div>
      <DataGrid :data="list_data" :columnResizing="true">
        <GridColumn field="property" title="Свойство"></GridColumn>
        <GridColumn field="value" title="Значение"></GridColumn>
      </DataGrid>
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { mapState } from "vuex";

export default {
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
    };
  },
  computed: mapState(["row_id"]),
  methods: {
    
    async loadPropertyValues() {
        const parseRow = function (row, row_list) {
        // Разбор массива-ответа сервера в список строк
        for (const [key, value] of Object.entries(row)) {
          let ln = {
            property: key,
            value: value
          };
          row_list.push(ln);
        }
      };
      this.list_data = []; // Очистка списка
      this.loading = true;
      const url = `rawrowpropvalues/${this.row_id}/`;
      const res = await getData(this, url);
      parseRow(res, this.list_data);
      this.loading = false;
    },
  },
  watch: {
    row_id() {
      this.loadPropertyValues();
    },
  },
  mounted() {
    if (this.row_id) this.loadPropertyValues(); // На случай, если строка уже указана
  },
};
</script>
