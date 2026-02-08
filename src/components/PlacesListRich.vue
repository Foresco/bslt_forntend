<template>
  <common-list>
    <GridColumn field="parent" title="Находится на" width="180"></GridColumn>
    <GridColumn field="place_type" title="Тип" width="120"></GridColumn>
    <GridColumn field="code" title="Наименование"></GridColumn>
    <GridColumn field="short_name" title="Кратко" width="150"></GridColumn>
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
