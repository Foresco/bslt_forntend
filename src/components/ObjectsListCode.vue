<template>
  <common-list>
    <GridColumn field="nom_code" title="Код" width="100"></GridColumn>
    <GridColumn field="code" title="Обозначение"></GridColumn>
    <GridColumn field="parent" title="Документ" width="200"></GridColumn>
    <GridColumn field="title" title="Наименование"  width="200"></GridColumn>
    <GridColumn field="ei" title="ЕИ" width="30"></GridColumn>
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
