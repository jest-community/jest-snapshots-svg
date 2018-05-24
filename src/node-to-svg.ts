import { ViewStyle } from "react-native"
import * as yoga from "yoga-layout"
import { textLines } from "./component-to-node"

import { styleFromComponent } from "./component-to-node"
import { RenderedComponent, Settings } from "./index"
import text from "./svg/Text"
import view from "./svg/View"
import viewWireframe from "./svg/ViewWireframe"
import wsp from "./whitespace"

const nodeToSVG = (indent: number, node: RenderedComponent, settings: Settings) => {
  const { layout, props } = node
  const style = styleFromComponent(node) || {}
  const { top, left, width, height } = layout

  // TODO: Enable this
  // if (!style.backgroundColor && sidesEqual(borderWidths) && borderWidths[0] === 0) {
  //   return ""
  // }

  let svgText = ""
  if (node[textLines] && node[textLines].length > 0) {
    svgText = text(layout.left, layout.top, layout.width, layout.height, node[textLines])
  } else if (!settings.wireframe) {
    svgText = view(layout as yoga.Layout, style)
  } else {
    svgText = viewWireframe(layout as yoga.Layout, style)
  }

  return "\n"
          + wsp(indent)
          + svgText
}

export default nodeToSVG
