import * as pixelWidth from "string-pixel-width"
import * as fontMap from "string-pixel-width/lib/widthsMap"
import * as yoga from "yoga-layout"
import extractText from "./extract-text"
import { Component, Settings } from "./index"
import { breakLines, measureLines } from "./text-layout"

export const textLines = Symbol("textLines")

const componentToNode = (component: Component, settings: Settings): yoga.NodeInstance => {
  // Do we need to pass in the parent node too?
  const node = yoga.Node.create()
  const hasStyle = component.props && component.props.style
  const style = hasStyle ? styleFromComponent(component) : {}

  if (hasStyle) {
    // http://facebook.github.io/react-native/releases/0.44/docs/layout-props.html

    if (style.width) { node.setWidth(style.width) }
    if (style.height) { node.setHeight(style.height) }

    if (style.minHeight) { node.setMinHeight(style.minHeight) }
    if (style.minWidth) { node.setMinWidth(style.minWidth) }

    if (style.maxHeight) { node.setMaxHeight(style.maxHeight) }
    if (style.maxWidth) { node.setMaxWidth(style.maxWidth) }

    if (style.marginTop) { node.setMargin(yoga.EDGE_TOP, style.marginTop) }
    if (style.marginBottom) { node.setMargin(yoga.EDGE_BOTTOM, style.marginBottom) }
    if (style.marginLeft) { node.setMargin(yoga.EDGE_LEFT, style.marginLeft) }
    if (style.marginRight) { node.setMargin(yoga.EDGE_RIGHT, style.marginRight) }
    if (style.marginVertical) { node.setMargin(yoga.EDGE_VERTICAL, style.marginVertical) }
    if (style.marginHorizontal) { node.setMargin(yoga.EDGE_HORIZONTAL, style.marginHorizontal) }

    if (style.paddingTop) { node.setPadding(yoga.EDGE_TOP, style.paddingTop) }
    if (style.paddingBottom) { node.setPadding(yoga.EDGE_BOTTOM, style.paddingBottom) }
    if (style.paddingLeft) { node.setPadding(yoga.EDGE_LEFT, style.paddingLeft) }
    if (style.paddingRight) { node.setPadding(yoga.EDGE_RIGHT, style.paddingRight) }
    if (style.paddingVertical) { node.setPadding(yoga.EDGE_VERTICAL, style.paddingVertical) }
    if (style.paddingHorizontal) { node.setPadding(yoga.EDGE_HORIZONTAL, style.paddingHorizontal) }

    if (style.flex) { node.setFlex(style.flex) }
    if (style.flexGrow) { node.setFlexGrow(style.flexGrow) }
    if (style.flexShrink) { node.setFlexShrink(style.flexShrink) }
    if (style.flexBasis) { node.setFlexBasis(style.flexBasis) }

    if (style.position === "absolute") {
      node.setPositionType(yoga.POSITION_TYPE_ABSOLUTE)
    }
    if (style.top) { node.setPosition(yoga.EDGE_TOP, style.top) }
    if (style.left) { node.setPosition(yoga.EDGE_LEFT, style.left) }
    if (style.right) { node.setPosition(yoga.EDGE_RIGHT, style.right) }
    if (style.bottom) { node.setPosition(yoga.EDGE_BOTTOM, style.bottom) }

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
      // The Stylesheet object allows some serious nesting of styles
      const flattened = Array.prototype.concat.apply([], style)
      const themeFlattened = Array.prototype.concat.apply([], flattened) as any[]
      const objectsOnly = themeFlattened.filter(f => f)
      style = Object.assign({}, ...objectsOnly)
    }

    return style
}

export default componentToNode
