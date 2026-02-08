import { mapState } from 'vuex';
import { getData } from '@/api/api';

export const common_list = {
    data() {
        return {
            list_data: [], // Данные для списка объектов
            total: 0,
            pageNumber: 1,
            pageSize: 25,
            loading: false,
            pagePosition: 'top',
        };
    },
    computed: mapState([
        // 'type_key',
        // 'sub_type_key',
        'classification_id',
        'filter_text',
    ]),
    mounted() {
        this.loadPage();
    },
    watch: {
        classification_id(newValue, oldValue) {
            this.pageNumber = 1;
            this.loadPage();
        },
        filter_text(newValue, oldValue) {
            this.pageNumber = 1;
            this.loadPage();
        },
    },
    methods: {
        onPageChange(event) {
            this.loadPage(event.pageNumber, event.pageSize);
        },
        parseRow(row_node) {
            // Метод, разбирающий ответ сервера для таблицы списка
            return row_node; // Вариант по умолчанию. Никакого парсинга
        },
        async loadPage(pageNumber = this.pageNumber, pageSize = this.pageSize) {
            this.loading = true;
            // Предварительно формируем параметры запроса
            let params = {
                limit: pageSize,
                offset: (pageNumber - 1) * pageSize,
            };
            if (this.filter_text != '') {
                params['search'] = this.filter_text;
            }
            if (this.classification_id) {
                params['group'] = this.classification_id;
            }

            const lines = await getData(this, this.getUrl(), params);
            this.total = lines.count;
            this.list_data = lines.results.map(this.parseRow);
            this.pageNumber = pageNumber;
            this.loading = false;
        },
        onRowSelect(event) {
            // Отработка клика по строке списка (таблицы)
            this.$store.commit('setSelectedId', event.pk);
        },
        onRowDblClick(event) {
            const host = this.$store.getters.getHostUrl;
            window.open(`${host}/${event.pk}/`);
        },
    },
};
