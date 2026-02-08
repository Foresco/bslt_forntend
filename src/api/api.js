// Функции работы с REST API бэкэнда
import axios from 'axios';
// Указание куки с данными о сеансе
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

// Отправка и обработка GET-запроса
const getData = async (context, inc_url, params = {}) => {
    let url = context.$store.getters.getBackendUrl;
    url = `${url}/${inc_url}`;
    try {
        const response = await axios.get(url, { params: params });
        return response.data;
    } catch (error) {
        // console.log(error);
        context.$store.commit('setMessage', {
            msg_icon: 'error-message',
            msg_text: `Ошибка выполнения get-запроса к ${url}`,
        });
    }
};

const getResponseId = (context) => {
    // Получение идентификатора из ответа сервера
    const response = context.$store.getters.getResponseData;
    if (response) return response.pk;
    return null;
};

const dowloadFile = (url, file_name, context) => {
    // Скачивание файла по ссылке
    axios
    .get(url, { responseType: "blob" })
    .then(function (response) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file_name);
      document.body.appendChild(link);
      context.loading = false; // Активация кнопки
      link.click();
    })
    .catch(function (error) {
      console.log(error);
      this.loading = false; // Активация кнопки
    });
};

export {
    getData, getResponseId, dowloadFile
};
