<template>
  <div>
    <div>
      <Form :model="new_link" :labelWidth="0" v-if="checkEdit('taskrefer')">
        <FormField :key="2" name="child">
          <ComboBox
            placeholder="Объект"
            v-model="new_link.child"
            :data="codes"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getCodes($event)"
          ></ComboBox>
        </FormField>
        <div class="buttons_bar">
          <LinkButton iconCls="icon-add" @click="onAddClick"
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
        <GridColumn field="child" title="Касается">
          <template slot="body" slot-scope="scope">
            <a :href="scope.row.object_url">{{ scope.row.child }}</a>
          </template>
        </GridColumn>
      </DataGrid>
    </div>
    <div class="buttons_bar" v-if="checkEdit('taskrefer')">
      <LinkButton
        iconCls="icon-no"
        style="margin: 10px"
        @click="onExcludeClick()"
        >Исключить</LinkButton
      >
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { getCodes } from "@/api/utils";
import { mapState } from "vuex";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      list_data: [], // Собранные и сформированные данные для грида
      new_link: {
        child: null,
      }, // Информация о новой связи с извещением
      codes: [], // Список для выбора объекта
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    parseRow(row_node) {
      row_node.object_url = `/${row_node.child_id}/`;
      return row_node;
    },
    async loadTaskRefer() {
      this.list_data = []; // Очистка списка
      let params = { parent: this.selected_id };
      this.loading = true;
      const url = "taskrefer/";
      const res = await getData(this, url, params);
      this.list_data = res.results.map(this.parseRow);
      this.loading = false;
    },
    onRowSelect(event) {
      this.$store.commit("setLinkId", event.pk);
    },
    getCodes(event) {
      // Чтобы зарегистрировать внешнюю фукнцию
      getCodes(this, event.filterValue).then(
        (response) => (this.codes = response)
      );
    },
    onAddClick() {
      this.new_link["parent"] = this.$store.getters.getSelectedId;
      this.$store
        .dispatch("postData", {
          inc_url: "taskrefer",
          params: this.new_link,
        })
        // Обновление списка извещений
        .then(() => this.loadTaskRefer());
    },
    onExcludeClick() {
      // Удаляем отмеченную строку
      this.$store
        .dispatch("deleteData", {
          inc_url: "taskrefer",
          id: this.$store.getters.getLinkId,
        })
        // Обновление списка
        .then(() => this.loadTaskRefer());
    },
  },
  watch: {
    selected_id(newValue, oldValue) {
      this.loadTaskRefer();
    },
  },
  mounted() {
    if (this.selected_id) this.loadTaskRefer(); // На случай, если задача уже указана
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>