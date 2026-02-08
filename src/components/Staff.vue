<template>
  <div>
    <form style="margin: 3px" v-if="checkEdit('staff')">
      <NumberBox
        placeholder="Поз."
        :min="1"
        v-model="new_link.position"
        style="width: 60px"
      ></NumberBox>
      <ComboBox
        placeholder="Тип"
        style="width: 180px"
        v-model="part_type"
        :data="part_types"
        valueField="pk"
        textField="value"
        :limitToList="true"
      ></ComboBox>
      <ComboBox
        placeholder="Обозначение"
        v-model="new_link.child"
        style="width: 250px"
        :data="codes"
        valueField="pk"
        textField="value"
        :lazy="true"
        :limitToList="false"
        @filterChange="getCodes($event)"
        @selectionChange="getTitle($event)"
      ></ComboBox>
      <TextBox
        placeholder="Наименование"
        v-model="title"
        style="width: 250px"
      ></TextBox>
      <NumberBox
        placeholder="Кол-во"
        v-model="new_link.quantity"
        :min="0"
        :precision="-1"
        style="width: 75px"
      ></NumberBox>
      <ComboBox
        v-model="unit"
        style="width: 60px"
        :data="units"
        valueField="pk"
        textField="value"
        :limitToList="true"
      ></ComboBox>
      <LinkButton
        iconCls="icon-add"
        style="margin-left: 10px"
        @click="submitFormAdd()"
        >Добавить</LinkButton
      >
    </form>
    <div>
      <DataGrid
        :data="staff_data"
        :loading="loading"
        :columnResizing="true"
        :clickToEdit="true"
        groupField="div_name"
        editMode="row"
        style="height: 100%"
      >
        <GridColumn field="checked" :editable="true" width="28"
          ><template slot="body" slot-scope="scope">
            <CheckBox v-model="scope.row.checked"></CheckBox
          ></template>
          <template slot="edit" slot-scope="scope">
            <CheckBox v-model="scope.row.checked"></CheckBox></template
        ></GridColumn>
        <GridColumn width="18px" :cellCss="getIcon"></GridColumn>
        <GridColumn field="formats" title="Формат" width="70"></GridColumn>
        <GridColumn
          field="draft_zone"
          title="Зона"
          :editable="true"
          width="40"
        ></GridColumn>
        <GridColumn field="position" title="Поз." :editable="true" width="70"
          ><template slot="edit" slot-scope="scope">
            <NumberBox
              v-model="scope.row.position"
              :precision="0"
              :min="1"
            ></NumberBox> </template
        ></GridColumn>
        <GridColumn field="child" title="Обозначение">
          <template slot="body" slot-scope="scope">
            <a :href="scope.row.url">{{ scope.row.child }}</a>
          </template>
        </GridColumn>
        <GridColumn field="title" title="Наименование" width="250"></GridColumn>
        <GridColumn field="quantity" title="Кол-во" :editable="true" width="70">
          <template slot="edit" slot-scope="scope">
            <NumberBox v-model="scope.row.quantity" :precision="0"></NumberBox>
          </template>
        </GridColumn>
        <GridColumn field="measurement" title="ЕИ" width="40"></GridColumn>
        <GridColumn
          field="comment"
          title="Примечание"
          :editable="true"
          width="160"
        ></GridColumn>
        <GridColumn field="first_use" title="ПП" :editable="true" width="30"
          ><template slot="body" slot-scope="scope">
            <CheckBox v-model="scope.row.first_use"></CheckBox
          ></template>
          <template slot="edit" slot-scope="scope">
            <CheckBox v-model="scope.row.first_use"></CheckBox></template
        ></GridColumn>
        <template slot="group" slot-scope="scope">
          <span style="font-weight: bold">
            {{ scope.value }}: {{ scope.rows.length }}
          </span>
        </template>
      </DataGrid>
    </div>
    <div class="buttons_bar" v-if="checkEdit('staff')">
      <LinkButton iconCls="icon-save" @click="onSaveClick()"
        >Сохранить</LinkButton
      >
      <LinkButton
        iconCls="icon-no"
        style="margin-left: 10px"
        @click="onDeleteClick()"
        >Удалить</LinkButton
      >
      <LinkButton
        iconCls="icon-renum"
        style="margin-left: 10px"
        @click="onRenumClick()"
        >Перенумеровать</LinkButton
      ><LinkButton
        iconCls="icon-reload"
        style="margin-left: 10px"
        title="Обновить"
        @click="getStaff()"
      ></LinkButton>
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import FileIcons from "@/components/FileIcons.vue";
import { getSuggest, isInList, getPropValues } from "@/api/utils";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  name: "Staff",
  mixins: [editable_component],
  data() {
    return {
      staff_data: [], // Данные для дерева состава
      part_type: "", // Начальное значение по умолчанию
      new_link: {
        child: null,
        parent: null,
        order: null,
        position: null,
        quantity: null,
      }, // Информация о новом элементе состава
      part_types: [
        {"pk": "document", "value": "Документация"},
        {"pk": "complex", "value": "Комплекс"},
        {"pk": "assembly", "value": "Сборочная единица"},
        {"pk": "detail", "value": "Деталь"},
        {"pk": "standart", "value": "Стандартное изделие"},
        {"pk": "other", "value": "Прочее изделие"},
        {"pk": "material", "value": "Материал"},
        {"pk": "exemplar", "value": "Материал (Экземпляр)"},
        {"pk": "complect", "value": "Комплект"}
      ], // Список типов для подстановки
      codes: [], // Список обозначений для подстановки
      units: [], // Список для выбора единицы измерения
      title: "", // Поле Наименование
      unit: null, // Поле Единица измерения
      loading: false,
    };
  },
  methods: {
    getIcon(row) {
      return row.part_type.pk;
    },
    reduceRow(nodes, row_node) {
      row_node.url = `/${row_node.child_id}/`;
      row_node["checked"] = false;
      row_node["div_name"] = row_node["part_type"]["div_name"];
      nodes.push(row_node);
      return nodes;
    },
    getStaff() {
      // Получение состава
      const url = "partlink/";
      const params = { parent: this.$store.getters.getRootId };
      getData(this, url, params).then((res) => {
        this.staff_data = res.reduce(this.reduceRow, []);
      });
    },
    async getUnits() {
      this.units = await getSuggest(this, "measureunit", "", {
        essence__in: "[1, 2]", // Безразмерные, Масса
      });
    },
    onRowDblClick(event) {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event.child_id}/`);
    },
    async getPartTypes() {
      // Получение списка подстановки для поля Тип
      this.part_types = await getSuggest(this, "parttype");
      this.part_type = "detail"; // Значение по умолчанию
    },
    async getCodes(event) {
      let params = {};
      // Если в поле типов выбран тип, то добавляем его в параметры
      if (this.part_type) params.part_type = this.part_type;
      // Получение списка подстановки для поля Обозначение
      this.codes = await getSuggest(
        this,
        "partobject",
        event.filterValue,
        params
      );
    },
    async getTitle(event) {
      if (event && isInList(this.codes, event.pk)) {
        if (event.pk === parseInt(event.pk, 10)) {
          // Дополнительная защита, так как при копипасте не срабатывают предыдущие
          // Получаем наименование выбранного объекта, если он существует
          const ob = await getPropValues(this, "partobject", event.pk);
          // выводим в форму
          this.title = ob.title;
          this.unit = ob.unit ? ob.unit.pk : null;
        }
      }
    },
    submitFormAdd() {
      this.new_link.parent = this.$store.getters.getRootId;
      this.new_link.order = this.$store.getters.getOrderId;
      // Определяем, передан ли существующий объект
      const in_list = isInList(this.codes, this.new_link.child);
      if (!in_list) {
        // Если передан несуществующий объект
        this.new_link.code = this.new_link.child; // Это обозначение, а не идентификатор
        this.new_link.title = this.title;
        this.new_link.unit = this.unit;
        this.new_link.child = null; // Убираем ссылку - она неверная
        this.new_link.part_type = this.part_type; // Необходимо для создания нового объекта состава
      }
      this.$store
        .dispatch("postData", {
          inc_url: "partlink",
          params: this.new_link,
        })
        // Обновление состава
        .then(() => {
          if (this.new_link.position) this.new_link.position++; // Увеличиваем номер позиции на единицу (для удобства)
          this.getStaff();
        });
    },
    onRowClick(event) {
      // Обработка клика по ветке в дереве
      this.$store.commit("setLinkId", event.id);
    },
    onSaveClick() {
      // Сохраняем отмеченные строки
      let updated_rows = [];
      for (const q of this.staff_data.filter((row) => row.checked)) {
        updated_rows.push({
          id: q.pk,
          params: {
            draft_zone: q.draft_zone,
            position: q.position,
            quantity: q.quantity,
            reg_quantity: q.reg_quantity,
            comment: q.comment,
            first_use: q.first_use,
          },
        });
      }
      if (updated_rows)
        this.$store
          .dispatch("patchDataMany", {
            inc_url: "partlink",
            rows: updated_rows,
          })
          // Обновление состава
          .then(() => this.getStaff());
    },
    onDeleteClick() {
      // Удаляем отмеченные строки
      let deleted_rows = [];
      for (const q of this.staff_data.filter((row) => row.checked)) {
        deleted_rows.push(q.pk);
      }
      if (deleted_rows)
        this.$store
          .dispatch("deleteDataMany", {
            inc_url: "partlink",
            ids: deleted_rows,
          })
          // Обновление состава
          .then(() => this.getStaff());
    },
    onRenumClick() {
      // Перенумерация строк начиная с указанной
      let start_row = { parent: this.$store.getters.getRootId }; // Параметры строки для начала перенумерации
      for (const q of this.staff_data.filter((row) => row.checked)) {
        start_row.pk = q.pk;
        start_row.position = q.position || 1;
        break;
      }
      if (start_row.pk != undefined) {
        this.$store
          .dispatch("postData", {
            inc_url: "renum",
            params: start_row,
          })
          // Обновление состава
          .then(() => this.getStaff());
      } else {
        this.$store.commit("setMessage", {
          msg_icon: "error-message",
          msg_text: "Укажите строку для начала нумерации и начальный номер",
        });
      }
    },
  },
  mounted() {
    // this.getPartTypes(); // Пока берем фиксированный набор
    this.getUnits();
    this.getStaff(); // Получение состава
  },
  components: {
    FileIcons,
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>
