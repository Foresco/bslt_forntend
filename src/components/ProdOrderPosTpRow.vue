<template>
  <div>
    <Form :model="pos_row" :labelWidth="160" labelAlign="right">
      <FormField :key="1" name="prog_state" label="Управляющая программа">
        <ComboBox
          v-model="pos_row.prog_state"
          :data="prog_states"
          valueField="pk"
          textField="list_value"
        ></ComboBox>
      </FormField>
      <div class="buttons_bar">
        <LinkButton
          iconCls="icon-save"
          style="margin-left: 160px"
          @click="submitFormSave()"
          title="Сохранить изменения"
          >Сохранить</LinkButton
        >
      </div>
    </Form>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { getListValues } from "@/api/utils";
import { mapState } from "vuex";

export default {
  data() {
    return {
      pos_row: {}, // Информация о свойствах строки
      prog_states: [], // Список состояний для подстановки
    };
  },
  computed: {
    operation_link() {
      // Параметр для отслеживания совместного изменения двух идентификаторов
      // TODO: Не очень красиво, и кажется медленно
      return `${this.operation_id}.${this.link_id}`;
    },
    ...mapState(["operation_id", "link_id"]),
  },
  methods: {
    async loadData() {
      const url = "prodorderlinktprow/";
      let row = await getData(this, url, {
        prod_order_link: this.link_id,
        tp_row: this.operation_id,
      });
      if (row.length) {
        this.pos_row = row[0];
      } else this.pos_row = { pk: null, prog_state: null }; // Пустое значение
    },
    fnCreate() {
      // Создание новой записи
      const new_link = {
        prod_order_link: this.link_id,
        tp_row: this.operation_id,
        prog_state: this.pos_row.prog_state,
      };
      this.$store
        .dispatch("postData", {
          inc_url: "prodorderlinktprow",
          params: new_link,
        })
        .then((response) => {
          this.loadData();
          // Выставляем флаг необходимости перезагрузки списка
          this.$store.commit("setListReloadNeeded", true);
        });
    },
    fnSave() {
      // Сохранение изменений
      this.$store
        .dispatch("patchData", {
          inc_url: "prodorderlinktprow",
          id: this.pos_row.pk,
          params: {
            prog_state: this.pos_row.prog_state,
          },
        })
        .then((response) =>
          // Выставляем флаг необходимости перезагрузки списка
          this.$store.commit("setListReloadNeeded", true)
        );
    },
    submitFormSave() {
      if (this.pos_row.pk) this.fnSave();
      // Если это существующая строка
      else this.fnCreate(); // Создаем новую строку
    },
  },
  watch: {
    operation_link() {
      this.loadData();
    },
  },
  mounted() {
    getListValues(this, "orderlinktprowstate").then(
      (response) => (this.prog_states = response)
    );
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>
