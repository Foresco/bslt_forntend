export default {
    getHostUrl: state => state.hostUrl,
    getBackendUrl: state => state.hostUrl + '/rest',
    getRootId: state => state.root_id,
    getUserProfileId: state => state.userprofile_id,
    getTypeKey: state => state.type_key,
    getSubTypeKey: state => state.sub_type_key || state.type_key, // В случае, если не указан
    getSelectedId: state => state.selected_id,
    getSubSelectedId: state => state.sub_selected_id,
    getOrderId: state => state.order_id,
    getLinkId: state => state.link_id,
    getRootClassificationId: state => state.root_classification_id,
    getRouteId: state => state.route_id,
    getRoutePointId: state => state.routepoint_id,
    getPlaceId: state => state.place_id,
    getOperationId: state => state.operation_id,

    // Данные о сообщении пользователю
    getMessageText: state => state.msg_text,
    getMessageIcon: state => state.msg_icon,
    // Данные об ответе сервера
    getResponseData: state => state.response_data,
    // Статус
    getStatus: state => state.status,
    // Фильтры
    getFilterParams: state => {
        // получение установленных фильтров (включая дополнительные) в виде набора праметров для запроса к серверу
        return Object.assign({}, state.list_filters, state.list_sub_filters);
    },
    // Предыдущее значение
    getPrevious: state => state.previous,
}