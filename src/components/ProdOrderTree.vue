<template>
  <div>
    <div>
      <form style="margin: 3px" v-if="checkEdit('prodordertree')">
        <ComboBox
          placeholder="Обозначение"
          v-model="new_item.child"
          style="width: 350px"
          :data="codes"
          valueField="pk"
          textField="value"
          :lazy="true"
          @filterChange="getCodes($event)"
          @selectionChange="getRoutes($event)"
        ></ComboBox>
        <NumberBox
          placeholder="Кол-во"
          v-model="new_item.quantity"
          style="width: 80px"
        ></NumberBox>
        <ComboBox
          placeholder="Техпроцесс"
          v-model="new_item.route"
          style="width: 250px"
          :data="routes"
          valueField="pk"
          textField="value"
        ></ComboBox>
        <TextBox v-model="new_item.comment" placeholder="Примечание"></TextBox>
        <LinkButton
          iconCls="icon-add"
          style="margin-left: 10px"
          @click="submitFormAdd()"
          >Добавить</LinkButton
        >
        <ComboBox
          placeholder="Техпроцесс"
          v-model="exist_item.route"
          v-show="this.selected_type == 'staffrow'"
          style="margin-left: 50px; width: 250px"
          :data="routes_list"
          valueField="pk"
          textField="value"
        ></ComboBox>
        <NumberBox
          v-show="this.selected_type == 'staffrow'"
          v-model="exist_item.quantity"
          style="width: 80px"
        ></NumberBox>
        <LinkButton
          iconCls="icon-save"
          style="margin-left: 10px"
          v-show="selected_type == 'staffrow'"
          @click="submitFormSave()"
          >Сохранить</LinkButton
        >
      </form>
      <TreeGrid
        style="height: 480px"
        :data="tree_data"
        :footerData="footer_data"
        :showFooter="true"
        idField="id"
        treeField="code"
        @rowExpand="onRowExpand($event)"
        @rowClick="onRowClick($event)"
        @rowDblClick="onRowDblClick($event)"
      >
        <GridColumn field="code" title="Обозначение">
          <template slot="footer" slot-scope="{ row }">
            Всего позиций: {{ row.pos_count }}
          </template>
        </GridColumn>
        <GridColumn field="ssquantity" title="Кол-во" width="100"
          ><template slot="footer" slot-scope="{ row }">
            {{ row.pos_quant }}
          </template></GridColumn
        >
        <GridColumn field="tpurl" title="ТП" width="150">
          <template slot="body" slot-scope="scope" v-if="scope.row.tpurl">
            <a :href="scope.row.tpurl" target="_blank">Техпроцесс</a>
          </template>
        </GridColumn>
        <GridColumn
          field="done_quantity"
          title="Сделано"
          width="100"
        ></GridColumn>
      </TreeGrid>
    </div>
    <div class="buttons_bar">
      <LinkButton
        iconCls="icon-no"
        style="margin: 10px"
        v-show="this.selected_type == 'staffrow'"
        @click="onDeleteClick()"
        >Удалить</LinkButton
      >
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { getCodes, isInList } from "@/api/utils";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  name: "ProdOrderTree",
  mixins: [editable_component],
  data() {
    return {
      tree_data: [], // Данные для дерева состава
      footer_data: [
        {
          pos_count: 0, // Количество строк в составе
          pos_quant: 0, // Суммарное количество позиций
        },
      ], // Данные для подвала
      new_item: {
        child: null,
        comment: null,
        quantity: null,
        route: null,
      }, // Информация о новом элементе состава
      codes: [], // Список обозначений для подстановки
      routes: [], // Список маршрутов новой позиции для подстановки
      routes_list: [], // Список маршрутов выбранной строки для подстановки
      // Изменяемые свойства выбранной строки
      exist_item: {
        route: null, 
        quantity: null,
      }, // Информация о существующем элементе состава
      selected_type: null, // Тип выбранной строки
    };
  },
  mounted() {
    // Запоминание идентификатора объекта в корневой идентификатор
    // Чтобы дальнейшее перемещение по дереву не меняло настроек
    this.$store.commit("setRootId", this.$store.getters.getSelectedId);
    // Наполнение корневого узла (заказа)
    this.getProdStaffRows();
  },
  methods: {
    async getOperationRows(link_id) {
      // Получение строк операций
      const parseRow = (row_node) => {
        return {
          pk: row_node.pk,
          id: "o." + row_node.pk,
          link_id: link_id,
          code: `${row_node.place_code} / ${row_node.operation_name} (${row_node.route_point_order_num}.${row_node.tp_row_order_num})`,
          quantity: null,
          done_quantity: row_node.done_quantity,
          iconCls: "operation",
          state: "",
          subject: row_node.subject,
        };
      };
      const url = `objectoperation/${link_id}`;
      const res = await getData(this, url);
      return res.map(parseRow);
    },
    onRowExpand(row) {
      this.getOperationRows(row.link_id).then((response) =>
        this.$set(row, "children", response)
      );
    },
    async getProdStaffRows() {
      // Получение строк состава
      const parseRow = (row_node) => {
        this.footer_data[0].pos_count++; // Считаем строки
        this.footer_data[0].pos_quant += row_node["quantity"]; // Считаем количество
        const host = this.$store.getters.getHostUrl;
        row_node["link_id"] = row_node["pk"]; // Идентификатор связи
        const child = row_node["child"];
        row_node["id"] = "p." + row_node["pk"];
        row_node["pk"] = child["pk"];
        row_node["code"] = `${child["code"]} ${row_node["title"] || ''}`;
        row_node["iconCls"] = child["type_key"];
        row_node["state"] = "closed";
        row_node["tpurl"] = `${host}/arm/processtree/${child["pk"]}`;
        // Добавляем отгруженное количество
        if (row_node["ship_quantity"])
          row_node["ssquantity"] =
            row_node["quantity"] + "/" + row_node["ship_quantity"];
        else row_node["ssquantity"] = row_node["quantity"];
        return row_node;
      };
      // Обнуление счетчиков
      this.footer_data[0].pos_count = 0;
      this.footer_data[0].pos_quant = 0;
      const url = "prodorderlink/";
      const res = await getData(this, url, {
        parent: this.$store.getters.getRootId,
      });
      this.tree_data = res.map(parseRow);
    },
    onRowClick: function (event) {
      // Обработка клика по ветке в дереве
      if (event.iconCls == "operation") {
        // Установка идентификатора связи
        this.$store.commit("setLinkId", event.link_id);
        // Установка идентификатора операции
        this.$store.commit("setOperationId", event.pk);
        // Установка идентификатора объекта
        this.$store.commit("setSelectedId", event.subject);
        // Установка идентификатора объекта для иллюстрации
        this.$store.commit("setPictureObjectId", event.subject);
        // Очистка количества вхождения в состав
        this.exist_item.quantity = null;
        this.selected_type = "operation";
      } else {
        // Установка идентификатора связи
        this.$store.commit("setLinkId", event.link_id);
        // Установка идентификатора объекта
        this.$store.commit("setSelectedId", event.pk);
        // Установка идентификатора объекта для иллюстрации
        this.$store.commit("setPictureObjectId", event.pk);
        // Очистка идентификатора операции
        this.$store.commit("setOperationId", null);
        // Запоминаем количество и маршрут в строке
        this.exist_item.quantity = event.quantity;
        this.exist_item.route = event.route;
        this.routes_list = event.routes_list;
        // Запоминаем тип выбранной строки
        this.selected_type = "staffrow";
      }
    },
    async getCodes(event) {
      const parseRow = (row_node) => {
        // В подстановке отображаеются не только обозначение, но и наименование
        return {
          pk: row_node["pk"],
          value:
            row_node["value"] +
            (row_node["title"] ? " " + row_node["title"] : ""),
        };
      };
      getCodes(this, event.filterValue, "partobject").then(
        (response) => (this.codes = response.map(parseRow))
      );
    },
    async getRoutes(event) {
      // Получение списка маршрутов объекта
      if (event && isInList(this.codes, event.pk)) {
        if (event.pk === parseInt(event.pk, 10)) {
          // Дополнительная защита, так как при копипасте не срабатывают предыдущие
          // Получаем наименование выбранного объекта, если он существует
          const parseRow = (row_node) => {
            return {
              pk: row_node.pk,
              value: row_node.route_name,
            };
          };
          const url = "route/";
          const res = await getData(this, url, { subject: event.pk });
          this.routes = res.map(parseRow);
        }
      }
    },
    submitFormAdd() {
      this.new_item["parent"] = this.$store.getters.getRootId;
      // Добавленеи объекта в состав
      this.$store
        .dispatch("postData", {
          inc_url: "prodorderlink",
          params: this.new_item,
        })
        // Обновление дерева состава заказа
        .then(() => this.getProdStaffRows());
    },
    submitFormSave() {
      // Сохранение изменений в составе
      this.$store
        .dispatch("patchData", {
          inc_url: "prodorderlink",
          id: this.$store.getters.getLinkId,
          params: this.exist_item,
        })
        // Обновление дерева состава заказа
        .then(() => this.getProdStaffRows());
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event.pk}/`);
    },
    onDeleteClick() {
      if (this.$store.getters.getLinkId) {
        // Если была указана ветка для удаления
        this.$store
          .dispatch("deleteData", {
            inc_url: "prodorderlink",
            id: this.$store.getters.getLinkId,
          })
          // Обновление дерева состава заказа
          .then(() => this.getProdStaffRows());
      }
    },
  },
};
</script>

