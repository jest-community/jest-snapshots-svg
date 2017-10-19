import { ViewStyle } from "react-native"
import * as yoga from "yoga-layout"

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

  const svgText: string = node.textContent
    ? text(left, top, width, height, style, node.textContent)
    : view(layout as yoga.Layout, style)

  return "\n"
          + wsp(indent)
          + svgText
}

const text = (x, y, w, h, style, textContent) => {
  const extensions = "requiredExtensions='http://www.w3.org/1999/xhtml'"
  const fontSize = style && style.fontSize || 14
  const fontFamily = (style && `"${style.fontFamily}",`) || ""
  const textStyle = `style="font-family:${fontFamily}"Times New Roman";font-size:${fontSize}px"`
  return `<foreignObject ${extensions} x="${x}" y="${y}" width="${w}" height="${h}">`
       + `<body xmlns="http://www.w3.org/1999/xhtml" style="margin:0;"><p ${textStyle}>${textContent}</p>`
       + "</body></foreignObject>"
}

export default nodeToSVG
