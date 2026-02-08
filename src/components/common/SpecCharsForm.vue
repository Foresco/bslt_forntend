<template>
  <Dialog
    ref="frm"
    :title="'Символы'"
    :dialogStyle="{ width: '430px' }"
    :modal="true"
    :closed="true"
  >
    <table class="table">
      <tbody>
        <tr>
          <td
            class="char-button"
            v-for="char in chars"
            :key="char"
            v-html="char"
            @click="insertChar(char)"
          ></td>
        </tr>
      </tbody>
    </table>
  </Dialog>
</template>

<script>
export default {
  data() {
    return {
      chars: [
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
      ],
      cur_edit: null, // Текцщий редактируемый элемент
    };
  },
  methods: {
    openForm: function (cur_edit) {
      this.cur_edit = cur_edit;
      this.$refs.frm.open();
    },
    insertChar(char) {
      console.log(char);
      if (
        this.cur_edit == undefined ||
        (this.cur_edit.nodeName.toUpperCase() != "INPUT" &&
          this.cur_edit.nodeName.toUpperCase() != "TEXTAREA")
      )
        return;

      this.cur_edit.focus();
      console.log('s1');

      if (
        typeof document.selection != "undefined" &&
        typeof document.selection.createRange != "undefined"
      ) {
        // IE
        document.selection.createRange().text = char;
      } else if (typeof this.cur_edit.selectionStart != "undefined") {
        var newPos = this.cur_edit.selectionStart + char.length;
        console.log(newPos);
        this.cur_edit.value =
          this.cur_edit.value.substring(0, this.cur_edit.selectionStart) +
          char +
          this.cur_edit.value.substring(
            this.cur_edit.selectionEnd,
            this.cur_edit.value.length
          );
        console.log(this.cur_edit.value);
        this.cur_edit.setSelectionRange(newPos, newPos);
      } else this.cur_edit.value += char;
    },
  },
};
</script>

<style>
.char-button {
  border: solid 1px;
  width: 8px;
  height: 8px;
  padding: 4px;
  font-size: 120%;
  cursor: pointer;
}
</style>
