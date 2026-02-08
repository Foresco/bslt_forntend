<template>
  <Form :model="serv_form" :labelWidth="0">
    <FormField :key="1" name="same_code">
      <TextBox
        placeholder="Обозначение подобного"
        v-model="serv_form.same_code"
      ></TextBox>
      <LinkButton
        iconCls="icon-add"
        @click="onCreateSameClick()"
        style="width: 170px"
        >Создать подобный</LinkButton
      >
    </FormField>
    <FormField :key="2" name="replace_code">
      <ComboBox
        placeholder="Обозначение заменяющего"
        v-model="serv_form.replace_id"
        :data="codes"
        valueField="pk"
        textField="value"
        :lazy="true"
        :limitToList="true"
        @filterChange="getCodes($event)"
      ></ComboBox>
      <LinkButton
        iconCls="icon-reload"
        @click="onRepalceClick()"
        style="width: 170px"
        >Заменить указанным</LinkButton
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
        same_code: null, // Обозначение создаваемого подобного
        replace_id: null, // Идентификатор заменяющего
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
      // Создание подобного объекта
      if (!this.serv_form.same_code) {
        // Если не указано новое обозначение
        this.$store.commit("setMessage", {
          msg_icon: "error-message",
          msg_text: "Необходимо указать обозначние создаваемого объекта",
        });
        return;
      }
      this.$store.dispatch("postData", {
        inc_url: `createsame/${this.$store.getters.getTypeKey}/${this.$store.getters.getSelectedId}`,
        params: {
          code: this.serv_form.same_code,
        },
      });
    },
    onRepalceClick() {
      // Замена одного объекта другим
      if (!this.serv_form.replace_id) {
        // Если не указан заменяющий объект
        this.$store.commit("setMessage", {
          msg_icon: "error-message",
          msg_text: "Необходимо указать заменяющий объект",
        });
        return;
      }
      this.$store.dispatch("postData", {
        inc_url: `replace/${this.$store.getters.getTypeKey}`,
        params: {
          source: this.$store.getters.getSelectedId,
          target: this.serv_form.replace_id,
        },
      });
    },
  },
};
</script>
