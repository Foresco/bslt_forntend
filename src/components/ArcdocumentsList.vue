<template>
  <common-list type_key="arcdocument">
    <GridColumn field="document_num" title="Ном. номер" width="150"></GridColumn>
    <GridColumn field="code" title="Обозначение" width="250"></GridColumn>
    <GridColumn field="parent" title="Стадия" width="100"></GridColumn>
    <GridColumn field="document_name" title="Наименование"></GridColumn>
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
