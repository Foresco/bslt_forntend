<template>
  <div>
    <template v-for="file_link in file_links">
      <a
        :href="getHref(file_link.id)"
        :key="file_link.id"
        :title="file_link.file_name"
        download
        ><img :src="file_img_url(file_link.type_class)"
      /></a>
    </template>
  </div>
</template>
</div>
</template>

<script>
export default {
  name: "FileIcons",
  data() {
    return {
      host_url: "", // Адрес сервера
    };
  },
  props: {
    // Массив с перечнем файлов
    file_links: Array,
  },
  mounted() {
    this.host_url = this.$store.getters.getHostUrl; // Чтобы потом использовать в формуле
  },
  methods: {
    getHref(id) {
      return `${this.host_url}/file/${id}/`;
    },
    file_img_url(type_class) {
      // Пометка файлов без типа особой иконкой
      return (type_class == '') ? require("@/assets/images/redfile.png") : require(`@/assets/images/${type_class}.png`);
    },
  },
};
</script>
