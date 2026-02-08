<template>
  <common-list suburl="fileupload/">
    <GridColumn field="file_name" title="Имя файла" width="200"></GridColumn>
    <GridColumn field="upload_date" title="Дата загрузки" width="100"></GridColumn>
    <GridColumn field="upload_user" title="Пользователь"></GridColumn>
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
