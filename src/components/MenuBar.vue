<template>
  <div style="float: left; width: 100%">
    <LinkButton
      plain
      key="1000"
      iconCls="homelink"
      @click="onItemClick('search')"
    ></LinkButton>
    <MenuButton
      v-for="menu_button in menu_buttons"
      :key="menu_button.id"
      :text="menu_button.caption"
      :iconCls="menu_button.style"
      :duration="900"
      plain
    >
      <Menu v-if="menu_button.children" @itemClick="onItemClick($event)">
        <MenuItem
          v-for="menu_item in menu_button.children"
          :key="menu_item.id"
          :text="menu_item.caption"
          :iconCls="menu_item.style"
          :value="menu_item.action"
          plain
        >
        </MenuItem>
      </Menu>
    </MenuButton>
    <LinkButton plain key="1001" iconCls="search" @click="onItemClick('search')"
      >Поиск</LinkButton
    >
    <LinkButton
      plain
      key="1002"
      iconCls="help"
      @click="onItemClick('help/user', '_blank')"
      >Помощь</LinkButton
    >
    <div style="float: right; positon: fixed; top: 0">
      <LinkButton
        plain
        key="1003"
        iconCls="logout"
        @click="onItemClick('logout')"
        title="Выйти из сеанса"
        iconAlign="right"
        >{{ status.username }}</LinkButton
      >
    </div>
  </div>
</template>

<script>
import { getData } from "@/api/api";

export default {
  data() {
    return {
      menu_buttons: [],
      status: this.$store.getters.getStatus,
    };
  },
  created() {
    this.getMainMenu();
  },
  methods: {
    async getMainMenu() {
      // Получение состава меню
      // Пока отключил. Надо разобраться как стирать при выходе
      // this.menu_buttons = sessionStorage.getItem('menu_buttons'); // Проверка наличия в хранилище

      if (!this.menu_buttons.length) {
        // Нет элементов - заправшиваем на сервере - сохраняем
        this.menu_buttons = await getData(this, "menu/");
        if (typeof this.menu_buttons != undefined) {
          // Чтобы пустое значение не запоминалось.
          sessionStorage.setItem(
            "menu_buttons",
            JSON.stringify(this.menu_buttons)
          );
        }
      } else this.menu_buttons = JSON.parse(this.menu_buttons);
    },
    onItemClick(event, target = "_self") {
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/${event}/`, target); // Открыть в текущем окне
    },
    onLogout() {
      // Выход из системы
      sessionStorage.clear(); // Очистка сессионного хранилища
      const host = this.$store.getters.getHostUrl;
      window.open(`${host}/logout/`, "_self");
    },
    onHomeClick(event, target = "_self") {
      // Переход на домашнюю страницу
      const host = this.$store.getters.getHostUrl;
      let home_url = `${host}/search/`;
      if (typeof home != "undefined") {
        home_url = `${host}/${event}/`;
      }
      window.open(home_url, target); // Открыть в текущем окне
    },
  },
};
</script>

<style src="../assets/menubar.css">
</style>