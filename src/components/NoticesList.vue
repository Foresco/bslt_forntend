<template>
  <common-list>
    <GridColumn field="notice_type" title="Тип" width="25"></GridColumn>
    <GridColumn field="code" title="Номер извещения"></GridColumn>
    <GridColumn field="notice_date" title="Дата извещения"></GridColumn>
    <GridColumn field="state" title="Состояние"></GridColumn>
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
