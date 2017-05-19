import * as yoga from "yoga-layout"
import { Component, Settings } from "./index"

const componentToNode = (component: Component, settings: Settings) => {
  // Do we need to pass in the parent node too?
  const node = yoga.Node.create()
  if (component.props && component.props.style) {
    let style = component.props.style

    // TODO: merge like RN stylesheets would
    if (component.props.style instanceof Array) {
      style = component.props.style.first
    }

    // http://facebook.github.io/react-native/releases/0.44/docs/layout-props.html

    if (style.width) { node.setWidth(style.width) }
    if (style.height) { node.setHeight(style.height) }

    if (style.marginTop) { node.setMargin(yoga.EDGE_TOP, style.marginTop) }
    if (style.marginBottom) { node.setMargin(yoga.EDGE_BOTTOM, style.marginBottom) }
    if (style.marginLeft) { node.setMargin(yoga.EDGE_LEFT, style.marginLeft) }
    if (style.marginRight) { node.setMargin(yoga.EDGE_RIGHT, style.marginRight) }

    if (style.paddingTop) { node.setPadding(yoga.EDGE_TOP, style.paddingTop) }
    if (style.paddingBottom) { node.setPadding(yoga.EDGE_BOTTOM, style.paddingBottom) }
    if (style.paddingLeft) { node.setPadding(yoga.EDGE_LEFT, style.paddingLeft) }
    if (style.paddingRight) { node.setPadding(yoga.EDGE_RIGHT, style.paddingRight) }

    if (style.flex) { node.setFlex(style.flex) }

    if (!style.flexDirection) { node.setFlexDirection(yoga.FLEX_DIRECTION_ROW) }
    if (style.flexDirection === "row") { node.setFlexDirection(yoga.FLEX_DIRECTION_ROW) }
    if (style.flexDirection === "column") { node.setFlexDirection(yoga.FLEX_DIRECTION_COLUMN) }
    if (style.flexDirection === "row-reverse") { node.setFlexDirection(yoga.FLEX_DIRECTION_ROW_REVERSE) }
    if (style.flexDirection === "column-reverse") { node.setFlexDirection(yoga.FLEX_DIRECTION_COLUMN_REVERSE) }

    // if (style.alignItems) {
    //   let alignment: yoga.Align = 0
    //   switch (style.alignItems) {
    //     case "center":
    //       alignment = yoga.ALIGN_CENTER
    //       break

    //     default:
    //       break
    //   }
    // }
  }

  return node
}

export default componentToNode
