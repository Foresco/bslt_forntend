<template>
  <common-list>
    <GridColumn field="nom_code" title="Код" width="100"></GridColumn>
    <GridColumn field="code" title="Наименование"></GridColumn>
    <GridColumn field="parent" title="ГОСТ, ОСТ, ТУ"></GridColumn>
    <GridColumn field="ei" title="ЕИ" width="100"></GridColumn>
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
