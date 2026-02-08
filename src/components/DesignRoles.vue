<template>
  <div>
    <Form :model="design_roles" :labelWidth="170" labelAlign="right">
      <FormField v-if="checkEdit('designroles')">
        <div class="buttons_bar">
          <LinkButton iconCls="icon-save" @click="onSaveClick"
            >Сохранить</LinkButton
          >
          <CheckBox
            class="save_dsg"
            v-model="save_designers"
            title="Сохранить набор"
          ></CheckBox>
          <LinkButton
            iconCls="icon-tip"
            @click="onFillClick"
            style="margin-left: 5px"
            >Заполнить</LinkButton
          >
        </div>
      </FormField>
      <FormField
        v-for="(f, index) of all_roles"
        :key="index"
        :name="f.role"
        :label="f.role"
      >
        <ComboBox
          title="Разработчик"
          v-model="design_roles[f.role_id]['designer']"
          :data="designers[f.role_id]"
          valueField="pk"
          textField="value"
          :lazy="true"
          @filterChange="getDesigners($event, f.role_id)"
        ></ComboBox>
      </FormField>
    </Form>
  </div>
</template>

<script>
import { getData } from "@/api/api";
import { mapState } from "vuex";
import { getSuggest } from "@/api/utils";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      all_roles: [], // Список ролей
      design_roles: {}, // Роли у объекта
      designers: {}, // Списки разработчиков
      designers_to_save: [], // Список разработчков у ролей для сохранения в настройках
      is_filled: false, // Признак того, что роли заполнены по кнопке
      save_designers: false, // Признак необходимости сохранения дизайнеров
    };
  },
  computed: mapState(["selected_id"]),
  methods: {
    async loadDesignRoles() {
      this.all_roles = [];
      this.loading = true;
      // Получение общего списка ролей
      const roles = await getData(this, "role/");
      // Роли у объекта
      const object_roles = await getData(this, "designrole/", {
        subject: this.selected_id,
      });

      // Сбор данных для формы
      for (let i = 0; i < roles.length; i++) {
        this.all_roles.push({
          role: roles[i].list_value,
          role_id: roles[i].pk,
        });
        // Если роль исполнена, то заносим данные
        const obj_role = object_roles.find((o) => o.role === roles[i].pk);
        if (obj_role) {
          this.design_roles[roles[i].pk] = obj_role;
          // Добавляем в список подстановки для отображения
          this.designers[roles[i].pk] = [
            { pk: obj_role.designer, value: obj_role.designer_name },
          ];
        } else {
          // Заполняем пустыми значениями
          this.design_roles[roles[i].pk] = {
            pk: null,
            role: roles[i].pk,
            designer: null,
            comment: null,
          };
          this.designers[roles[i].pk] = [];
        }
      }
      this.loading = false;
      this.is_filled = false;
    },
    async getDesigners(event, index) {
      // Получение списка подстановки для поля Разработчик
      if (this.is_filled) return; // Если роли заполнены, то подстановка не работает
      this.designers[index] = await getSuggest(
        this,
        "designer",
        event.filterValue,
        { role: index }
      );
      // Для надежного обновления данных в компоненте
      this.designers = Object.assign({}, this.designers);
    },
    addDesignerToSave(role) {
      // Добавление описания дизайнера в массив для возможного сохранения
      if (role.designer) // Если указан дизайнер
        this.designers_to_save.push({
          pk: role.role,
          designers: [
            {
              pk: role.designer,
              value: this.designers[role.role]
                .filter((el) => el.pk == role.designer)
                .at(0).value,
            },
          ],
        });
    },
    processRole(role) {
      // Добавление или редактирование роли у объекта
      if (role.pk) {
        // Если у роли есть идентификатор роли у объекта
        // Наполняем массив для возможного сохранения
        this.addDesignerToSave(role);
        if (role.designer) {
          // Если указан разработчик - Обновляем данные
          return this.$store.dispatch("patchData", {
            inc_url: "designrole",
            id: role.pk,
            params: role,
          });
        } else {
          // Разработчик не указан - Удаляем запись
          return this.$store.dispatch("deleteData", {
            inc_url: "designrole",
            id: role.pk,
          });
        }
      } else {
        if (role.designer) {
          // Если указан разработчик -- Создаем запись
          role["subject"] = this.$store.getters.getSelectedId;
          // Наполняем массив для возможного сохранения
          this.addDesignerToSave(role);
          return this.$store.dispatch("postData", {
            inc_url: "designrole",
            params: role,
          });
        }
      }
    },
    async onFillClick() {
      // Заполнение рекомендуемыми ролями
      // Получение общего списка ролей
      const roles = await getData(this, "roledesingners/");
      for (let i = 0; i < roles.length; i++) {
        const pk = roles[i].pk;
        // Определяем, заполнена ли роль
        if (this.design_roles[pk].designer == null) {
          // Роль не заполнена
          const designers = roles[i].designers;
          if (designers) {
            // Если есть варианты
            this.design_roles[pk].designer = designers[0].pk; // Указываем значение (первый разработчик в списке)
            this.designers[pk] = designers; // Заполняем список подстановки для роли
          }
        }
      }
      this.designers = Object.assign({}, this.designers); // Рекомендация разработчков EasyUI
      this.is_filled = true;
    },
    saveDesigners() {
      // Сохранение указанных разработчиков в настройках
      // Если набраны разработчики, сохраняем
      if (this.designers_to_save) {
        this.$store.dispatch("postData", {
          inc_url: "usersettings",
          params: {
            setting_id: "designers",
            setting_value: JSON.stringify(this.designers_to_save),
          },
        });
      }
    },
    onSaveClick() {
      // Сохранение внесенных в форму изменений
      this.designers_to_save = []; // Предварительная очитска чтобы не накапливалось
      // Используем Promise чтобы обновить список только после сохранения данных
      const promiseSave = new Promise(() => {
        // Перебираем весь массив ролей
        let promises_list = [];
        Object.values(this.design_roles).forEach((val) => {
          // Создаем запрос на обработку роли
          let p = this.processRole(val);
          // Добавляем в очередь
          promises_list.push(p);
        });
        // Обновление списка ролей после выполнения всех запросов
        Promise.all(promises_list).then((values) => {
          // Сохранение настроек пользователя по ролям разработчиков
          if (this.save_designers) {
            this.saveDesigners();
          }
          this.loadDesignRoles();
        });
      });
    },
  },
  watch: {
    selected_id() {
      this.loadDesignRoles();
    },
  },
  mounted() {
    if (this.selected_id) this.loadDesignRoles(); // На случай, если объект уже указан
  },
};
</script>

<style>
.buttons_bar {
  margin: 5px;
}
.save_dsg {
  margin-left: 5px;
}
</style>