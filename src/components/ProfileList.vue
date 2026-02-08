<template>
  <common-list suburl="userprofile/">
    <GridColumn field="user" title="Логин"></GridColumn>
    <GridColumn field="user_name" title="Ф.И.О."></GridColumn>
    <GridColumn field="dismissed" title="Уволен"></GridColumn>
    <GridColumn field="dashboard" title="Страница"></GridColumn>
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
