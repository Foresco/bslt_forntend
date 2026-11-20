<template>
  <div id="App">
    <Layout style="width: 100%; height: 100%">
      <LayoutPanel region="North" style="width: 100%; height: 58px">
        <menu-bar></menu-bar>
        <message-bar></message-bar>
      </LayoutPanel>
      <LayoutPanel region="center" style="height: 580px">
        <Tabs style="height: 100%">
          <TabPanel title="Экспорт данных" iconCls="icon-add">
            <Form
              :model="params_values"
              :labelWidth="250"
              labelAlign="right"
              style="max-width: 600px"
            >
              <FormField :key="index" :name="f.param_name" :label="f.caption">
                <TextBox
                  v-if="f.param_type == 'TextBox'"
                  v-model="params_values[f.param_name]"
                ></TextBox>
                <ComboBox
                  v-if="f.param_type == 'List'"
                  v-model="params_values[f.param_name]"
                  :data="f.data"
                ></ComboBox>
                <ComboBox
                  v-if="f.param_type == 'Link'"
                  v-model="params_values[f.param_name]"
                  valueField="pk"
                  textField="value"
                  :data="ref_data[f.param_name]"
                  :lazy="true"
                  @filterChange="
                    onFilterChange(
                      $event,
                      f.param_name,
                      f.extra_value || 'partobject'
                    )
                  "
                ></ComboBox>
                <CheckBox
                  v-if="f.param_type == 'CheckBox'"
                  v-model="params_values[f.param_name]"
                ></CheckBox>
                <DateBox
                  v-if="f.param_type == 'DateBox'"
                  v-model="params_values[f.param_name]"
                  format="dd.MM.yyyy"
                  :firstDay="1"
                ></DateBox>
                <NumberBox
                  v-if="f.param_type == 'NumberBox'"
                  v-model="params_values[f.param_name]"
                  :precision="0"
                  :groupSeparator="' '"
                ></NumberBox>
                <FileButton
                  v-if="f.param_type == 'FileButton'"
                  :multiple="false"
                  v-model="params_values[f.param_name]"
                  >Выбрать...</FileButton
                >
                <div v-if="f.param_type == 'RadioButton'">
                  <div v-for="(val, id) in f.values_list" :key="id">
                    <RadioButton
                      :name="f.param_name"
                      :inputId="id"
                      :value="id"
                      v-model="params_values[f.param_name]"
                    ></RadioButton>
                    <Label :for="id">{{ val }}</Label>
                  </div>
                </div>
              </FormField>
              <FormField label="Формат отчета">
                <ComboBox
                  v-model="params_values['output_format']"
                  valueField="pk"
                  textField="value"
                  :data="report_formats"
                ></ComboBox>
              </FormField>
              <FormField>
                <LinkButton
                  v-show="!loading"
                  iconCls="icon-print"
                  style="margin: 10px"
                  @click="submitPrint()"
                  >Сформировать</LinkButton
                >
                <img
                  v-show="loading"
                  src="@/assets/images/preloader.gif"
                  alt="Loading"
                  style="margin-left: 100px"
                />
              </FormField>
            </Form>
          </TabPanel>
          <TabPanel title="Импорт данных" iconCls="icon-add"> </TabPanel>
        </Tabs>
      </LayoutPanel>

      <LayoutPanel region="south" style="width: 100%; height: 22px">
        <status></status>
      </LayoutPanel>
    </Layout>
  </div>
</template>

<script>
import { page } from "@/pages/Page/mixin.js"; // Общий функционал всех страниц

// Импорт компонентов
import MenuBar from "@/components/MenuBar.vue";
import MessageBar from "@/components/MessageBar.vue";
import Status from "@/components/Status.vue";

export default {
  mixins: [page],
  components: {
    MenuBar,
    MessageBar,
    Status,
  },
};
</script>
