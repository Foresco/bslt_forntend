<template>
  <div class="container">
    <div v-show="picture">
      <img :src="picture" class="pict" />
      <div class="opn_link">
        <a :href="picture" target="_blank">Открыть иллюстрацию</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getData } from "@/api/api";

export default {
  data() {
    return {
      picture: "", // Адрес расположения иллюстрации
    };
  },
  computed: mapState(["picture_object_id"]),
  methods: {
    getPicture() {
      // Получние информации об иллюстрации
      const params = { id: this.picture_object_id };
      const url = "uploadgraphic/";
      getData(this, url, params).then(
        (response) =>
          (this.picture = response.graphic_file
            ? `${this.$store.getters.getHostUrl}/static/graphic/${response.graphic_file}`
            : "")
      );
    },
  },
  watch: {
    picture_object_id() {
      this.getPicture();
    },
  },
  mounted() {
    if (this.picture_object_id) this.getPicture(); // На случай, если объект уже указан
  },
};
</script>

<style>
.pict {
  width: 400px;
  height: 300px;
  display: block;
  margin: auto;
  object-fit: contain;
}

.opn_link {
  position: absolute;
  width: 500px;
  left: 0;
  top: 250px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.container:hover .opn_link {
  opacity: 1;
}
</style>
