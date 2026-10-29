// Утилиты для скачивания

const downloadFileMess = async (context, url, fileName) => {
    // Скачивание файла с отображением сообщения об ошибке
    try {
        // Получаем файл по ссылке
        const response = await fetch(url);

        // Проверяет, возможно сервер ответил ошибкой (e.g., 403, 404, 500)
        if (!response.ok) {
            context.$store.commit("setMessage", {
                msg_icon: "error-message",
                msg_text: await response.text(), // Считываем текст из тела
            });
            return; // Дальше не выполняем
        }

        // Конвертируем ответ в blob
        const blob = await response.blob();

        // Создаем временный URL дляe blob
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;

        // Программно запускаем скачивание
        document.body.appendChild(link);
        link.click();

        // Очищаем память и элементы DOM
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
        // Обрабатываем ошибки
        context.$store.commit("setMessage", {
            msg_icon: "error-message",
            msg_text: error.message,
        });
    }
}

export { downloadFileMess };
