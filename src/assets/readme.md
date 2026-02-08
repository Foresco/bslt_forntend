# Доработки дефолтных стилей оформления
Семейство шрифта указывается в body vue.css
Отступы в строках форм убраны в vue.css
.form-field{
	margin-bottom: 0px;
}
Высота строк таблицы изменена на 20 в vue.css

Убрана автовысота строк в таблицах
Вернул!!!!
.datagrid-cell{
	text-align: left;
  --- height: auto;
	font-size: inherit;
}

В качестве источника используется палитра Голубая ель.

Точные правки размера шрифта выполняются в файле easyui.css
Скругления границ убраны в easyui.css
border-radius: 4px 4px 4px 4px; -> border-radius: 0 0 0 0;
Ширина подписей у радиокнопок увеличена с 80 в easyui.css
.textbox-label {width: 300px;
Отступ справа от радиокнопки добавлен в vue.css
.radiobutton {
  margin-right: 3px;
Отступ справа от радиокнопки добавлен в vue.css
.checkbox {
  margin-right: 3px;

Прозрачность панелей интерефейса
easyui.css
.panel-body {
  background-color: transparent;

.accordion {
  background: transparent;

Потемнее выделенные строки в таблицах 
.datagrid-row-selected {
  background: #D3D8E0;
}

Цвет фона строк дерева
easyui.css
.tree
  background-color: #fafafa;
}
Шрифт выделенной строки в дереве
.tree-node-selected {
  color: #658686;
}
Фон строки заголовка таблицы
.datagrid-header-row {
  height: 32px;
  background-color: #a7c8c8;
}
Цвет шрифта заголовка таблицы
.datagrid-header .datagrid-cell,
.datagrid-cell-group {
  color: #234444;
}
Маркеры столбцов в заголовке таблицы
.datagrid-header td {
  border-width: 0 3px 3px 0;
  border-style: solid;
  margin: 0;
  padding: 0;
}
Цвет фона строк таблиц
.datagrid-row {
  background-color: #fafafa;
}
Шрифт выделенной строки
.datagrid-row-selected {
  color: #658686;
}

Прозрачность панели табов
.tabs-header,
.tabs-tool {
  background-color: transparent;
}

Фон вкладок табов
.tabs-first, .tabs-last {
  background-color: #94c4d0;
}
.tabs li .tabs-inner,
.tabs li .tabs-inner:hover {

  background-color: #94c4d0;
}

Выделение актвной вкладки таба
.tabs li.tabs-selected .tabs-inner {
  background: #70a0ac;
  color: #043440;
  border-bottom: 2px solid #043440;
}

Заголовки областей слева и справа
.panel-header {
  background-color: #a7c8c8;
  color: #043440;
}

Заголовки свернутых областей слева и справа
.layout-expand {
  background-color: #a7c8c8;
}

Заголовок аккордеона неактивного
.accordion .accordion-header {
  background: #94c4d0;
  filter: none;
}

Заголовок аккордеона активного
.accordion .accordion-header-selected {
  background: #70a0ac;
}

Кнопки пагинации таблиц
.datagrid-toolbar,
.datagrid-pager {
  background: #70a0ac;
}

Активная страница списка
.l-btn-plain-selected,
.l-btn-plain-selected:hover {
  background: #4f6c87;
}

Строка формы фон
.f-row {
  background-color: transparent;
}

Элемент Label уменьшена ширина с 300 до 200
.textbox-label {
  width: 200px;
 
Высота отрывающегося списка ComboBox увеличена (для того, чтобы все состояния умещались)
.combo-panel{
	height: 230px;
}

# Стили кнопок
Описываются в файле assets/icon.css
Изображения для стилей добавляются в assets/icons
