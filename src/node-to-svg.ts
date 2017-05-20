import {ViewStyle} from "react-native"
import * as yoga from "yoga-layout"

import { Settings } from "./index"
import wsp from "./whitespace"

const nodeToSVG = (indent: number, node: yoga.NodeInstance, settings: Settings) => {
  const layout = node.getComputedLayout()
  const attributes: any = {
    "fill-opacity": "0.1",
    "stroke-width": "1",
    "stroke": "black"
  }

  const component = settings.styleMap.get(node)
  if (component && component.props && component.props.style) {
    const style = component.props.style
    console.log("> ", component.props.style)
    if (style.backgroundColor) {
      attributes.fill = style.backgroundColor
      attributes["fill-opacity"] = 1
    }
  } else {
    console.log(` > (${node.myID})`, component)
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
