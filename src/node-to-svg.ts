import * as yoga from "yoga-layout"
import { Settings } from "./index"
import wsp from "./whitespace"

const nodeToSVG = (indent: number, node: yoga.NodeInstance, settings: Settings) => {
  const layout = node.getComputedLayout()
  const attributes = {
    "fill-opacity": "0.1",
    "stroke-width": "1",
    "stroke": "black"
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
