<template>
  <notice-links-common side="child">
    <GridColumn field="parent" title="Извещение">
      <template slot="body" slot-scope="scope">
        <a :href="scope.row.notice_url">{{ scope.row.parent }}</a>
      </template>
    </GridColumn>
    <GridColumn field="change_type" title="Тип" width="30px"></GridColumn>
    <GridColumn field="change_num" title="Номер" width="50px"></GridColumn>
    <GridColumn field="is_done_str" title="Проведено" width="100px"></GridColumn>
  </notice-links-common>
</template>

<script>
import NoticeLinksCommon from "@/components/NoticeLinksCommon.vue"; // Общий компонент

export default {
  components: {
    NoticeLinksCommon,
  },
};
</script>