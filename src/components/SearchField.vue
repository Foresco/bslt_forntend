<template>
  <div style="text-align: center">
    <img
      :src="logo_url"
      alt="Логотип"
      style="margin: 20px auto 0px; display: block"
    />
    <SearchBox
      style="width: 500px; margin-top: 15px; margin-bottom: 15px"
      placeholder="Введите строку поиска"
      v-model="value"
      @search="onSearch($event)"
    >
      <Addon>
        <span
          v-if="value"
          class="textbox-icon icon-clear"
          title="Очистить"
          @click="value = null"
        ></span>
      </Addon>
    </SearchBox>
    <LinkButton
      iconCls="icon-settings"
      style="margin-left: 3px"
      title="Дополнительные параметры поиска"
      @click="$refs.d1.expand()"
    ></LinkButton>
    <DataGrid
      :data="result_rows"
      selectionMode="single"
      :loading="loading"
      :emptyMsg="msg"
      v-if="showResults()"
      @rowDblClick="onRowDblClick($event)"
      style="height: 500px"
    >
      <GridColumn width="18px" :cellCss="getIcon"></GridColumn>
      <GridColumn field="description" title="Результаты поиска"></GridColumn>
      <GridColumn width="100px" field="type_key"></GridColumn>
    </DataGrid>

    <Drawer
      :inline="true"
      :drawerStyle="{ width: '280px' }"
      ref="d1"
      region="east"
    >
      <search-params ref="sp"></search-params>
    </Drawer>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import SearchParams from "@/components/SearchParams.vue";

export default {
  components: {
    SearchParams,
  },
  data() {
    return {
      value: null,
      result_rows: [],
      msg: "",
      loading: false, // Признак выполняемой загрузки
    };
  },
  computed: {
    logo_url() {
      return require("@/assets/images/logo1.png");
    },
  },
  methods: {
    getIcon(row) {
      return row.type_key;
    },
    async onSearch(event) {
      // Значения из параметров поиска
      let params = this.$refs.sp.search_params;
      // Текст поиска
      params.search = event.value;

      this.loading = true;
      this.result_rows = await getData(this, "search/", params);
      this.loading = false;

      // console.log(this.$refs.searchparams.search_params.part_type);
      this.msg = "Ничего не найдено";
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event.pk}/`);
    },
    showResults() {
      // Опредение необходимость отображения датагрида
      // Если есть результаты или есть сообщение
      return this.result_rows.length > 0 || this.msg > "";
    },
  },
};
</script>