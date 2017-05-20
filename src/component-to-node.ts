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

    if (style.flexDirection === "row") { node.setFlexDirection(yoga.FLEX_DIRECTION_ROW) }
    if (style.flexDirection === "column") { node.setFlexDirection(yoga.FLEX_DIRECTION_COLUMN) }
    if (style.flexDirection === "row-reverse") { node.setFlexDirection(yoga.FLEX_DIRECTION_ROW_REVERSE) }
    if (style.flexDirection === "column-reverse") { node.setFlexDirection(yoga.FLEX_DIRECTION_COLUMN_REVERSE) }

    if (style.justifyContent === "flex-start") { node.setJustifyContent(yoga.JUSTIFY_FLEX_START) }
    if (style.justifyContent === "flex-end") { node.setJustifyContent(yoga.JUSTIFY_FLEX_END) }
    if (style.justifyContent === "center") { node.setJustifyContent(yoga.JUSTIFY_CENTER) }
    if (style.justifyContent === "space-between") { node.setJustifyContent(yoga.JUSTIFY_SPACE_BETWEEN) }
    if (style.justifyContent === "space-around") { node.setJustifyContent(yoga.JUSTIFY_SPACE_AROUND) }

    if (style.alignItems === "flex-start") { node.setJustifyContent(yoga.ALIGN_FLEX_END) }
    if (style.alignItems === "flex-end") { node.setJustifyContent(yoga.ALIGN_FLEX_END) }
    if (style.alignItems === "center") { node.setJustifyContent(yoga.ALIGN_CENTER) }
    if (style.alignItems === "stretch") { node.setJustifyContent(yoga.ALIGN_STRETCH) }
    if (style.alignItems === "baseline") { node.setJustifyContent(yoga.ALIGN_BASELINE) }

    node.myID = Math.random() * 50
    console.log(` < (${node.myID})`, style)
  }

  return node
}

export default componentToNode
