<template>
  <common-list suburl="operation/">
    <GridColumn field="group" title="Группа операций" width="110"></GridColumn>
    <GridColumn field="operation_name" title="Наименование"></GridColumn>
    <GridColumn field="operation_code" title="Код" width="90"></GridColumn>
    <GridColumn field="full_name" title="Примечание"></GridColumn>
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
