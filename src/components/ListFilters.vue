<template>
  <div>
    <Form labelWidth="0" :model="void_values" @submit.prevent>
      <FormField key="hidden" v-show="false">
        <TextBox>Без этого Enter перезагружает страницу</TextBox>
      </FormField>
      <FormField key="search">
        <TextBox
          ref="tbsearch"
          inputId="search"
          v-model="list_filters.search"
          placeholder="Текст для фильтрации"
          v-on:keypress.native="onKeyDown($event)"
        >
        </TextBox>
      </FormField>
      <FormField key="date" v-if="checkField('date')">
        <ComboBox
          inputId="sign"
          v-model="list_filters.date_sign"
          :data="sign_data"
          style="width: 20px"
        ></ComboBox>
        <DateBox
          v-model="list_filters.date"
          format="dd.MM.yyyy"
          placeholder="Дата для фильтрации"
          :firstDay="1"
          style="width: 120px"
        ></DateBox>
      </FormField>
      <FormField key="parent" v-if="checkField('parent')">
        <ComboBox
          v-model="list_filters.parent"
          :data="parents"
          valueField="pk"
          textField="value"
          :lazy="true"
          placeholder="Объект для фильтрации"
          @filterChange="getParent($event)"
        ></ComboBox>
      </FormField>
      <FormField key="ordermaker" v-if="checkField('ordermaker')">
        <ComboBox
          v-model="list_filters.ordermaker"
          :data="ordermakers"
          valueField="pk"
          textField="value"
          :lazy="true"
          placeholder="Заказчик"
          @filterChange="getOrderMaker($event)"
        ></ComboBox>
      </FormField>
      <FormField key="supplier" v-if="checkField('supplier')">
        <ComboBox
          v-model="list_filters.supplier"
          :data="suppliers"
          valueField="pk"
          textField="value"
          :lazy="true"
          placeholder="Поставщик"
          @filterChange="getSupplier($event)"
        ></ComboBox>
      </FormField>
      <FormField key="place" v-if="checkField('place')">
        <ComboBox
          v-model="list_filters.place"
          :data="places"
          valueField="pk"
          textField="value"
          :lazy="true"
          placeholder="Подразделение"
          @filterChange="getPlace($event)"
        ></ComboBox>
      </FormField>
      <FormField key="operation" v-if="checkField('operation')">
        <ComboBox
          v-model="list_filters.operation"
          :data="operations"
          valueField="pk"
          textField="value"
          :lazy="true"
          placeholder="Операция"
          @filterChange="getOperation($event)"
        ></ComboBox>
      </FormField>
      <FormField key="material" v-if="checkField('material')">
        <ComboBox
          v-model="list_filters.material"
          :data="materials"
          valueField="pk"
          textField="value"
          :lazy="true"
          placeholder="Материал для фильтрации"
          @filterChange="getMaterial($event)"
        ></ComboBox>
      </FormField>
      <FormField key="orderstate" v-if="checkField('orderstate')">
        <ComboGrid
          valueField="pk"
          textField="list_value"
          v-model="list_filters.states"
          :data="states"
          :multiple="true"
          placeholder="Состояния заказа"
          :textFormatter="formatStates"
          :panelStyle="{ width: '300px' }"
        >
          <DataGrid slot="grid" :border="false">
            <GridColumn
              field="list_value"
              title="Состояние заказа"
            ></GridColumn>
          </DataGrid>
        </ComboGrid>
      </FormField>
      <FormField key="not_supplied" v-if="checkField('not_supplied')">
        <Label for="not_supplied"> Скрыть отгруженные </Label>
        <SwitchButton
          v-model="list_filters.not_supplied"
          title="Скрыть позиции, которые отгружены в полном объеме"
          id="not_supplied"
        ></SwitchButton>
      </FormField>
      <FormField>
        <LinkButton
          iconCls="icon-filter"
          style="margin: 5px"
          @click="onFilterClick"
          >Фильтровать</LinkButton
        >
        <LinkButton
          iconCls="icon-clear"
          title="Очистить параметры фильтрации"
          @click="onClearClick"
          >Очистить</LinkButton
        >
      </FormField>
    </Form>
  </div>
</template>

<script>
import { getCodes } from "@/api/utils";
import { getListValues } from "@/api/utils";

export default {
  name: "ListFilters",
  data() {
    return {
      void_values: {}, // Пустой словарь
      list_filters: {
        search: null, // Тест для фильтрации
        date_sign: "min_date", // Знак сравнения даты
        date: null, // Дата для фильтрации
        parent: null, // Родитель для фильтрации
        material: null, // Материал для фильтрации
        ordermaker: null, // Заказчик для фильтрации
        supplier: null, // Поставщик для фильтрации
        place: null, // Производственное подразделение для фильтрации
        operation: null, // Операция для фильтрации
        states: [], // Набор состояний для фильтрации
        not_supplied: false, // Фильтрация только неотгруженных
      },
      parents: [], // Список обозначений для подстановки в поле Родитель
      materials: [], // Список обозначений для подстановки в поле Материал
      ordermakers: [], // Список заказчиков для подстановки в поле Заказчик
      suppliers: [], // Список поставщиков для подстановки в поле Поставщик
      places: [], // Список производственных подразделений для подстановки в поле Подразделение
      operations: [], // Список операций для подстановки в поле Операция
      states: [], // Список возможных состояний заказа
      ordering: [], // Список сортирующих полей
      filter_fields: [], // список отображаемых полей при поиске
      sign_data: [
        // Данные для знака сравнения даты
        { value: "min_date", text: ">" },
        { value: "max_date", text: "<" },
        { value: "equal_date", text: "=" },
      ],
      default_states: [1, 2, 3, 5], // Значения фильтра состояний по умолчанию
    };
  },
  methods: {
    getParent(event) {
      getCodes(this, event.filterValue, "partobject").then(
        (response) => (this.parents = response)
      );
    },
    getMaterial(event) {
      getCodes(this, event.filterValue, "partobject", {
        part_type__in: '["exemplar", "material"]',
      }).then((response) => (this.materials = response));
    },
    getOrderMaker(event) {
      getCodes(this, event.filterValue, "place", { is_buyer: "True" }).then(
        (response) => (this.ordermakers = response)
      );
    },
    getSupplier(event) {
      getCodes(this, event.filterValue, "place", { is_supplier: "True" }).then(
        (response) => (this.suppliers = response)
      );
    },
    getPlace(event) {
      getCodes(this, event.filterValue, "place", { is_point: "True" }).then(
        (response) => (this.places = response)
      );
    },
    getOperation(event) {
      getCodes(this, event.filterValue, "operation").then(
        (response) => (this.operations = response)
      );
    },
    setListFilters() {
      this.$store.commit(
        "setListFilters",
        JSON.parse(JSON.stringify(this.list_filters))
      ); // JSON чтобы не происходило связывания со store и ошибок из-за этого
    },
    onFilterClick: function () {
      this.setListFilters();
      this.$store.commit("setListReloadNeeded");
    },
    clearFilters() {
      // Очистка фильтров, устновка значений по умолчанию
      for (const key in this.list_filters) {
        this.list_filters[key] = null; // Обнуление всех фильтров
      }
      // Значения, отличные от нулевых
      this.list_filters.date_sign = "min_date";
      this.list_filters.not_supplied = false;
      // Установка набора значений по умолчанию только если есть поле с состояниями
      if (this.checkField("orderstate"))
        this.list_filters.states = this.default_states;
    },
    onClearClick: function () {
      this.clearFilters();
      this.onFilterClick(); // Обновление списка с фильтрацией
    },
    checkField: function (field_name) {
      // Получение признака отображения поля
      return this.filter_fields.includes(field_name);
    },
    formatStates(value) {
      if (this.value && this.value.length > 3) {
        return this.value.length + " состояний выбрано";
      }
      return value;
    },
    onKeyDown(event) {
      if (event.keyCode == 13) {
        // Нажато Enter
        this.onFilterClick(); // Обновление списка с фильтрацией
      }
    },
  },
  created() {
    // Получение списка отображаемых полей
    if (typeof filter_fields != "undefined") {
      this.filter_fields = filter_fields;
    } else this.filter_fields = [];
    // Получение списка состояний
    if (this.checkField("orderstate")) {
      getListValues(this, "prodorderstate").then((response) => {
        this.states = response;
        this.onClearClick();
      });
    } else this.onClearClick();
  },
};
</script>
