<template>
  <div>
    <template v-for="(link, index) in links">
      {{ getSpace(index) }}
      <a :href="getHref(link.id)" :key="link.id" target="_blank"
        >{{ link.caption }}
      </a>
    </template>
  </div>
</template>

<script>
export default {
  name: "LinksBar",
  data() {
    return {
      host_url: this.$store.getters.getHostUrl, // Адрес сервера
    };
  },
  props: {
    // Массив с перечнем ссылок
    links: [],
  },
  methods: {
    getHref(id) {
      return `${this.host_url}/${id}/`;
    },
    getSpace(index) {
      // Чтобы запятая выводилась в нужном месту
      return index ? ", " : "";
    },
  },
};
</script>
