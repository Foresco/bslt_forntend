<template>
  <div>
    <TextBox
      style="width: 100%"
      iconCls="icon-search"
      placeholder="Поиск группы в дереве..."
      @valueChange="$refs.tree.doFilter($event.currentValue)"
    ></TextBox>

    <Tree
      ref="tree"
      :data="classification_tree_data"
      @nodeExpand="onNodeExpand($event)"
      @nodeClick="onNodeClick($event)"
    ></Tree>
  </div>
</template>

<script>
import { getData } from "@/api/api";

export default {
  name: "ClassificationTree",
  data() {
    return {
      classification_tree_data: [], // Данные для дерева классификационных групп
    };
  },
  created() {
    this.getClassificationTreeNodes(); // Получение первоначального наполнения
  },
  methods: {
    onNodeExpand(event) {
      this.getClassificationTreeNodes(event);
    },
    async getClassificationTreeNodes(node) {
      const parsNodes = function (nodes) {
        let tree_nodes = [];
        for (let i = 0; i < nodes.length; i++) {
          let tnode = { id: nodes[i].pk, text: nodes[i].code };
          if (nodes[i].has_children) tnode.state = "closed";
          tnode.iconCls = "icon-blank";
          tree_nodes.push(tnode);
        }
        return tree_nodes;
      };

      if (!node) {
        let vls = {root: true}; // По умолчанию Будут извлечены все корневые группы
        const root_id = this.$store.getters.getRootClassificationId;  // Запрашиваем корневу группу из свойств дашборда
        if (root_id) // Если в свойствах дашборда указана корневая группа дерева
        {
          vls = {id: root_id};  // Будет запрошена указанная в свойствах дашборда группа
        }
        const nodes = await getData(this, "classificationtree/", vls);
        this.classification_tree_data = parsNodes(nodes);
      } else {
        const nodes = await getData(this, "classificationtree/", {
          group: node.id,
        });
        this.$set(node, "children", parsNodes(nodes));
      }
    },
    onNodeClick: function (event) {
      // Обработка клика по ветке в дереве классификационных групп
      this.$store.commit("setGroupId", event.id);
      this.$store.commit("setListReloadNeeded"); // Перезагрузка списка
    },
  },
};
</script>
