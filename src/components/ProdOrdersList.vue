<template>
  <common-list type_key="prodorder">
    <GridColumn field="code" title="Номер заказа"></GridColumn>
    <GridColumn field="order_maker" title="Заказчик"></GridColumn>
    <GridColumn field="order_date" title="Дата" width="70"></GridColumn>
    <GridColumn field="state" title="Состояние" width="125"></GridColumn>
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
