import * as yoga from "yoga-dom"

import componentToNode from "./component-to-node"
import { Component, Settings } from "./index"

const treeToNodes = (root: Component, settings: Settings) => recurseTree(root, settings)

export default treeToNodes

export const recurseTree = (component: Component, settings: Settings) => {
  const node = componentToNode(component, settings)

  if (component.type !== "Text" && component.children) {
    // Don't go into Text nodes
    for (let index = 0; index < component.children.length; index++) {
      const childComponent = component.children[index]
      if (typeof childComponent === "string") {
        throw new Error("Unexpected string child in non-Text node")
      }
      const childNode = recurseTree(childComponent, settings)
      node.insertChild(childNode, index)
    }
  }

  return node
}
