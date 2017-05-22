import * as yoga from "yoga-layout"
import { Component, Settings } from "./index"

const componentToNode = (component: Component, settings: Settings) => {
  // Do we need to pass in the parent node too?
  const node = yoga.Node.create()
  if (component.props && component.props.style) {
    let style = component.props.style

    if (component.props.style instanceof Array) {
      style = Object.assign({}, ...component.props.style)
    }

    // http://facebook.github.io/react-native/releases/0.44/docs/layout-props.html

    if (style.width) { node.setWidth(style.width) }
    if (style.height) { node.setHeight(style.height) }

    // Potentially temporary, but should at least provide some layout stubbing
    // See https://github.com/orta/jest-snapshots-svg/issues/11 for a bit more context
    //
    if (!style.height && style.fontSize) { node.setHeight(style.fontSize * 2) }

    if (style.marginTop) { node.setMargin(yoga.EDGE_TOP, style.marginTop) }
    if (style.marginBottom) { node.setMargin(yoga.EDGE_BOTTOM, style.marginBottom) }
    if (style.marginLeft) { node.setMargin(yoga.EDGE_LEFT, style.marginLeft) }
    if (style.marginRight) { node.setMargin(yoga.EDGE_RIGHT, style.marginRight) }

    if (style.paddingTop) { node.setPadding(yoga.EDGE_TOP, style.paddingTop) }
    if (style.paddingBottom) { node.setPadding(yoga.EDGE_BOTTOM, style.paddingBottom) }
    if (style.paddingLeft) { node.setPadding(yoga.EDGE_LEFT, style.paddingLeft) }
    if (style.paddingRight) { node.setPadding(yoga.EDGE_RIGHT, style.paddingRight) }

    if (style.flex) { node.setFlex(style.flex) }

    const flexDirection = style.flexDirection
    if (flexDirection) {
      if (flexDirection === "row") { node.setFlexDirection(yoga.FLEX_DIRECTION_ROW) }
      if (flexDirection === "column") { node.setFlexDirection(yoga.FLEX_DIRECTION_COLUMN) }
      if (flexDirection === "row-reverse") { node.setFlexDirection(yoga.FLEX_DIRECTION_ROW_REVERSE) }
      if (flexDirection === "column-reverse") { node.setFlexDirection(yoga.FLEX_DIRECTION_COLUMN_REVERSE) }
    }

    const justifyContent = style.justifyContent
    if (justifyContent) {
      if (justifyContent === "flex-start") { node.setJustifyContent(yoga.JUSTIFY_FLEX_START) }
      if (justifyContent === "flex-end") { node.setJustifyContent(yoga.JUSTIFY_FLEX_END) }
      if (justifyContent === "center") { node.setJustifyContent(yoga.JUSTIFY_CENTER) }
      if (justifyContent === "space-between") { node.setJustifyContent(yoga.JUSTIFY_SPACE_BETWEEN) }
      if (justifyContent === "space-around") { node.setJustifyContent(yoga.JUSTIFY_SPACE_AROUND) }
    }

    const alignItems = style.alignItems
    if (alignItems) {
      if (alignItems === "flex-start") { node.setAlignItems(yoga.ALIGN_FLEX_END) }
      if (alignItems === "flex-end") { node.setAlignItems(yoga.ALIGN_FLEX_END) }
      if (alignItems === "center") { node.setAlignItems(yoga.ALIGN_CENTER) }
      if (alignItems === "stretch") { node.setAlignItems(yoga.ALIGN_STRETCH) }
      if (alignItems === "baseline") { node.setAlignItems(yoga.ALIGN_BASELINE) }
    }
  }

  return node
}

export default componentToNode
