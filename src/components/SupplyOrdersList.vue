<template>
  <common-list type_key="supplyorder">
    <GridColumn field="code" title="Номер заказа" width="120"></GridColumn>
    <GridColumn field="supplier" title="Поставщик"></GridColumn>
    <GridColumn field="order_date" title="Дата" width="70"></GridColumn>
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
