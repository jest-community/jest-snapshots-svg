import * as yoga from "yoga-layout"
import { Settings } from "./index"

const nodeToSVG = (node: yoga.NodeInstance, parent: yoga.NodeInstance | null, settings: Settings) => {
  // Do we need to pass in the parent node too?
  const outerWidth = parent ? parent.getComputedWidth() : settings.width
  const outerHeight = parent ? parent.getComputedWidth() : settings.height

  node.calculateLayout(outerWidth, outerHeight, yoga.DIRECTION_INHERIT)
  const layout = node.getComputedLayout()
  const attributes = {
    "fill-opacity": "0.1",
    "stroke-width": "1",
    "stroke": "black"
  }
  console.log(layout.toString())
  return svgRect(layout.left, layout.top, layout.width, layout.height, attributes)
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
