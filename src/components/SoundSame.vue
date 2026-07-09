<template>
  <div>
    <div>
      <Label for="dpth" align="left" class="field_label">Глубина сравнения (от 1 до 5):</Label>
      <NumberBox
        inputId="dpth"
        v-model="depth"
        :min="0"
        :max="5"
        :precision="0"
        :spinners="true"
      ></NumberBox>
    </div>
    <div>
      <DataGrid
        :data="list_data"
        selectionMode="multiple"
        @rowDblClick="onRowDblClick($event)"
      >
        <GridColumn field="value" title="Обозначение"></GridColumn>
      </DataGrid>
    </div>
    <div class="buttons_bar" v-if="checkEdit('soundsamelist')">
      <LinkButton
        iconCls="icon-redo"
        style="margin-left: 10px"
        @click="submitFormReplace()"
        >Заменить выделенные</LinkButton
      >
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { mapState } from "vuex";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      depth: 2, // Глубина редактирования
      list_data: [], // Собранные и сформированные данные для грида
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    async loadSame() {
      const url = `soundsame/${this.$store.getters.getSelectedId}`;
      this.list_data = [];
      this.loading = true;
      this.list_data = await getData(this, url, {depth: this.depth});
      this.loading = false;
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event.pk}/`);
    },
  },
  watch: {
    selected_id(newValue, oldValue) {
      this.loadSame();
    },
    depth(newValue, oldValue) {
      this.loadSame();
    },
  },
  mounted() {
    if (this.selected_id) this.loadSame(); // На случай, если объект указан
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
.field_label {
  margin-left: 5px;
}
</style>