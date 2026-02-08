<template>
  <common-list type_key="incident">
    <GridColumn field="code" title="Рег. номер"></GridColumn>
    <GridColumn field="incident_date" title="Дата"></GridColumn>
    <GridColumn field="parent" title="Проект"></GridColumn>
    <GridColumn field="plant_number" title="Заводской номер изделия"></GridColumn>
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
