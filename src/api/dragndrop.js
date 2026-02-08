const bindEvents = (context, right_to_check="objectfiles") => {
    // TODO: Использовать и в PicturePane;
    const determineDragAndDropCapable = () => {
        // Проверка, поддерживает ли браузер перетаскивание
        var div = document.createElement("div");

        return (
            ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
            "FormData" in window &&
            "FileReader" in window
        );
    }
    // Привязка событий к форме
    if (determineDragAndDropCapable()) {
        if (context.checkEdit(right_to_check)) {
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
                    context.$refs.fileform.addEventListener(
                        evt,
                        function (e) {
                            e.preventDefault(); // Отключаем реакцию по умолчанию
                            e.stopPropagation(); // Отключаем передачу события дальше в элементы
                        }.bind(context),
                        false
                    );
                }.bind(context)
            );
            // Добавляем обработчик для события drop
            context.$refs.fileform.addEventListener(
                "drop",
                function (e) {
                    // Запоминаем переданные файлы
                    for (let i = 0; i < e.dataTransfer.files.length; i++) {
                        context.selected_files.push(e.dataTransfer.files[i]);
                    }
                }.bind(context)
            );
        }
    }
}

export { bindEvents };
