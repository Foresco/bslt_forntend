<template>
  <common-list>
    <GridColumn field="place_type" title="Тип" width="120"></GridColumn>
    <GridColumn field="code" title="Обозначение"></GridColumn>
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
