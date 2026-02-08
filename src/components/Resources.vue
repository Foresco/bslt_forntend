<template>
  <div>
    <div>
      <Form :model="new_res" :labelWidth="200" labelAlign="right">
        <FormField :key="1" label="Тип ресурса">
          <ComboBox
            placeholder="Тип ресурса"
            v-model="row_type"
            :data="row_types"
            valueField="pk"
            textField="list_value"
          ></ComboBox>
        </FormField>
        <FormField :key="2" label="Код материала">
          <ComboBox
            placeholder="Код материала"
            v-model="nom_code_id"
            :data="nom_codes"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getNomCodes($event)"
            @selectionChange="getUnit($event, 'nom_code')"
          ></ComboBox>
        </FormField>
        <FormField :key="3" label="Обозначение ресурса">
          <ComboBox
            placeholder="Обозначение ресурса"
            v-model="code_id"
            :data="codes"
            valueField="pk"
            textField="value"
            :lazy="true"
            @filterChange="getCodes($event)"
            @selectionChange="getUnit($event, 'code')"
          ></ComboBox>
        </FormField>
        <FormField :key="5" label="Чистый вес">
          <NumberBox
            placeholder="Чистый вес"
            v-model="new_res.net_weight"
            :min="0"
            :precision="-1"
            :suffix="unit"
            decimalSeparator=","
          ></NumberBox>
        </FormField>
        <FormField :key="6" label="Грязный вес">
          <NumberBox
            placeholder="Грязный вес"
            v-model="new_res.quantity"
            :min="0"
            :precision="-1"
            :suffix="unit"
            decimalSeparator=","
          ></NumberBox>
        </FormField>
        <FormField
        v-if="checkEdit('resources')"
        >
          <LinkButton
            v-if="mode == 'new'"
            iconCls="icon-add"
            style="margin-left: 10px"
            @click="submitFormAdd()"
            >Добавить</LinkButton
          >
          <LinkButton
            v-if="mode == 'edit'"
            iconCls="icon-save"
            style="margin: 5px"
            @click="submitFormSave()"
            >Сохранить</LinkButton
          >
          <LinkButton
            v-if="mode == 'edit'"
            iconCls="icon-no"
            style="margin: 5px"
            @click="submitFormDelete()"
            >Удалить</LinkButton
          >
        </FormField>
      </Form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getData } from "@/api/api";
import { getListValues, getCodes, getPropValues } from "@/api/utils";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      codes: [], // Список возможных ресурсов
      nom_codes: [], // Список возможных номенклатурных кодов
      notices: [], // Список возможных извещений
      row_types: [], // Список типов строк
      row_type: null,
      nom_code_id: null, // Поле для id выбранного нооменклатурного кода
      code_id: null, // Поле для id выбранного обозначения
      new_res: {
        child: null,
        parent: null,
        quantity: this.fn_norm,
        net_weight: null,
        tp_row: null,
      },
      unit: "", // Единица измерения количества объектов
      stop_get_unit: false // Признак необходимости остановки получения ЕИ
    };
  },
  props: {
    mode: {
      // Режим работы формы (new, edit)
      type: String,
      default: "new",
    },
  },
  methods: {
    getTpRowTypes() {
      // Загрузка типов строк техпроцесса
      getListValues(this, "tprowtype").then(
        (response) =>
          (this.row_types = response.filter((i) => i.pk > 7 && i.pk < 10)) // Только материалные строки
      );
    },
    getCodes(event) {
      // Получение списка подстановки для поля Обозначение
      getCodes(this, event.filterValue).then(
        (response) => (this.codes = response)
      );
    },
    async getUnit(event, field_type) {
      if (this.stop_get_unit) return; // В режиме редактирования другой обработчик
      if (!event || this.new_res.child == event.pk) return; // Защита от повторного выполнения
      if (event.pk === parseInt(event.pk, 10)) {
        // Дополнительная защита, так как при копипасте не срабатывают предыдущие
        // Получаем свойства выбранного объекта, если он существует
        const ob = await getPropValues(this, "partobject", event.pk);
        // выводим в форму
        this.unit = ob.unit ? " " + ob.unit.value : '';
        this.new_res.child = event.pk;
        if (field_type == "nom_code") {
          // Если выбирался номенкалтурный код
          // Заполняем обозначение
          this.codes = [{ pk: ob.pk, value: ob.code }];
          this.code_id = ob.pk;
        } else {
          // Значит выбиралось обозначение
          // Заполняем код
          this.nom_codes = [{ pk: ob.pk, value: ob.nom_code }];
          this.nom_code_id = ob.pk;
        }
      }
    },
    getNomCodes(event) {
      // Получение списка подстановки для поля Код материала
      getData(this, "nomcode", { nom_code: event.filterValue }).then(
        (response) => (this.nom_codes = response)
      );
    },
    prepareValues(response) {
      this.stop_get_unit = true; // Чтобы не запускалось обновление ЕИ
      // Заполнение свойств ресурса
      // Чистый и грязный вес
      this.new_res.net_weight = response.net_weight;
      this.new_res.quantity = response.quantity;
      // Тип ресурса
      this.row_type = response.row_type;
      // Код материала
      this.nom_code_id = response.child.pk;
      this.nom_codes = [{ pk: response.child.pk, value: response.nom_code }];
      // Обозначение ресурса
      this.code_id = response.child.pk;
      this.codes = [response.child];
      this.unit = response.unit ? " " + response.unit : '';
      this.stop_get_unit = false;
    },
    fillForm() {
      // Наполнение формы значениями
      if (this.mode == "edit") {
        // Только для формы в режиме Редактирование
        if (this.root_id)
          getPropValues(this, "tpresource", this.root_id).then((response) =>
            this.prepareValues(response)
          );
      }
    },
    submitFormAdd() {
      // Создание строки техпроцесса
      if (!this.row_type) {
        this.$store.commit("setMessage", {
          msg_icon: "error-message",
          msg_text: "Укажите тип ресурса",
        });
        return;
      }
      const tp_row = {
        route: this.$store.getters.getRouteId,
        route_point: this.$store.getters.getRoutePointId,
        parent: this.$store.getters.getOperationId,
        row_type: this.row_type,
      };
      // Для ресурса добавляется замена, значит нужен признак
      if (this.type_key == "tpresource")
        tp_row.replaced = this.$store.getters.getRootId;
      // Создание ресурса
      // Получение идентификатора созданной строки
      this.new_res.tp_row = tp_row;
      this.new_res.parent = this.$store.getters.getSelectedId;
      // Привязка отчета к заданию
      this.$store
        .dispatch("postData", {
          inc_url: "tpresource",
          params: this.new_res,
        })
        .then(
          (response) => this.$root.$emit("reloadBranch") // Вызов метода обновления ветки в другом компоненте
        );
    },
    async submitFormSave() {
      const prop_values = {
        row_type: this.row_type,
        child: this.new_res.child,
        net_weight: this.new_res.net_weight,
        quantity: this.new_res.quantity,
      };
      this.$store.dispatch("patchData", {
        inc_url: "tpresource",
        id: this.root_id,
        params: prop_values,
      });
    },
    async submitFormDelete() {
      this.$messager.confirm({
        title: "Подтверждение удаления",
        msg: "Вы уверены, что удаление необходимо?",
        result: (answer) => {
          if (answer) {
            this.$store
              .dispatch("deleteData", {
                inc_url: "tpresource",
                id: this.root_id,
              });
              // .then(
              //   (response) => this.$root.$emit("reloadBranch") // Вызов метода обновления ветки в другом компоненте
              // );
          }
        },
      });
    },
  },
  computed: mapState(["type_key", "root_id"]),
  mounted() {
    this.getTpRowTypes();
    this.fillForm();  // Заполняем инициализированную форму
  },
  watch: {
    root_id() {
      this.fillForm();
    }
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
</style>
