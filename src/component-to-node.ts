import * as yoga from "yoga-layout"
import extractText from "./extract-text"
import { flattenStyles } from "./flatten-styles"
import { Component, Settings } from "./index"
import { breakLines, measureLines } from "./text-layout"

export const textLines = Symbol("textLines")

const isNotEmpty = prop => typeof prop !== "undefined" && prop !== null

const componentToNode = (component: Component, settings: Settings): yoga.NodeInstance => {
  // Do we need to pass in the parent node too?
  const node = yoga.Node.create()
  const hasStyle = component.props && component.props.style
  const style = hasStyle ? styleFromComponent(component) : {}

  if (hasStyle) {
    // http://facebook.github.io/react-native/releases/0.44/docs/layout-props.html

    if (isNotEmpty(style.width)) { node.setWidth(style.width) }
    if (isNotEmpty(style.height)) { node.setHeight(style.height) }

    if (isNotEmpty(style.minHeight)) { node.setMinHeight(style.minHeight) }
    if (isNotEmpty(style.minWidth)) { node.setMinWidth(style.minWidth) }

    if (isNotEmpty(style.maxHeight)) { node.setMaxHeight(style.maxHeight) }
    if (isNotEmpty(style.maxWidth)) { node.setMaxWidth(style.maxWidth) }

    if (isNotEmpty(style.margin)) { node.setMargin(yoga.EDGE_ALL, style.margin) }
    if (isNotEmpty(style.marginTop)) { node.setMargin(yoga.EDGE_TOP, style.marginTop) }
    if (isNotEmpty(style.marginBottom)) { node.setMargin(yoga.EDGE_BOTTOM, style.marginBottom) }
    if (isNotEmpty(style.marginLeft)) { node.setMargin(yoga.EDGE_LEFT, style.marginLeft) }
    if (isNotEmpty(style.marginRight)) { node.setMargin(yoga.EDGE_RIGHT, style.marginRight) }
    if (isNotEmpty(style.marginVertical)) { node.setMargin(yoga.EDGE_VERTICAL, style.marginVertical) }
    if (isNotEmpty(style.marginHorizontal)) { node.setMargin(yoga.EDGE_HORIZONTAL, style.marginHorizontal) }

    if (isNotEmpty(style.padding)) { node.setPadding(yoga.EDGE_ALL, style.padding) }
    if (isNotEmpty(style.paddingTop)) { node.setPadding(yoga.EDGE_TOP, style.paddingTop) }
    if (isNotEmpty(style.paddingBottom)) { node.setPadding(yoga.EDGE_BOTTOM, style.paddingBottom) }
    if (isNotEmpty(style.paddingLeft)) { node.setPadding(yoga.EDGE_LEFT, style.paddingLeft) }
    if (isNotEmpty(style.paddingRight)) { node.setPadding(yoga.EDGE_RIGHT, style.paddingRight) }
    if (isNotEmpty(style.paddingVertical)) { node.setPadding(yoga.EDGE_VERTICAL, style.paddingVertical) }
    if (isNotEmpty(style.paddingHorizontal)) { node.setPadding(yoga.EDGE_HORIZONTAL, style.paddingHorizontal) }

    if (isNotEmpty(style.borderWidth)) { node.setBorder(yoga.EDGE_ALL, style.borderWidth) }
    if (isNotEmpty(style.borderTopWidth)) { node.setBorder(yoga.EDGE_TOP, style.borderTopWidth) }
    if (isNotEmpty(style.borderBottomWidth)) { node.setBorder(yoga.EDGE_BOTTOM, style.borderBottomWidth) }
    if (isNotEmpty(style.borderLeftWidth)) { node.setBorder(yoga.EDGE_LEFT, style.borderLeftWidth) }
    if (isNotEmpty(style.borderRightWidth)) { node.setBorder(yoga.EDGE_RIGHT, style.borderRightWidth) }

    if (isNotEmpty(style.flex)) { node.setFlex(style.flex) }
    if (isNotEmpty(style.flexGrow)) { node.setFlexGrow(style.flexGrow) }
    if (isNotEmpty(style.flexShrink)) { node.setFlexShrink(style.flexShrink) }
    if (isNotEmpty(style.flexBasis)) { node.setFlexBasis(style.flexBasis) }

    if (style.position === "absolute") {
      node.setPositionType(yoga.POSITION_TYPE_ABSOLUTE)
    }
    if (isNotEmpty(style.top)) { node.setPosition(yoga.EDGE_TOP, style.top) }
    if (isNotEmpty(style.left)) { node.setPosition(yoga.EDGE_LEFT, style.left) }
    if (isNotEmpty(style.right)) { node.setPosition(yoga.EDGE_RIGHT, style.right) }
    if (isNotEmpty(style.bottom)) { node.setPosition(yoga.EDGE_BOTTOM, style.bottom) }

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

    // TODO: De-dupe with above
    const alignSelf = style.alignSelf
    if (alignSelf) {
      if (alignSelf === "flex-start") { node.setAlignSelf(yoga.ALIGN_FLEX_END) }
      if (alignSelf === "flex-end") { node.setAlignSelf(yoga.ALIGN_FLEX_END) }
      if (alignSelf === "center") { node.setAlignSelf(yoga.ALIGN_CENTER) }
      if (alignSelf === "stretch") { node.setAlignSelf(yoga.ALIGN_STRETCH) }
      if (alignSelf === "baseline") { node.setAlignSelf(yoga.ALIGN_BASELINE) }
    }
  }

  // We're in a node showing Text
  if (component && component.type === "Text") {
    const styledText = extractText(component)
    component[textLines] = null
    node.setMeasureFunc(width => {
      const lines = breakLines(styledText, width)
      component[textLines] = lines
      return measureLines(lines)
    })
  }

  return node
}

export const styleFromComponent = (component: Component) => {
  let style = component.props.style

  if (Array.isArray(style)) {
    style = flattenStyles(style)
  }

  return style
}

export default componentToNode
