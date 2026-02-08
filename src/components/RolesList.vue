<template>
  <common-list-np suburl="role/">
    <GridColumn field="list_value" title="Наименование"></GridColumn>
    <GridColumn field="order_num" title="Порядок в списке"></GridColumn>
  </common-list-np>
</template>

<script>
import CommonListNp from "@/components/CommonListNp.vue"; // Общий компонент всех списков

export default {
  components: {
    CommonListNp,
  },
};
</script>
