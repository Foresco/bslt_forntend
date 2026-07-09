<template>
  <common-list suburl="downloadcheckgroup/" :loadOnMount="true">
    <GridColumn field="group_name" title="Наименование группы"></GridColumn>
    <GridColumn field="download_limit_day" title="Лимит в день" width="150"></GridColumn>
    <GridColumn field="download_limit_month" title="Лимит в месяц" width="150"></GridColumn>
    <GridColumn field="download_limit_year" title="Лимит в год" width="150"></GridColumn>
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
