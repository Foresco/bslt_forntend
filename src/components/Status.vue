<template>
  <div id="stts" align="center">
    Версия 1.1.37
    <template v-if="status.user_session_id != ''">
      Дата и время входа: {{ status.session_datetime }}. |
      Идентификатор сессии: {{ status.user_session_id }} |
      <a :href="passlink">Cменить пароль</a>
    </template>
    <template v-else>
      Войдите в систему, воспользовашись формой входа.
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: this.$store.getters.getStatus,
      passlink: "/password/"
    };
  },
};
</script>

<style>
#stts {
  padding: 2px;
  border: 1px solid #dfdfdf;
}
</style>