<template>
  <common-list type_key="letter">
    <GridColumn field="direction" title="Направление" width="80"></GridColumn>
    <GridColumn field="code" title="Рег. номер" width="90"></GridColumn>
        <GridColumn field="files_arr" title="Файлы" width="75">
      <template slot="body" slot-scope="scope">
        <file-icons :file_links="scope.row.files"></file-icons>
      </template>
    </GridColumn>
    <GridColumn field="letter_num" title="Номер на письме" width="100"></GridColumn>
    <GridColumn field="reg_date" title="Дата рег-ции" width="80"></GridColumn>
    <GridColumn field="sender" title="Отправитель" width="180"></GridColumn>
    <GridColumn field="receiver" title="Получатель" width="180"></GridColumn>
    <GridColumn field="letter_theme" title="Тема"></GridColumn>
    <GridColumn field="description" title="Примечание"></GridColumn>
  </common-list>
</template>

<script>
import CommonList from "@/components/CommonList.vue"; // Общий компонент всех списков
import FileIcons from "@/components/FileIcons.vue";

export default {
  components: {
    CommonList,
    FileIcons,
  },
};
</script>
