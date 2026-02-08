export const page = {
    methods: {
        fillStore: function() {
            // Перенос в хранилище уникальных значений, переданных для данной страницы
            // Передаются только значения, которые были заданы
            if (typeof host_url != 'undefined') {
                this.$store.commit('setHostUrl', host_url);
            }
            if (typeof caption != 'undefined') {
                this.$store.commit('setCaption', caption);
            }
            if (typeof type_key != 'undefined') {
                this.$store.commit('setTypeKey', type_key);
            }
            if (typeof root_classification_id != 'undefined')
                this.$store.commit(
                    'setRootClassificationId',
                    root_classification_id
                );
            if (typeof sub_type_key != 'undefined') {
                this.$store.commit('setSubTypeKey', sub_type_key);
            }

            if (typeof object_id != 'undefined') {
                this.$store.commit('setSelectedId', object_id);
                this.$store.commit("setPictureObjectId", object_id);
                // Запоминание идентификатора объекта в корневой идентификатор
                // Чтобы дальнейшее перемещение по дереву не меняло настроек
                this.$store.commit('setRootId', object_id);
            }

            if (typeof order_id != 'undefined') {
                this.$store.commit('setOrderId', order_id);
            }

            if (typeof user_session_id != 'undefined') {
                const status = {
                    user_session_id: user_session_id || '',
                    username: username || '',
                    session_datetime: session_datetime || '',
                };
                this.$store.commit('setStatus', status);
            }
        },
        checkShow: function(panel_name) {
            // Получение признака отображения панели
            return panels.includes(panel_name);
        },
        checkInOrder: function() {
            // Проверка, что объект это часть заказа
            return this.$store.getters.getOrderId;
        }
    },
    created() {
        // Именно created, чтобы в дочерних компонентах
        // в mounted считать значения из хранилища
        this.fillStore(); // Установка значений в хранилище
        this.$store.commit('resetMessage'); // Очистка сообщений, чтобы отобразился заголовок (caption)
    },
};
