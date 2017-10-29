import { ViewStyle } from "react-native"
import * as yoga from "yoga-layout"
import { textLines } from "./component-to-node"
import textToSvg from "./text-to-svg"

import { styleFromComponent } from "./component-to-node"
import { RenderedComponent, Settings } from "./index"
import view from "./svg/View"
import wsp from "./whitespace"

const nodeToSVG = (indent: number, node: RenderedComponent, settings: Settings) => {
  const { layout, props } = node
  const style = styleFromComponent(node) || {}
  const { top, left, width, height } = layout

  // TODO: Enable this
  // if (!style.backgroundColor && sidesEqual(borderWidths) && borderWidths[0] === 0) {
  //   return ""
  // }

  const svgText = node[textLines]
    ? textToSvg(layout.left, layout.top, layout.width, layout.height, node[textLines])
    : view(layout as yoga.Layout, style)

  return "\n"
          + wsp(indent)
          + svgText
}

export default nodeToSVG
