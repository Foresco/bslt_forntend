<template>
  <div>
    <TextBox
      style="width:100%"
      iconCls="icon-search"
      placeholder="Поиск класса..."
      @valueChange="$refs.tree.doFilter($event.currentValue)"
    ></TextBox>

    <Tree
      :data="toolclass_tree_data"
      @nodeExpand="onNodeExpand($event)"
      @nodeClick="onNodeClick($event)"
    ></Tree>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      toolclass_id: 0, // Идентификатор класса
      toolclass_tree_data: [] // Данные для дерева классов
    };
  },
  created() {
    this.getToolClassTreeNodes(); // Получение первоначального наполнения
  },
  methods: {
    onNodeExpand: function(event) {
      this.getToolClassTreeNodes(event);
    },
    getToolClassTreeNodes: function(node) {
      const parsNodes = function(nodes) {
        let tree_nodes = [];
        for (let i = 0; i < nodes.length; i++) {
          let tnode = { id: nodes[i].pk, text: nodes[i].preferred_name };
          if (nodes[i].has_children) tnode.state = "closed";
          tnode.iconCls = "icon-blank";
          tree_nodes.push(tnode);
        }
        return tree_nodes;
      };

      if (!node) {
        axios
          .get("http://localhost:8000/rest/toolclasstree/?root=True")
          .then(
            response => (this.toolclass_tree_data = parsNodes(response.data))
          );
      } else {
        axios
          .get("http://localhost:8000/rest/toolclasstree/?parent=" + node.id)
          .then(response =>
            this.$set(node, "children", parsNodes(response.data))
          );
      }
    },
    onNodeClick: function(event) {
      // Обработка клика по ветке в дереве классов
      this.$store.commit('setToolClassId', event.id);
    }
  }
};
</script>
