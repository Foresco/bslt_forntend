<template>
  <common-list suburl="designer/">
    <GridColumn field="designer" title="Разработчик" width="250"></GridColumn>
    <GridColumn field="designer_profile" title="Профиль пользователя"></GridColumn>
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
