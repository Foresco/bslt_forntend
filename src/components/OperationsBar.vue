<template>
  <div class="bar_div">
    <img
      v-for="oper in operations"
      :key="oper.id"
      :src="img_url(oper)"
      :title="oper.name"
    />
  </div>
</template>

<script>
export default {
  name: "OperationBar",
  props: {
    // Массив с перечнем операций
    operations: [],
  },
  methods: {
    img_url(oper) {
      if (oper.prog_state == 2) return require('@/assets/icons/state_no.png'); // Состояние программы Нет
      return require(`@/assets/icons/${oper.state}.png`);
    },
  },
};
</script>

<style>
.bar_div {
  height: 20px;
}
</style>
