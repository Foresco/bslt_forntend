<template>
  <div>
    <div>
      <Form
        :model="new_position"
        :labelWidth="0"
        v-if="checkEdit('personstaffposition')"
      >
        <FormField :key="1" name="place">
          <ComboBox
            placeholder="Подразделение"
            v-model="new_position.place"
            :data="places"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getPlaces($event)"
          ></ComboBox>
        </FormField>
        <FormField :key="2" name="staff_position">
          <ComboBox
            placeholder="Должность"
            v-model="new_position.staff_position"
            :data="positions"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getPositions($event)"
          ></ComboBox>
        </FormField>
        <div class="buttons_bar" v-if="checkEdit('personstaffposition')">
          <LinkButton
            iconCls="icon-add"
            @click="onAddClick"
            v-show="selected_id"
            >Добавить</LinkButton
          >
        </div>
      </Form>
    </div>
    <div>
      <DataGrid
        :data="list_data"
        selectionMode="single"
        @rowSelect="onRowSelect($event)"
      >
        <GridColumn field="place" title="Подразделение"></GridColumn>
        <GridColumn field="staff_position" title="Должность"></GridColumn>
      </DataGrid>
    </div>
    <div class="buttons_bar">
      <LinkButton
        v-show="link_id"
        iconCls="icon-no"
        style="margin: 10px"
        @click="onDeleteClick()"
        >Удалить</LinkButton
      >
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { getSuggest } from "@/api/utils";
import { mapState } from "vuex";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
      new_position: {
        place: null,
        staff_position: null,
      }, // Информация о новой связи с извещением
      places: [], // Список для выбора подразделения
      positions: [], // Список для выбора должности
    };
  },
  computed: mapState(["selected_id", "link_id"]),
  methods: {
    async loadListData() {
      this.list_data = []; // Очистка списка
      let params = { person: this.selected_id };
      this.loading = true;
      const url = "personstaffposition/";
      this.list_data = await getData(this, url, params);
      this.loading = false;
    },
    onRowSelect(event) {
      this.$store.commit("setLinkId", event.pk);
    },
    getPlaces(event) {
      getSuggest(this, "place", event.filterValue, { is_point: "True" }).then(
        (response) => (this.places = response)
      );
    },
    getPositions(event) {
      getSuggest(this, "staffposition", event.filterValue).then(
        (response) => (this.positions = response)
      );
    },
    onAddClick() {
      this.new_position["person"] = this.$store.getters.getSelectedId;
      this.$store
        .dispatch("postData", {
          inc_url: "personstaffposition",
          params: this.new_position,
        })
        // Обновление списка извещений
        .then(() => this.loadListData());
    },
    onDeleteClick() {
      // Удаляем отмеченную строку
      this.$store
        .dispatch("deleteData", {
          inc_url: "personstaffposition",
          id: this.link_id,
        })
        // Обновление списка
        .then(() => this.loadListData());
    },
  },
  watch: {
    selected_id() {
      this.loadListData();
    },
  },
  mounted() {
    if (this.selected_id) this.loadListData(); // На случай, если сотрудник уже указан
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>