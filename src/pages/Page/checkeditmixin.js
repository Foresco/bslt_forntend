export const editable_component = {
    methods: {
        checkEdit: function (panel_name) {
            // Получение признака отображения кнопок редактирование
            return epanels.includes(panel_name);
        },
    },

};
