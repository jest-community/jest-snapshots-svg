import {ViewStyle} from "react-native"
import * as yoga from "yoga-layout"
import { textLines } from "./component-to-node"
import textToSvg from "./text-to-svg"

import { RenderedComponent, Settings } from "./index"
import wsp from "./whitespace"

const nodeToSVG = (indent: number, node: RenderedComponent, settings: Settings) => {
  const layout = node.layout
  const attributes: any = {
    "type": node.type,
    "fill-opacity": "0.1",
    "stroke-width": "1",
    "stroke": "black"
  }

  if (node && node.props && node.props.style) {
    const style = node.props.style
    if (style.backgroundColor) {
      attributes.fill = style.backgroundColor
      attributes["fill-opacity"] = 1
    }
  }

  const svgText = node[textLines]
    ? textToSvg(layout.left, layout.top, layout.width, layout.height, node[textLines])
    : svg("rect", layout.left, layout.top, layout.width, layout.height, attributes)

  return "\n"
          + wsp(indent)
          + svgText
}

// This might be a reduce function?
const attributes = (settings) => {
  let attributeString = ""
  for (const key in settings) {
    if (settings.hasOwnProperty(key)) {
      const element = settings[key]
      attributeString += ` ${key}="${element}"`
    }
  }
  return attributeString
}

const svg = (type, x, y, w, h, settings) =>
  `<${type}${attributes(settings)} x="${x}" y="${y}" width="${w}" height="${h}"/>`

export default nodeToSVG
