<template>
  <Dialog
    ref="txtfrm"
    :title="'Редактировать'"
    :dialogStyle="{ width: '600px', height: '600px' }"
    :modal="true"
    :closed="true"
    :draggable="true"
    :resizable="true"
  >
    <div style="height: 85%; margin-bottom: 10px">
      <TextBox
        ref="textarea"
        :multiline="true"
        v-model="value"
        style="width: 100%; height: 100%"
      ></TextBox>
    </div>
    <div ref="converter" style="display: none"></div>
    <div class="char-bar" v-if="editable">
      <table>
        <tbody>
          <tr>
            <td
              class="char-button"
              v-for="char in chars1"
              :key="char"
              v-html="char"
              @click="insertChar(char)"
            ></td>
          </tr>
          <tr>
            <td
              class="char-button"
              v-for="char in chars2"
              :key="char"
              v-html="char"
              @click="insertChar(char)"
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="form_buttons_bar" v-if="editable">
      <LinkButton @click="onSaveClick()" title="Закрыть форму. Не забудьте затем нажать кнопку Сохранить">Ok</LinkButton>
    </div>
  </Dialog>
</template>
    
<script>
export default {
  data() {
    return {
      chars1: [
        "&#8501",
        "&#913",
        "&#8736",
        "&#914",
        "&#8773",
        "&#169",
        "&#916",
        "&#247",
        "&#8709",
        "&#915",
        "&#8805",
        "&#8734",
        "&#8804",
        "&#181",
        "&#177",
        "&#963", 
        "&#948",
        "&#968",
        "&#0176",
        "&#9722",
    ],
    chars2: [
        "&#8304",
        "&#185",
        "&#178",
        "&#179",
        "&#8308",
        "&#8309",
        "&#8310",
        "&#8311",
        "&#8312",
        "&#8313",
        "&#8314",
        "&#8315",
        "&#183",
        "&#8320",
        "&#8321",
        "&#8322",
        "&#8323",
        "&#8324",
        "&#8325",
        "&#8326",
        "&#8327",
        "&#8328",
        "&#8329",
        "&#8330",
        "&#8331",
        "&#64435"
      ],
      field_id: null, // Идентификатор поля
      value: null, // Значение поля
    };
  },
  props: {
    editable: Boolean, // Возможно ли редактирование
  },
  methods: {
    openForm: function (field_id, value) {
      this.field_id = field_id;
      this.value = value;
      this.$refs.txtfrm.open();
    },

    insertChar(char) {
      const convert = (value) => {
        // Трюк для конвертации спецсимволов
        this.$refs.converter.innerHTML = value;
        return this.$refs.converter.innerText;
      };
      const textarea = this.$refs.textarea.$refs.inputRef;

      const pos = textarea.selectionStart || 0;
      const sentence = this.value || "";
      const len = sentence.length;
      const before = sentence.substr(0, pos);
      const after = sentence.substr(pos, len);

      this.value = convert(before + char + after);
    },
    onSaveClick() {
      this.$emit("texteditclosed", this.field_id, this.value); // Сообщаем родительской форме о закрытии. Там это событие обрабатывается
      this.$refs.txtfrm.close();
    },
  },
};
</script>

<style>
.form_buttons_bar {
  margin-right: 5px;
  float: right;
}
.char-bar {
  float: left;
}
.char-button {
  border: solid 1px;
  width: 8px;
  height: 8px;
  padding: 4px;
  font-size: 120%;
  cursor: pointer;
}
</style>