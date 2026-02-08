<template>
  <common-list resturl="rawrow/" :onRowSelect="onRowSelect">
    <GridColumn field="code" title="Наименование"></GridColumn>
    
  </common-list>
</template>

<script>
import CommonList from "@/components/CommonList.vue"; // Общий компонент всех списков

export default {
  components: {
    CommonList,
  },
  methods: {
    onRowSelect(event) {
      this.$store.commit("setRowId", event.pk);
    },
  }
};
</script>
