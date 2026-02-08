<template>
  <span>
    {{ string_line }}
  </span>
</template>

<script>
export default {
  name: "StringsBar",
  props: {
    // Массив с перечнем строк
    strings: [],
  },
  computed: {
    string_line() {
      const getText = (row) => {
        return row.text;
      };
      // Парсим на случай если в списке есть не только текст
      // Далее оставляем уникальные значения
      return this.strings
        ? this.strings
            .map(getText)
            .filter((v, i, a) => a.indexOf(v) === i) // Фильтр уникальных значений
            .join(", ")
        : "";
    },
  },
};
</script>
