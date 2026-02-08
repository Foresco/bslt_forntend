<template>
  <common-list>
    <GridColumn field="code" title="Обозначение"></GridColumn>
    <GridColumn field="parent" title="Документ"></GridColumn>
    <GridColumn field="title" title="Наименование"></GridColumn>
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
