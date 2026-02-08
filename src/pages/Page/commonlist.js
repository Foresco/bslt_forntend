// Общий функционал списоков (перечней)
// Не используется
export const common_list = {
    methods: {
        checkEdit: function (panel_name) {
            // Получение признака отображения кнопок редактирование

            return epanels.includes(panel_name);
        },
    },

};
