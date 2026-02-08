<template>
  <div style="float: left">
    <ComboBox
      ref="cbfast"
      placeholder="Введите обозначение для перехода"
      v-model="object_id"
      style="width: 250px"
      :data="codes"
      valueField="pk"
      textField="value"
      :lazy="true"
      :limitToList="false"
      @filterChange="getCodes($event)"
    ></ComboBox>
    <LinkButton
      iconCls="icon-go"
      plain
      @click="onGo()"
      title="Перейти к указанному объекту"
    ></LinkButton>
  </div>
</template>

<script>
import { domHelper } from "vx-easyui";
import { getCodes, isInList } from "@/api/utils";

export default {
  data() {
    return {
      object_id: null, // Идентификатор объекта для перехода
      filter_value: "", // Введенное в поле значение
      codes: [], // Список подходящих обозначений
    };
  },
  methods: {
    getCodes(event) {
      // Чтобы зарегистрировать внешнюю фукнцию
      this.filter_value = event.filterValue; // Запоминаем, чтобы получить его в другой процедуре (иначе не получается)
      getCodes(this, event.filterValue, "partobject").then(
        (response) => (this.codes = response)
      );
    },
    onGo() {
      const in_list = isInList(this.codes, this.object_id);
      if (!in_list) {
        // Если введено обозначение без выбора из списка
        const one_code = this.codes.filter(
          (row) => row.value == this.filter_value
        ); // Отбираем только нужную запись
        if (one_code.length != 1) {
          this.$store.commit("setMessage", {
            msg_icon: "error-message",
            msg_text: "Уточните введенное значение",
          });
          return;
        } else this.object_id = one_code[0]["pk"];
      }
      const host = this.$store.getters.getHostUrl;
      if (this.object_id) window.open(`${host}/${this.object_id}/`, "_self");
      else
        this.$store.commit("setMessage", {
          msg_icon: "error-message",
          msg_text: "Выберите значение из списка",
        });
    },
    onKeyDown(event) {
      if (event.keyCode == 13) {
        this.onGo();
      }
    },
  },
  mounted() {
    // TODO: Попробовать вариант как в ListFilters (он проще и красивее)
    domHelper.bind(this.$refs.cbfast.$el, "keydown", this.onKeyDown);
  },
};
</script>