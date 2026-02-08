// Классы дерева работы с технологией

class classTpTreeBranc {
    // Общий класс для всех веток
    constructor(row_node) {
        this.pk = row_node.pk;
    }

    onClick(store) {
        store.commit("setOperationId", this.pk);
        return this;
    }

    getPk() {
        return this.pk;
    }

    getCls() {
        return this.iconCls;
    }

    getNode() {
        // Возвращает описание узла в виде набора свойств
        return {
            pk: this.pk,
            id: this.getId(),
            iconCls: this.iconCls,
            caption: this.caption,
            order_num: this.order_num,
            state: "closed",
            cl: this,
        }
    }
}

class classTpResource extends classTpTreeBranc {
    // Ветка типа Ресурс
    constructor(row_node) {
        super(row_node);
        this.caption = row_node.code;
        this.iconCls = "tpresource";
        this.order_num = "";
        this.child = row_node.child;
        this.child_class = classTpResource;
    }

    onClick(store) {
        store.commit("setSelectedId", this.child);
        return this;
    }

    getId() {
        return "rs." + this.pk;
    }

    getUrl() {
        // Адрес для запроса состава ветки
        return "tpresource/";
    }

    getUrlParams() {
        // Параметры для запроса состава ветки
        return { replaced: this.pk }
    }

}

class classOperation extends classTpTreeBranc {
    // Ветка типа Операция
    constructor(row_node) {
        super(row_node);
        this.caption = row_node.operation_name;
        this.iconCls = "operation";
        this.order_num = row_node.order_num;
        this.child_class = classTpResource;
    }

    getId() {
        return "o." + this.pk;
    }

    onClick(store) {
        store.commit("setOperationId", this.pk);
        store.commit("setTypeKey", "tprow");
        return this;
    }

    getUrl() {
        // Адрес для запроса состава ветки
        return "tpresource/";
    }

    getUrlParams() {
        // Параметры для запроса состава ветки
        return { parent: this.pk }
    }

    getCls() {
        // Здесь возвращается не класс
        return "tprow";
    }
}

class classRoutepoint extends classTpTreeBranc {
    // Ветка типа Элемент маршрута
    constructor(row_node) {
        super(row_node);
        this.caption = row_node.code;
        this.iconCls = "routepoint";
        this.order_num = row_node.order_num;
        this.child_class = classOperation;
    }
    getId() {
        return "rp." + this.pk;
    }

    onClick(store) {
        store.commit("setRoutePointId", this.pk);
        store.commit("setTypeKey", "routepoint");
        return this;
    }

    getUrl() {
        // Адрес для запроса состава ветки
        return "tprow/";
    }

    getUrlParams() {
        // Параметры для запроса состава ветки
        return { route_point: this.pk }
    }
}

class classRoute extends classTpTreeBranc {
    // Ветка типа маршрут
    constructor(row_node) {
        super(row_node);
        this.caption = row_node.route_name;
        this.iconCls = "route";
        this.order_num = "";
        this.child_class = classRoutepoint;
    }

    getId() {
        return "r." + this.pk;
    }

    onClick(store) {
        store.commit("setRouteId", this.pk);
        store.commit("setTypeKey", "route");
        return this;
    }

    getUrl() {
        // Адрес для запроса состава ветки
        return "routepoint/";
    }

    getUrlParams() {
        // Параметры для запроса состава ветки
        return { route: this.pk }
    }
}

function getParseRow(child_class) {
    const f = function (row_node) {
        const a = new child_class(row_node);
        return a.getNode();
    }
    return f;
}

export { classRoute, getParseRow };
