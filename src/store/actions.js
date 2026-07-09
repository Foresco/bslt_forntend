// Функции работы с REST API бэкэнда
import axios from 'axios';
// Указание куки с данными о сеансе
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

function format_message(default_message, data = {}, url = '') {
    // Форматирование текста сообщения
    // console.log(data);
    if (typeof data.message != 'undefined') return data.message;
    let pk = data.pk || '';
    let code = data.code || '';
    if (pk && code) return `${default_message}  <a href="${url}/${pk}">${code}</a>`;
    return default_message;
}

export default {
    postData: async (context, { inc_url, params = {} }) => {
        let url = context.getters.getBackendUrl;
        url = `${url}/${inc_url}/`;
        try {
            context.commit('setResponseData', null); // Очищаем результат выполнения
            const response = await axios.post(url, params);
            if (response.status == 201) {
                // Устанавливаем значение сообщения
                context.commit('setMessage', {
                    msg_icon: 'info-message',
                    msg_text: format_message('Данные успешно записаны', response.data, context.getters.getHostUrl)
                });
                // Сохраняем результат выполнения
                context.commit('setResponseData', response.data);
            }
        } catch (error) {
            if (error.response) {
                context.commit('setMessage', {
                    msg_icon: 'error-message',
                    msg_text: format_message('Ошибка записи', error.response.data)
                });
            } else
                context.commit('setMessage', {
                    msg_icon: 'error-message',
                    msg_text: `Ошибка выполнения post-запроса к ${url}`,
                });
        }
    },

    // Создание сразу нескольких строк
    // Строки передаются в rows и содержат массивы параметров создаваемых сущностей
    postDataMany: async (context, { inc_url, rows = [] }) => {
        let url = context.getters.getBackendUrl;
        url = `${url}/${inc_url}`;
        let response = null;
        for (const row of rows) {
            try {
                response = await axios.post(url, row);
            } catch (error) {
                context.commit('setMessage', {
                    msg_icon: 'error-message',
                    msg_text: `Ошибка выполнения post-запроса к ${row_url}`,
                });
            }
        }
        // console.log(response.status);
        if (response.status == 201) {
            context.commit('setMessage', {
                msg_icon: 'info-message',
                msg_text: 'Данные успешно записаны',
            });
        }
    },

    patchData: async (context, { inc_url, id, params = {} }) => {
        let url = context.getters.getBackendUrl;
        url = `${url}/${inc_url}/${id}/`;
        try {
            const response = await axios.patch(url, params);
            if (response.status == 200) {
                context.commit('setMessage', {
                    msg_icon: 'info-message',
                    msg_text: 'Данные успешно обновлены',
                });
            }
        } catch (error) {
            if (error.response) {
                context.commit('setMessage', {
                    msg_icon: 'error-message',
                    msg_text: format_message('Ошибка записи', error.response.data)
                });
            } else
                context.commit('setMessage', {
                    msg_icon: 'error-message',
                    msg_text: `Ошибка выполнения patch-запроса к ${url}`,
                });
        }
    },

    // Обновление сразу нескольких строк
    // Строки передаются в rows и содержат массивы с id и params
    patchDataMany: async (context, { inc_url, rows = [] }) => {
        let url = context.getters.getBackendUrl;
        url = `${url}/${inc_url}`;
        let response = null;
        for (const row of rows) {
            const row_url = `${url}/${row.id}/`;
            try {
                response = await axios.patch(row_url, row.params);
            } catch (error) {
                context.commit('setMessage', {
                    msg_icon: 'error-message',
                    msg_text: `Ошибка выполнения patch-запроса к ${row_url}`,
                });
            }
        }
        // console.log(response.status);
        if (response.status == 200) {
            context.commit('setMessage', {
                msg_icon: 'info-message',
                msg_text: 'Данные успешно обновлены',
            });
        }
    },

    deleteData: async (context, { inc_url, id }) => {
        let url = context.getters.getBackendUrl;
        url = `${url}/${inc_url}/${id}/`;
        try {
            const response = await axios.delete(url);
            // console.log(response.status);
            if (response.status == 204) {
                context.commit('setMessage', {
                    msg_icon: 'info-message',
                    msg_text: 'Данные успешно удалены',
                });
            }
        } catch (error) {
            // console.log('error!');
            // console.log(error);
            if (error.response) {
                context.commit('setMessage', {
                    msg_icon: 'error-message',
                    msg_text: format_message('Ошибка удаления', error.response.data)
                });
            } else context.commit('setMessage', {
                msg_icon: 'error-message',
                msg_text: `Ошибка выполнения delete-запроса к ${url}`,
            });
        }
    },

    putData: async (context, { inc_url, data = {}, headers = {} }) => {
        let url = context.getters.getBackendUrl;
        url = `${url}/${inc_url}/`;
        try {
            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status == 204 || response.status == 201) {
                context.commit('setMessage', {
                    msg_icon: 'info-message',
                    msg_text: 'Данные успешно помещены',
                });
                // Сохраняем результат выполнения
                context.commit('setResponseData', response.data);
            }
        } catch (error) {
            if (error.response) {
                context.commit('setMessage', {
                    msg_icon: 'error-message',
                    msg_text: format_message('Ошибка помещения данных', error.response.data)
                });
            } else
                context.commit('setMessage', {
                    msg_icon: 'error-message',
                    msg_text: `Ошибка выполнения put-запроса к ${url}`,
                });
        }
    },

    // Удаление сразу нескольких строк
    // Строки передаются в ids и содержат id удаляемых строк
    deleteDataMany: async (context, { inc_url, ids = [] }) => {
        let url = context.getters.getBackendUrl;
        url = `${url}/${inc_url}`;
        let response = null;
        for (const id of ids) {
            const row_url = `${url}/${id}/`;
            try {
                response = await axios.delete(row_url);
            } catch (error) {
                context.commit('setMessage', {
                    msg_icon: 'error-message',
                    msg_text: `Ошибка выполнения delete-запроса к ${row_url}`,
                });
            }
        }
        // console.log(response.status);
        if (response.status == 204) {
            context.commit('setMessage', {
                msg_icon: 'info-message',
                msg_text: 'Данные успешно удалены',
            });
        }
    },
};
