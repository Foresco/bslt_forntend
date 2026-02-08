<template>
  <common-list suburl="measureunit/">
    <GridColumn field="unit_name" title="Наименование"></GridColumn>
    <GridColumn field="short_name" title="Кратко" width="100"></GridColumn>
    <GridColumn field="unit_code" title="Код" width="80"></GridColumn>
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
