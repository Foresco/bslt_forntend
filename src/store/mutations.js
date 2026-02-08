import { dateToPythonStr } from "@/api/formatters"; // Возможно, понадобится при формировании фильтра по дате

export default {
    setHostUrl(state, host_url) {
        state.hostUrl = host_url
    },
    setCaption(state, caption) {
        state.caption = caption
    },
    setRootClassificationId(state, root_classification_id) {
        state.root_classification_id = root_classification_id
    },
    setGroupId(state, group) {
        Vue.set(state.list_filters, 'group', group)
    },
    setRootId(state, root_id) {
        state.root_id = root_id
    },
    setUserProfileId(state, userprofile_id) {
        state.userprofile_id = userprofile_id
    },
    setSelectedId(state, selected_id) {
        state.selected_id = selected_id
    },
    setSubSelectedId(state, sub_selected_id) {
        state.sub_selected_id = sub_selected_id
    },
    setOrderId(state, order_id) {
        state.order_id = order_id
    },
    setLinkId(state, link_id) {
        state.link_id = link_id
    },
    setTypeKey(state, type_key) {
        state.type_key = type_key
    },
    setSubTypeKey(state, sub_type_key) {
        // if (sub_type_key) 
        state.sub_type_key = sub_type_key
    },
    setRouteId(state, route_id) {
        state.route_id = route_id
    },
    setRoutePointId(state, routepoint_id) {
        state.routepoint_id = routepoint_id
    },
    setPlaceId(state, place_id) {
        state.place_id = place_id
    },
    setOperationId(state, operation_id) {
        state.operation_id = operation_id
    },
    setRowId(state, row_id) {
        state.row_id = row_id
    },
    setPageKey(state, page_key) {
        state.page_key = page_key
    },
    setMessage(state, payload) {
        state.msg_icon = payload.msg_icon;
        state.msg_text = payload.msg_text;
        state.msg_show = true; // Признак отображения сообщения
        // При ошибке время показа простого сообщения 5 секунд, иначе 60 секунд
        state.msg_time = (payload.msg_icon == "info-message") ? 5000 : 60000;
    },
    resetMessage(state) {
        // Очистка сообщения
        state.msg_icon = '';
        state.msg_text = state.caption;
        state.msg_show = false; // Признак отображения сообщения
    },
    setStatus(state, status) {
        state.status = status;
    },
    setResponseData(state, response_data) {
        state.response_data = response_data;
    },
    setToolClassId(state, tool_class_id) {
        state.tool_class_id = tool_class_id
    },
    setPictureObjectId(state, picture_object_id) {
        state.picture_object_id = picture_object_id
    },
    setListReloadNeeded(state) {
        state.list_reload_needed += 1; // Просто инициируем изменение значения
    },
    // Фильтры списков
    setListFilters(state, list_filters) {
        state.list_filters = list_filters
        if (state.list_filters.date) {
            // Правильный формат фильтра
            state.list_filters[state.list_filters.date_sign] = state.list_filters.date.substring(0, 10);
            // Очищем параметры по умолчанию
            delete state.list_filters.date;
        }
        delete state.list_filters.date_sign; // Чтобы не искажалась строка фильтров
        // Тип элемента конструкции передается в фильтр
        if (state.sub_type_key) state.list_filters.part_type = state.sub_type_key;
        // Список состояний преобразуем в текст
        if (state.list_filters.states) state.list_filters.states = state.list_filters.states.join(',');

    },
    setListSubFilter(state, payload) {
        // Установка значения вспомогательного фильтра
        state.list_sub_filters[payload.name] = payload.value;
    },
    setPrevious(state, previous) {
        state.previous = previous
    },
}
