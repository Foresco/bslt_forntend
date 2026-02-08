const getIconM = (row) => {
    return row.mater_state;
};

const getIconT = (row) => {
    return row.tool_state;
};

const getBGColour = (row) => {
    // Делаем фон ячейки зеленым
    if (row.ship_quantity >= row.quantity) return "greenbg";
};

const onRowSelect = (event, context) => {
    // Отработка клика по строке списка (таблицы)
    context.$store.commit("setSelectedId", event.child_id);
    context.$store.commit("setTypeKey", event.type_key);
    context.$store.commit("setLinkId", event.pk);
    context.$store.commit("setSubSelectedId", event.child_id);
    context.$store.commit("setPictureObjectId", event.child_id);
};

const onRowDblClick = (event, context) => {
    const host = context.$store.getters.getHostUrl;
    window.open(`${host}/${event.type_key}/${event.child_id}/`);
};

const getOperations = (operations, quantity) => {
    // Получение массива с оформленными операциями
    let pic_opers = [];
    if (operations) {
        for (let i = 0; i < operations.length; i++) {
            if (i > 9) continue; // Пока отображаем не более 10 операций
            let pic_oper = {
                id: operations[i].pk,
                name: `${operations[i].place_code}/${operations[i].operation_name}`, // Подсказка для операции
                prog_state: operations[i].prog_state,
            };
            if (operations[i].done_quantity < quantity) {
                // Сделано недостаточно
                if (operations[i].task_quantity > 0) {
                    // Есть задания
                    pic_oper["state"] = "state_ordered";
                } else {
                    // Заданий нет
                    pic_oper["state"] = "state_empty";
                }
            } else {
                // Сделано достаточно
                pic_oper["state"] = "state_yes";
            }
            pic_opers.push(pic_oper);
        }
    }
    return pic_opers;
};

export { getIconM, getIconT, getBGColour, onRowSelect, onRowDblClick, getOperations };
