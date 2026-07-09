<template>
  <div>
    <div>
      <ComboBox
          title="Действие"
          v-model="list_filters.action_type"
          :data="actions"
          valueField="pk"
          textField="value"
          style="width: 200px"
        ></ComboBox>
        <DateBox
          v-model="list_filters.date_from"
          format="dd.MM.yyyy"
          placeholder="Дата начала"
          :firstDay="1"
        ></DateBox>
        <DateBox
          v-model="list_filters.date_till"
          format="dd.MM.yyyy"
          placeholder="Дата окончания"
          :firstDay="1"
        ></DateBox>
      <LinkButton
            iconCls="icon-filter"
            @click="onFilterClick"
            style="margin-left: 5px"
            >Фильтровать</LinkButton
          >
    </div>
    <div>
      <common-list
        resturl="useractionlog/"
        :prepareFilters="prepareFilters"
        :loadOnMount="true"
      >
        <GridColumn
          field="action_datetime"
          title="Дата и время"
          width="200px"
        ></GridColumn>
        <GridColumn field="action_type" title="Действие"></GridColumn>
        <GridColumn field="action_link" title="Ссылка"></GridColumn>
      </common-list>
    </div>
  </div>
</template>

<script>
import CommonList from "@/components/CommonList.vue"; // Общий компонент всех списков

export default {
  name: "UserLogFilters",
  data() {
    return {
      list_filters: {
        action_type: "", // Действие
        date_from: null, // Дата начала фильтрации
        date_till: null, // Дата окончания фильтрации
      },
      actions: [
        // Данные для фильтра действий
        {pk: 'C', value: 'Форма свойств (карточка)'},
        {pk: 'D', value: 'Скачивание файла'},
        {pk: 'A', value: 'Метод API'}
      ],
    };
  },
  components: {
    CommonList,
  },
  methods: {
    prepareFilters(pageSize, pageNumber) {

      // Формирование набора фильтров
      let params = {};
      params['user_id'] = this.$store.getters.getRootId; // Идентификатор пользователя
      // Добавляем информацию о страницах
      params["limit"] = pageSize;
      params["offset"] = (pageNumber - 1) * pageSize;

      // Другие даты в фильтре
      if (this.list_filters.date_from)  params['date_from'] = this.list_filters.date_from.toLocaleDateString('en-CA');
      if (this.list_filters.date_till)  params['date_till'] = this.list_filters.date_till.toLocaleDateString('en-CA');
      if (this.list_filters.action_type)  params['action_type'] = this.list_filters.action_type;

      return params;
    },
    onFilterClick() {
      this.$store.commit("setListReloadNeeded");
    }
  },
};
</script>
