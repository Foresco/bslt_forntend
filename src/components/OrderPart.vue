<template>
  <Form :model="order_form" :labelWidth="200" labelAlign="right">
    <FormField :key="1" name="properties" label="Изменить свойства">
      <SwitchButton
        v-model="order_form.properties"
        title="Изменить свойства объекта-копии (наименование, масса)"
      ></SwitchButton>
    </FormField>
    <FormField :key="2" name="staff" label="Изменить состав">
      <SwitchButton
        v-model="order_form.staff"
        title="Изменить состав объекта-копии"
      ></SwitchButton>
    </FormField>
    <FormField :key="3" name="files" label="Изменить набор файлов">
      <SwitchButton
        v-model="order_form.files"
        title="Изменить набор файлов объекта-копии"
      ></SwitchButton>
    </FormField>
    <FormField :key="4" name="notices" label="Привязать извещения">
      <SwitchButton
        v-model="order_form.notices"
        title="Привязать добавленные позже извещения"
      ></SwitchButton>
    </FormField>
    <FormField :key="5" name="buttons">
      <CheckBox
        inputId="process_staff"
        v-model="order_form.process_staff"
        title="Распространить на входящие"
        v-if="false"
      ></CheckBox>
      <Label for="process_staff" style="width: 200px" v-if="false"
        >Распространить на входящие</Label
      >
      <LinkButton
        iconCls="icon-save"
        @click="onOrderPartUpdate()"
        style="margin: 5px"
        >Обновить</LinkButton
      >
    </FormField>
  </Form>
</template>

<script>
export default {
  data() {
    return {
      order_form: {
        properties: false, // Изменить свойства объекта-копии (наименование, масса)
        staff: false, // Изменить состав
        files: false, // Привязать файлы
        notices: false, // Привязать извещения
        process_staff: false, // Распространить на входящие
      },
    };
  },
  methods: {
    onOrderPartUpdate() {
      // Редактирование объекта в заказе
      this.$store.dispatch("postData", {
        inc_url: `updateorderpart/${this.$store.getters.getRootId}`,
        params: {
          properties: this.order_form.properties,
          staff: this.order_form.staff,
          files: this.order_form.files,
          notices: this.order_form.notices,
          process_staff: this.order_form.process_staff,
        },
      });
    },
  },
};
</script>
