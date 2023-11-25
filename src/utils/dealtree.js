export default {
  /**
   * 将list装换成tree
   * @param {Object} myId  数据主键id
   * @param {Object} pId     数据关联的父级id
   * @param {Object} list list集合
   */
  listToTree(myId, pId, list) {
    function exists(list, parentId) {
      for (var i = 0; i < list.length; i++) {
        if (list[i][myId] == parentId) return true;
      }
      return false;
    }

    var nodes = [];
    // get the top level nodes
    for (var i = 0; i < list.length; i++) {
      var row = list[i];
      if (!exists(list, row[pId])) {
        nodes.push(row);
      }
    }

    var toDo = [];
    for (var i = 0; i < nodes.length; i++) {
      toDo.push(nodes[i]);
    }
    while (toDo.length) {
      var node = toDo.shift(); // the parent node
      // get the children nodes
      for (var i = 0; i < list.length; i++) {
        var row = list[i];
        if (row[pId] == node[myId]) {
          //var child = {id:row.id,text:row.name};
          if (node.children) {
            node.children.push(row);
          } else {
            node.children = [row];
          }
          toDo.push(row);
        }
      }
    }
    return nodes;
  },

  /**
   * 树转list
   */
  treeToList(treeList) {
    let list = [];
    function handleTreeList(treeList, list) {
      if (!treeList || !treeList.length) {
        return;
      }
      for (let i = 0; i < treeList.length; i++) {
        let currentRow = treeList[i];
        let newRow = JSON.parse(JSON.stringify(currentRow));
        newRow.children = undefined;
        newRow.isfather = currentRow.children.length > 0;
        list.push(newRow);
        handleTreeList(currentRow.children, list);
      }
    }
    handleTreeList(treeList, list);
    return list;
  },
};
