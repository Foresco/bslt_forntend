// Функции работы со свойствами объектов

import { treeHelper } from "vx-easyui";
import { getData } from '@/api/api';

const getPropValues = async (context, type_key, id) => {
    // Получение значений свойств экземпляра объекта
    try {
        const response = await getData(context, `${type_key}/${id}/`);
        return response;
    } catch (error) {
        throw new Error(
            `Не удалось получить свойства экземпляра ${type_key}/${id}`
        );
    }
};

const getPropsList = async (context, type_key, sub_type_key) => {
    // Получение набора свойств типа type_key
    try {
        const response = await getData(
            context,
            `properties/${type_key}/${sub_type_key}`
        );
        return response;
    } catch (error) {
        throw new Error(`Не удалось получить свойства типа ${type_key} подтипа ${sub_type_key}`);
    }
};

const getSuggest = async (context, type_key, filter, params = {}) => {
    // Получение списка значений для подстановки
    try {
        // Добавляем значения в переданные дополнительные параметры
        params.filter = filter;
        params.limit = 30;
        const response = await getData(context, `suggest/${type_key}/`, params);
        return response;
    } catch (error) {
        throw new Error(
            `Не удалось получить список подстановки для типа ${type_key}`
        );
    }
};

const getListValues = async (context, model_name, s_key=null) => {
    // Получение списка значений из модели-списка model_name
    try {
        let url = `list/${model_name}/`;
        if (s_key) url += `?s_key=${s_key}`;  // добавляем ключ структуры
        const response = await getData(context, url);
        return response;
    } catch (error) {
        throw new Error(
            `Не удалось получить значения из списка ${model_name}`
        );
    }
};

const setChildren = (data, id, rows) => {
    // Параметры:
    // data - массив с данными для дерева
    // id - идентификатор строки, у которой обновляется состав
    // rows - добавляемые строки
    // Наполнение подветки указанного объекта
    let new_data = data.slice();
    let branch = treeHelper.findNode(new_data, "id", id);
    branch.children = rows;
    data = new_data;
}

const isInList = (lst, val) => {
    // Определение, находится ли значение в списке
    // Список состоит из pk и value
    const index = lst.findIndex((row) => row.pk == val || row.value == val);
    return index >= 0;
}

const isValidHttpUrl = (string) => {
    // Проверка, явялется ли строка корректным http-адресом
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

const getCodes = async (context, filterValue, type_key = "entity", params = {}) => {
    // Получение списка подстановки для поля Обозначение
    return await getSuggest(
        context,
        type_key,
        filterValue,
        params
    );
}

export { getPropValues, getPropsList, getSuggest, getListValues, setChildren, isInList, isValidHttpUrl, getCodes };
