import {ViewStyle} from "react-native"
import * as yoga from "yoga-layout"

import { RenderedComponent, Settings } from "./index"
import wsp from "./whitespace"

const nodeToSVG = (indent: number, node: RenderedComponent, settings: Settings) => {
  const layout = node.layout
  const attributes: any = {
    "fill-opacity": "0.05",
    "stroke-width": "1",
    "stroke": "black"
  }

  if (node && node.props && node.props.style) {
    const style = node.props.style
    if (style.backgroundColor) {
      attributes.fill = style.backgroundColor
      attributes["fill-opacity"] = 1
    }

    if (style.color && !style.backgroundColor) {
      attributes.stroke = style.color
    }

    if (style.borderColor) {
      attributes.stroke = style.borderColor
    }
  }

  return "\n" + wsp(indent) + svgRect(layout.left, layout.top, layout.width, layout.height, attributes)
}

const svgRect = (x, y, w, h, settings) => {
  let attributes = ""
  for (const key in settings) {
    if (settings.hasOwnProperty(key)) {
      const element = settings[key]
      attributes += ` ${key}="${element}"`
    }
  }
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}"${attributes}/>`
}

export default nodeToSVG
