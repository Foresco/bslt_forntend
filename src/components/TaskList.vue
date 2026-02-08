<template>
  <common-list suburl="task/">
    <GridColumn field="task_type" title="Тип" width="200"></GridColumn>
    <GridColumn field="code" title="Номер задания" width="100"></GridColumn>
    <GridColumn
      field="income_number"
      title="Входящий номер"
      width="100"
    ></GridColumn>
    <GridColumn field="task_date" title="Дата задания" width="85"></GridColumn>
    <GridColumn field="task_theme" title="Тема задания"></GridColumn>
  </common-list>
</template>

<script>
import CommonList from "@/components/CommonList.vue"; // Общий компонент всех списков

export default {
  components: {
    CommonList,
  },
};
</script>
