import * as yoga from "yoga-layout"

import componentToNode from "./component-to-node"
import { Component, Settings } from "./index"

const treeToNodes = (root: Component, settings: Settings) => recurseTree(root, settings)

export default treeToNodes

export const recurseTree = (component: Component, settings: Settings) => {
  const node = componentToNode(component, settings)

  if (component.children) {
    for (let index = 0; index < component.children.length; index++) {
      const childComponent = component.children[index]
      const childNode = recurseTree(childComponent, settings)
      node.insertChild(childNode, index)
    }
  }

  return node
}
