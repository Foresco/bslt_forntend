<template>
  <common-list>
    <GridColumn field="code" title="Наименование"></GridColumn>
    <GridColumn field="group_code" title="Код"></GridColumn>
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
