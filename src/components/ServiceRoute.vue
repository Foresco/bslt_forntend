<template>
  <Form :model="serv_form" :labelWidth="0">
    <FormField :key="2" name="replace_code">
      <ComboBox
        placeholder="Обозначение получателя"
        v-model="serv_form.object_id"
        :data="codes"
        valueField="pk"
        textField="value"
        :lazy="true"
        :limitToList="true"
        @filterChange="getCodes($event)"
      ></ComboBox>
      <LinkButton
        iconCls="icon-add"
        @click="onCreateSameClick()"
        style="width: 170px"
        >Создать подобный</LinkButton
      >
    </FormField>
  </Form>
</template>

<script>
import { getCodes } from "@/api/utils";

export default {
  data() {
    return {
      serv_form: {
        object_id: null, // Идентификатор получателя маршрута
      },
      codes: [], // Список обозначений для подстановки
    };
  },
  methods: {
    getCodes(event) {
      // Чтобы зарегистрировать внешнюю фукнцию
      getCodes(this, event.filterValue, "partobject").then(
        (response) => (this.codes = response)
      );
    },
    onCreateSameClick() {
      // Создание подобного маршрута
      if (!this.serv_form.object_id) {
        // Если не указан получатель
        this.$store.commit("setMessage", {
          msg_icon: "error-message",
          msg_text: "Необходимо указать объект получатель маршрута",
        });
        return;
      }
      this.$store.dispatch("postData", {
        inc_url: `createsameroute/${this.$store.getters.getRouteId}`,
        params: {
          object: this.serv_form.object_id,
        },
      });
    },
  }
};
</script>
