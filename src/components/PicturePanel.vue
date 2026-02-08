<template>
  <div class="container">
    <div v-show="picture">
      <img :src="picture" class="pict" />
      <div class="button">
        <LinkButton
          iconCls="icon-no"
          @click="submitFormDelete()"
          v-if="checkEdit('picturepanel')"
          >Удалить</LinkButton
        >
        <br />
        <a :href="picture" target="_blank">Открыть иллюстрацию</a>
      </div>
    </div>
    <div
      id="file-drag-drop"
      v-if="checkEdit('picturepanel')"
      v-show="picture == ''"
    >
      <form ref="fileform">
        <span class="drop-files">Переместите файл иллюстрации сюда</span>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getData } from "@/api/api";
import { editable_component } from "@/pages/Page/checkeditmixin.js"; // Общий функционал контроля редактирования

export default {
  mixins: [editable_component],
  data() {
    return {
      dragAndDropCapable: false, // Признак того, что браузер поддерживает драг-н-дроп
      files: [], // Файлы, брошенные на панель
      picture: "", // Адрес расположения иллюстрации
    };
  },
  computed: mapState(["picture_object_id"]),
  methods: {
    determineDragAndDropCapable() {
      // Проверка, поддерживает ли браузер перетаскивание
      var div = document.createElement("div");

      return (
        ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
        "FormData" in window &&
        "FileReader" in window
      );
    },
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
    submitFiles(e) {
      // Отправка файлов на сервер
      let formData = new FormData(); // Форма с данными
      let file = this.files[0];
      // Проверка расширения файла
      if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
        this.$store.commit("setMessage", {
          msg_icon: "error-message",
          msg_text:
            "В качестве иллюстрации возможно использование только графического файл",
        });
        e.stopPropagation(); // Отключение дальнейшей обработки события
        return;
      }

      formData.append("file", file);
      formData.append("file_name", file.name);

      if (this.picture_object_id)
        formData.append("entity", this.picture_object_id);

      // Добавление файла в базу данных
      this.$store
        .dispatch("putData", {
          inc_url: "uploadgraphic",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => this.getPicture());
    },
    submitFormDelete() {
      this.$messager.confirm({
        title: "Подтверждение удаления",
        msg: "Вы уверены, что удаление необходимо?",
        result: (answer) => {
          if (answer) {
            this.$store
              .dispatch("deleteData", {
                inc_url: "uploadgraphic",
                id: this.picture_object_id,
              })
              .then(() => this.getPicture());
          }
        },
      });
    },
    bindEvents() {
      // Привязка событий к форме
      if (this.dragAndDropCapable) {
        if (this.checkEdit("picturepanel")) {
          // Перебираем все события перетаскивания
          [
            "drag",
            "dragstart",
            "dragend",
            "dragover",
            "dragenter",
            "dragleave",
            "drop",
          ].forEach(
            function (evt) {
              this.$refs.fileform.addEventListener(
                evt,
                function (e) {
                  e.preventDefault(); // Отключаем реакцию по умолчанию
                  e.stopPropagation(); // Отключаем передачу события дальше в элементы
                }.bind(this),
                false
              );
            }.bind(this)
          );
          // Добавляем обработчик для события drop
          this.$refs.fileform.addEventListener(
            "drop",
            function (e) {
              // Запоминаем переданные файлы
              for (let i = 0; i < e.dataTransfer.files.length; i++) {
                this.files.push(e.dataTransfer.files[i]);
              }
              this.submitFiles(e); // Отправляем файлы на серевер
            }.bind(this)
          );
        }
      }
    },
  },
  watch: {
    picture_object_id() {
      this.getPicture();
      this.files = []; // Очищаем список файлов, иначе запоминает предыдущие
    },
  },
  mounted() {
    this.dragAndDropCapable = this.determineDragAndDropCapable();
    this.bindEvents();
    if (this.picture_object_id) this.getPicture(); // На случай, если объект уже указан
  },
};
</script>

<style>
#file-drag-drop {
  display: block;
  height: 150px;
  width: 400px;
  background: #a9c6e1;
  margin: auto;
  text-align: center;
  line-height: 150px;
  border-radius: 2px;
}

.pict {
  width: 400px;
  height: 300px;
  display: block;
  margin: auto;
  object-fit: contain;
}

.button {
  position: absolute;
  width: 500px;
  left: 0;
  top: 250px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.container:hover .button {
  opacity: 1;
}
</style>
