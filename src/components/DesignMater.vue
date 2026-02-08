<template>
  <div>
    <form style="margin: 3px" v-if="checkEdit('designmater')">
      <ComboBox
        placeholder="Обозначение"
        v-model="new_material.child"
        style="width: 250px"
        :data="codes"
        valueField="pk"
        textField="value"
        :lazy="true"
        @filterChange="getCodes($event)"
      ></ComboBox>
      <LinkButton iconCls="icon-add" @click="submitFormAdd()"
        >Назначить</LinkButton
      >
    </form>
    <div>
      <DataGrid :data="list_data" @rowDblClick="onRowDblClick($event)">
        <GridColumn field="child" title="Конструкторский материал"></GridColumn>
      </DataGrid>
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { mapState } from "vuex";
import { getCodes } from "@/api/utils";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
      new_material: {
        parent: null,
        child: null,
        comment: null,
      }, // Информация о новом конструкторском материале
      codes: [], // Список обозначений для подстановки
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    async loadDesignMater() {
      this.list_data = []; // Очистка списка
      let params = { parent: this.selected_id };
      this.loading = true;
      const url = "designmater/";
      const res = await getData(this, url, params);
      this.list_data = res.results;
      this.loading = false;
    },
    getCodes(event) {
      // Чтобы зарегистрировать внешнюю фукнцию
      getCodes(this, event.filterValue, "partobject", {part_type: "exemplar"}).then(
        (response) => (this.codes = response)
      );
    },
    submitFormAdd() {
      this.new_material["parent"] = this.$store.getters.getSelectedId;
      this.$store
        .dispatch("postData", {
          inc_url: "designmater",
          params: this.new_material,
        })
        .then(() => this.loadDesignMater());
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event.pk}/`);
    },
  },
  watch: {
    selected_id(newValue, oldValue) {
      this.loadDesignMater();
    },
  },
  mounted() {
    if (this.selected_id) this.loadDesignMater(); // На случай, если объект уже указан
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>