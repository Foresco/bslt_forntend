<template>
  <div class="container">
    <button id="left-btn" @click="moveLeft()"><i class="arrow"></i></button>
    <div v-show="!show_add_panel">
      <img id="carousel" :src="picture" alt="" />
      <div class="action_buttons">
        <LinkButton
          iconCls="icon-no"
          @click="submitFormDelete()"
          v-if="checkEdit('picturecarousel')"
          >Удалить</LinkButton
        >
        <br />
        <a :href="picture" target="_blank">Открыть иллюстрацию</a>
      </div>
    </div>
    <div
      id="file-drag-drop"
      v-if="checkEdit('picturecarousel')"
      v-show="show_add_panel"
    >
      <form ref="fileform">
        <span class="drop-files">Переместите файл иллюстрации сюда</span>
      </form>
    </div>
    <button id="right-btn" @click="moveRight()"><i class="arrow"></i></button>
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
      // https://codepen.io/andrewzamora/pen/BOqRJO
      // Адрес расположения иллюстраций
      pictures: [
        // "https://images.unsplash.com/photo-1537000092872-06bbf7b64f60?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=14d2fe1244b43a1841569da918066fc4&auto=format&fit=crop&w=1050&q=80",
        // "https://images.unsplash.com/photo-1537005081207-04f90e3ba640?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ffb71f2a2843e802e238c5ff8e4bbb8c&auto=format&fit=crop&w=764&q=80",
        // "https://images.unsplash.com/photo-1536873602512-8e88cc8398b1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=60a351868d0839e686c8c5a286265f8d&auto=format&fit=crop&w=1050&q=80",
      ],
      picture: null,
      position: 0,
      show_add_panel: false, // Признак отображения панели добавления иллюстрации
    };
  },
  computed: mapState(["picture_object_id"]),
  methods: {
    moveRight() {
      if (this.position >= this.pictures.length) {
        // Отображение панели добавления
        if (this.show_add_panel) {
          this.position = 0;
          this.show_add_panel = false;
        } else 
        {
          this.show_add_panel = true;
          this.picture = '';
          return;
        }
      }
      this.picture = this.pictures[this.position];
      this.position++;
    },
    moveLeft() {
      if (this.position < 1) {
        // Отображение панели добавления
        if (this.show_add_panel) {
          this.position = this.pictures.length - 1;
          this.show_add_panel = false;
        } else 
        {
          this.show_add_panel = true;
          this.picture = '';
          return;
        }
      }
      this.position--;
      this.picture = this.pictures[this.position];
    },
    determineDragAndDropCapable() {
      // Проверка, поддерживает ли браузер перетаскивание
      var div = document.createElement("div");

      return (
        ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
        "FormData" in window &&
        "FileReader" in window
      );
    },
    getPictures(last=false) {
      // Получние информации об иллюстрациях
      const parseRow = (row_node) => {
        const host = this.$store.getters.getHostUrl;
        return `${host}/static/graphic/${row_node.graphic_file}`;
      };
      const params = { entity_id: this.picture_object_id };
      const url = "uploadgraphic/";
      getData(this, url, params).then((response) => {
        this.pictures = response.map(parseRow);
        if (this.pictures.length)
        {
          // Отображение иллюстрации
          const cur_pos = last ? this.pictures.length-1 : 0; // Отображать ли последнюю иллюстрацию
          this.picture = this.pictures[cur_pos];
          this.position = cur_pos+1; // Следующая иллюстрация
          this.show_add_panel = false; // Скрываем панель добавления
        } else this.show_add_panel = true; // Отображаем панель добавления
      });
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
        .then(() => this.getPictures(true));
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
              .then(() => this.getPictures());
          }
        },
      });
    },
    bindEvents() {
      // Привязка событий к форме
      if (this.dragAndDropCapable) {
        if (this.checkEdit("picturecarousel")) {
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
      this.getPictures();
      this.files = []; // Очищаем список файлов, иначе запоминает предыдущие
    },
  },
  mounted() {
    this.dragAndDropCapable = this.determineDragAndDropCapable();
    this.bindEvents();
    if (this.picture_object_id) this.getPictures(); // На случай, если объект уже указан
  },
};
</script>

<style>
/**** Стили карусели ****/
.container {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
}

.container img {
  width: 100%;
  height: 100%;
  display: block;
  margin: auto;
  object-fit: contain;
  z-index: -2;
}

button {
  height: 10%;
  border: none;
  outline: none;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  padding: 1em;
  display: flex;
}

button .arrow {
  border: solid #fff;
  border-width: 0 4px 4px 0;
  display: inline-block;
  padding: 10px;
  transition: transform 0.3s ease-out;
  outline: none;
}

#right-btn {
  margin: auto 0 auto -2em;
}

#right-btn .arrow {
  transform: rotate(-45deg);
}

#left-btn {
  z-index: 0;
  margin: auto -2em auto 0;
}

#left-btn .arrow {
  transform: rotate(135deg);
}

.action_buttons {
  position: absolute;
  width: 500px;
  left: 0;
  top: 250px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.container:hover .action_buttons {
  opacity: 1;
}
</style>
