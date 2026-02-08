<template>
  <div>
    <div>
      <Form
        :model="new_link"
        :labelWidth="0"
        v-if="checkEdit('arcdocumentobjects')"
      >
        <FormField :key="1" name="child">
          <ComboBox
            placeholder="Объект"
            style="width: 150px"
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
        :columnResizing="true"
        selectionMode="single"
        @rowSelect="onRowSelect($event)"
        @rowDblClick="onRowDblClick($event)"
      >
        <GridColumn field="child" title="Касается"></GridColumn>
      </DataGrid>
    </div>
    <div
      class="buttons_bar"
      v-if="checkEdit('arcdocumentobjects')"
      v-show="link_id"
    >
      <LinkButton
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
      link_id: null, // Идентификатор выбранной строки
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    async loadArcdocLinks() {
      this.list_data = [];
      if (this.selected_id) {
        const params = { parent: this.selected_id };
        this.loading = true;
        const url = "arcdocumentobject/";
        this.list_data = await getData(this, url, params);
        this.loading = false;
      }
    },
    getCodes(event) {
      // Чтобы зарегистрировать внешнюю фукнцию
      getCodes(this, event.filterValue, "partobject").then(
        (response) => (this.codes = response)
      );
    },
    onRowSelect(event) {
      this.link_id = event.pk;
    },
    onAddClick() {
      this.new_link["parent"] = this.$store.getters.getSelectedId;
      this.$store
        .dispatch("postData", {
          inc_url: "arcdocumentobject",
          params: this.new_link,
        })
        // Обновление списка
        .then(() => this.loadArcdocLinks());
    },
    onDeleteClick() {
      // Удаляем отмеченную строку
      this.$store
        .dispatch("deleteData", {
          inc_url: "arcdocumentobject",
          id: this.link_id,
        })
        // Обновление списка
        .then(() => this.loadArcdocLinks());
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event["child_id"]}/`);
    },
  },
  watch: {
    selected_id() {
      this.loadArcdocLinks();
    },
  },
  mounted() {
    if (this.selected_id) this.loadArcdocLinks(); // На случай, если извещение или объект уже указаны
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>