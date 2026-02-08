<template>
  <div>
    <fast-go></fast-go>
    <div id="mesbar">
      <Transition>
        <div v-if="msg_show">
          <div class="message-icon" :class="msg_icon"></div>
          <span v-html="msg_text"></span>
          <button
            class="button-ok"
            @click="onOk()"
            title="Закрыть сообщение"
            >Ок</button
          >
        </div>
        <div v-else>
          <div class="caption-text" v-html="caption"></div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

// Импорт компонентов
import FastGo from "@/components/FastGo.vue";

export default {
  components: {
    FastGo,
  },
  computed: mapState(["msg_text", "msg_icon", "msg_show", "msg_time", "caption"]),
  methods: {
    onOk() {
      this.$store.commit("resetMessage");
    },
  },
  watch: {
    msg_show() {
      var that = this;
      // После показа сообщения возвращаем надпись
      if (that.msg_show)
        setTimeout(function () {
          that.$store.commit("resetMessage");
        }, that.msg_time);
    },
  },
};
</script>

<style>
#mesbar {
  margin: 2px;
  border-top: 1px solid #dfdfdf;
  float: left;
  width: auto;
  min-width: 750px;
}
.message-icon {
  float: left;
  width: 16px;
  height: 16px;
  margin: 4px 5px 0 0;
}
.caption-text {
  font-weight: bolder;
  color: #234444;
  font-size: 120%;
  float: left;
  margin: 4px 5px 0 0;
}
.button-ok {
  margin: 3px 0 0 8px;
  padding: 2px 4px 2px 4px;
  border-radius: 0px;
  color: #404040;
  background: #fafafa;
  border: 1px solid #dfdfdf;
  font-size: 12px;
  display: inline;
}

</style>