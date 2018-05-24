import Yoga, {Config, Node, NodeInstance, Value} from "yoga-dom"
import extractText from "./extract-text"
import { Component, Settings } from "./index"
import { breakLines, measureLines } from "./text-layout"

console.log(Yoga)
console.log(Config)

export const textLines = Symbol("textLines")

const isNotEmpty = prop => typeof prop !== "undefined" && prop !== null

// function propAlias(
//   target: any,
//   targetProp: string,
//   sourceProp: string
// ) {
//   Object.defineProperty(target, targetProp, {
//     configurable: true,
//     get() {
//       return this[sourceProp];
//     },
//     set(value: any) {
//       this[sourceProp] = value;
//     }
//   });
// }

// function convertToYogaValue(
//   input: (number | string) | undefined,
//   units: any
// ): Value {
//   if (typeof input === "number") {
//     return { value: input, unit: units.point };
//   } else if (input == null) {
//     // TODO: Figure out why this isn't unsetting the value in Yoga
//     // Found it: https://github.com/facebook/yoga/blob/5e3ffb39a2acb05d4fe93d04f5ae4058c047f6b1/yoga/Yoga.h#L28
//     // return { value: NaN, unit: units.undefined };
//     return { value: 0, unit: units.point };
//   }
//   if (input === "auto") {
//     return { value: NaN, unit: units.auto };
//   }
//   return {
//     value: parseFloat(input),
//     unit: input.endsWith("%") ? units.percent : units.point
//   };
// }

// function setEnumProp(
//   yogaNode: NodeInstance,
//   propName: string,
//   enumMap: any,
//   value: string | null
// ) {
//   if (value == null) {
//     yogaNode[propName] = NaN
//   } else {
//     const enumValue = enumMap[value]
//     if (enumValue != null) {
//       yogaNode[propName] = enumValue
//     } else if (process.env.DEBUG) {
//       console.warn(`No such value '${value}' found for prop '${propName}'`)
//     }
//   }
// }

// function bindEnumProps(
//   instance: any,
//   propDefs: any[]
// ) {
//   propDefs.forEach(([propName, enumMap]) => {
//     Object.defineProperty(instance, propName, {
//       configurable: true,
//       // tslint:disable-next-line:object-literal-shorthand
//       get: function() {
//         return this.yogaNode[propName]
//       },
//       // tslint:disable-next-line:object-literal-shorthand
//       set: function(value: string) {
//         setEnumProp(this.yogaNode, propName, enumMap, value)
//       }
//     })
//   })
// }

// function bindUnitProps(
//   instance: any,
//   propDefs: string[]
// ) {
//   propDefs.forEach((propName) => {
//     Object.defineProperty(instance, propName, {
//       configurable: true,
//       // tslint:disable-next-line:object-literal-shorthand
//       get: function() {
//         return this.yogaNode[propName]
//       },
//       // tslint:disable-next-line:object-literal-shorthand
//       set: function(value: string | number) {
//         this.yogaNode[propName] = convertToYogaValue(
//           value,
//           Yoga.Constants.unit
//         )
//       }
//     })
//   })
// }

// function bindNumberProps(
//   instance: any,
//   propDefs: string[]
// ) {
//   propDefs.forEach((propName) => {
//     Object.defineProperty(instance, propName, {
//       configurable: true,
//       // tslint:disable-next-line:object-literal-shorthand
//       get: function() {
//         return this.yogaNode[propName]
//       },
//       // tslint:disable-next-line:object-literal-shorthand
//       set: function(value: number | null) {
//         if (value == null) { value = NaN }
//         this.yogaNode[propName] = value
//       }
//     })
//   })
// }

// const EDGES = [
//   "Left",
//   "Right",
//   "Top",
//   "Bottom",
//   "Start",
//   "End",
//   "Horizontal",
//   "Vertical"
// ]

// function bindEdgeProps(
//   instance: any,
//   propDefs: string[],
//   bindingFunc: (
//     instance: any,
//     propDefs: string[]
//   ) => void
// ) {
//   propDefs.forEach((propName) => {
//     bindingFunc.call(
//       null,
//       instance,
//       EDGES.map((edge) => `${propName}${edge}`).concat([propName])
//     )
//   })
// }

const componentToNode = (component: Component, settings: Settings): NodeInstance => {
  // Do we need to pass in the parent node too?
  debugger
  const yogaConfig = new Config()
  const node = Node.createWithConfig(this.yogaConfig)

  const hasStyle = component.props && component.props.style
  const style = hasStyle ? styleFromComponent(component) : {}

  if (hasStyle) {
    // http://facebook.github.io/react-native/releases/0.44/docs/layout-props.html

    // See https://github.com/vincentriemer/react-native-dom/blob/88fe69fe9d8b9d62e0642e493877ce469cd7a608/packages/react-native-dom/ReactDom/views/RCTShadowView.js
    // for porting to yoga-dom

    const anyNode = node as any
    if (isNotEmpty(style.width)) { anyNode.width = (style.width) }
    if (isNotEmpty(style.height)) { anyNode.height = (style.height) }

    // if (isNotEmpty(style.minHeight)) { node.setMinHeight(style.minHeight) }
    // if (isNotEmpty(style.minWidth)) { node.setMinWidth(style.minWidth) }

    // if (isNotEmpty(style.maxHeight)) { node.setMaxHeight(style.maxHeight) }
    // if (isNotEmpty(style.maxWidth)) { node.setMaxWidth(style.maxWidth) }

    // if (isNotEmpty(style.margin)) { node.setMargin(yoga.EDGE_ALL, style.margin) }
    // if (isNotEmpty(style.marginTop)) { node.setMargin(yoga.EDGE_TOP, style.marginTop) }
    // if (isNotEmpty(style.marginBottom)) { node.setMargin(yoga.EDGE_BOTTOM, style.marginBottom) }
    // if (isNotEmpty(style.marginLeft)) { node.setMargin(yoga.EDGE_LEFT, style.marginLeft) }
    // if (isNotEmpty(style.marginRight)) { node.setMargin(yoga.EDGE_RIGHT, style.marginRight) }
    // if (isNotEmpty(style.marginVertical)) { node.setMargin(yoga.EDGE_VERTICAL, style.marginVertical) }
    // if (isNotEmpty(style.marginHorizontal)) { node.setMargin(yoga.EDGE_HORIZONTAL, style.marginHorizontal) }

  //   if (isNotEmpty(style.padding)) { node.setPadding(yoga.EDGE_ALL, style.padding) }
  //   if (isNotEmpty(style.paddingTop)) { node.setPadding(yoga.EDGE_TOP, style.paddingTop) }
  //   if (isNotEmpty(style.paddingBottom)) { node.setPadding(yoga.EDGE_BOTTOM, style.paddingBottom) }
  //   if (isNotEmpty(style.paddingLeft)) { node.setPadding(yoga.EDGE_LEFT, style.paddingLeft) }
  //   if (isNotEmpty(style.paddingRight)) { node.setPadding(yoga.EDGE_RIGHT, style.paddingRight) }
  //   if (isNotEmpty(style.paddingVertical)) { node.setPadding(yoga.EDGE_VERTICAL, style.paddingVertical) }
  //   if (isNotEmpty(style.paddingHorizontal)) { node.setPadding(yoga.EDGE_HORIZONTAL, style.paddingHorizontal) }

  //   if (isNotEmpty(style.borderWidth)) { node.setBorder(yoga.EDGE_ALL, style.borderWidth) }
  //   if (isNotEmpty(style.borderTopWidth)) { node.setBorder(yoga.EDGE_TOP, style.borderTopWidth) }
  //   if (isNotEmpty(style.borderBottomWidth)) { node.setBorder(yoga.EDGE_BOTTOM, style.borderBottomWidth) }
  //   if (isNotEmpty(style.borderLeftWidth)) { node.setBorder(yoga.EDGE_LEFT, style.borderLeftWidth) }
  //   if (isNotEmpty(style.borderRightWidth)) { node.setBorder(yoga.EDGE_RIGHT, style.borderRightWidth) }

  //   if (isNotEmpty(style.flex)) { node.setFlex(style.flex) }
  //   if (isNotEmpty(style.flexGrow)) { node.setFlexGrow(style.flexGrow) }
  //   if (isNotEmpty(style.flexShrink)) { node.setFlexShrink(style.flexShrink) }
  //   if (isNotEmpty(style.flexBasis)) { node.setFlexBasis(style.flexBasis) }

  //   if (style.position === "absolute") {
  //     node.setPositionType(yoga.POSITION_TYPE_ABSOLUTE)
  //   }
  //   if (isNotEmpty(style.top)) { node.setPosition(yoga.EDGE_TOP, style.top) }
  //   if (isNotEmpty(style.left)) { node.setPosition(yoga.EDGE_LEFT, style.left) }
  //   if (isNotEmpty(style.right)) { node.setPosition(yoga.EDGE_RIGHT, style.right) }
  //   if (isNotEmpty(style.bottom)) { node.setPosition(yoga.EDGE_BOTTOM, style.bottom) }

  //   const flexDirection = style.flexDirection
  //   if (flexDirection) {
  //     if (flexDirection === "row") { node.setFlexDirection(yoga.FLEX_DIRECTION_ROW) }
  //     if (flexDirection === "column") { node.setFlexDirection(yoga.FLEX_DIRECTION_COLUMN) }
  //     if (flexDirection === "row-reverse") { node.setFlexDirection(yoga.FLEX_DIRECTION_ROW_REVERSE) }
  //     if (flexDirection === "column-reverse") { node.setFlexDirection(yoga.FLEX_DIRECTION_COLUMN_REVERSE) }
  //   }

  //   const justifyContent = style.justifyContent
  //   if (justifyContent) {
  //     if (justifyContent === "flex-start") { node.setJustifyContent(yoga.JUSTIFY_FLEX_START) }
  //     if (justifyContent === "flex-end") { node.setJustifyContent(yoga.JUSTIFY_FLEX_END) }
  //     if (justifyContent === "center") { node.setJustifyContent(yoga.JUSTIFY_CENTER) }
  //     if (justifyContent === "space-between") { node.setJustifyContent(yoga.JUSTIFY_SPACE_BETWEEN) }
  //     if (justifyContent === "space-around") { node.setJustifyContent(yoga.JUSTIFY_SPACE_AROUND) }
  //   }

  //   const alignItems = style.alignItems
  //   if (alignItems) {
  //     if (alignItems === "flex-start") { node.setAlignItems(yoga.ALIGN_FLEX_END) }
  //     if (alignItems === "flex-end") { node.setAlignItems(yoga.ALIGN_FLEX_END) }
  //     if (alignItems === "center") { node.setAlignItems(yoga.ALIGN_CENTER) }
  //     if (alignItems === "stretch") { node.setAlignItems(yoga.ALIGN_STRETCH) }
  //     if (alignItems === "baseline") { node.setAlignItems(yoga.ALIGN_BASELINE) }
  //   }

  //   // TODO: De-dupe with above
  //   const alignSelf = style.alignSelf
  //   if (alignSelf) {
  //     if (alignSelf === "flex-start") { node.setAlignSelf(yoga.ALIGN_FLEX_END) }
  //     if (alignSelf === "flex-end") { node.setAlignSelf(yoga.ALIGN_FLEX_END) }
  //     if (alignSelf === "center") { node.setAlignSelf(yoga.ALIGN_CENTER) }
  //     if (alignSelf === "stretch") { node.setAlignSelf(yoga.ALIGN_STRETCH) }
  //     if (alignSelf === "baseline") { node.setAlignSelf(yoga.ALIGN_BASELINE) }
  //   }
  }

  // // We're in a node showing Text
  // if (component && component.type === "Text") {
  //   const styledText = extractText(component)
  //   component[textLines] = null
  //   node.setMeasureFunc(width => {
  //     const lines = breakLines(styledText, width)
  //     component[textLines] = lines
  //     return measureLines(lines)
  //   })
  // }

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
