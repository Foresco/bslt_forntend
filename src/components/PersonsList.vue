<template>
  <common-list suburl="person/">
    <GridColumn field="person" title="Сотрудник"></GridColumn>
    <GridColumn field="person_profile" title="Профиль пользователя"></GridColumn>
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
