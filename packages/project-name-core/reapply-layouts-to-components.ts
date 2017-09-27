import * as yoga from "yoga-layout"

import { Component, RenderedComponent } from "./index"

const renderedComponentTree = (root: Component, node: yoga.NodeInstance) => recurseTree(root, node)

export default renderedComponentTree

export const recurseTree = (component: Component, node: yoga.NodeInstance) => {

  const newChildren = [] as RenderedComponent[]
  let textContent: string | undefined

  if (component.children) {
    for (let index = 0; index < component.children.length; index++) {
      const childComponent = component.children[index]
      const childNode = node.getChild(index)
      // Don't go into Text nodes
      if (typeof childComponent === "string" || typeof childComponent === "number") {
        textContent = childComponent
      } else {
        const renderedChildComponent = recurseTree(childComponent, childNode)
        newChildren.push(renderedChildComponent)
      }
    }
  }

  return {
    type: component.type,
    props: component.props,
    children: newChildren,
    textContent,
    layout : {
      left: node.getComputedLeft(),
      right: node.getComputedRight(),
      top: node.getComputedTop(),
      bottom: node.getComputedBottom(),
      width: node.getComputedWidth(),
      height: node.getComputedHeight()
    }
  } as RenderedComponent
}
