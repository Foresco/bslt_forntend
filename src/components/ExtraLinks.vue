<template>
  <DataGrid :data="list_data">
    <GridColumn field="caption" title="Ссылка">
      <template slot="body" slot-scope="scope">
        <a :href="scope.row.link">{{ scope.row.caption }}</a>
      </template>
    </GridColumn>
  </DataGrid>
</template>
     
<script>
import { getData } from "@/api/api";

export default {
  data() {
    return {
      list_data: [],
    };
  },
  mounted() {
    const url = `extralinks/${this.$store.getters.getSubTypeKey}/${this.$store.getters.getSelectedId}`;
    getData(this, url).then((response) => (this.list_data = response));
  },
};
</script>