<template>
  <common-list suburl="systemuser/">
    <GridColumn field="username" title="Логин"></GridColumn>
    <GridColumn field="first_name" title="Имя"></GridColumn>
    <GridColumn field="last_name" title="Фамилия"></GridColumn>
    <GridColumn field="last_login" title="Вход"></GridColumn>
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
