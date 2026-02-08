<template>
  <common-list suburl="codeprefix/">
    <GridColumn field="prefix_code" title="Префикс" width="200"></GridColumn>
    <GridColumn field="project_code" title="Проект" width="200"></GridColumn>
    <GridColumn field="description" title="Описание"></GridColumn>
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
