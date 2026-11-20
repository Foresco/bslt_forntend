<template>
  <common-list suburl="shipmentlist/">
    <GridColumn field="order_code" title="Номер заказа" width="120"></GridColumn>
    <GridColumn field="child_code" title="Позиция заказа"></GridColumn>
    <GridColumn field="order_maker" title="Заказчик" width="250"></GridColumn>
    <GridColumn field="shipment_date" title="Дата" width="80"></GridColumn>
    <GridColumn field="quantity" title="Количество" width="80"></GridColumn>
    <GridColumn field="creator" title="Исполнитель" width="150"></GridColumn>
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
