<template>
  <common-list suburl="delivery/">
    <GridColumn field="delivery_num" title="Номер" width="100"></GridColumn>
    <GridColumn field="receiver" title="Получатель"></GridColumn>
    <GridColumn field="delivery_date" title="Дата выдачи" width="150"></GridColumn>
    <GridColumn field="comment" title="Примечание"></GridColumn>
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
