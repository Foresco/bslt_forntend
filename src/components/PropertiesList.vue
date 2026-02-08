<template>
  <common-list type_key="property" suburl="property/">
    <GridColumn field="property_name" title="Наименование"></GridColumn>
    <GridColumn field="property_type" title="Тип"></GridColumn>
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
