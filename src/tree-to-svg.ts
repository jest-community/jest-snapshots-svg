import * as yoga from "yoga-layout"
import { Settings } from "./index"
import nodeToSVG from "./node-to-svg"

export const recurseTree =
  (indent: number, root: yoga.NodeInstance, parent: yoga.NodeInstance | null, settings: Settings) => {

  let nodeString = nodeToSVG(root, parent, settings)
  for (let index = 0; index < root.getChildCount(); index++) {
    const child = root.getChild(index)
    nodeString += "  " + recurseTree(indent + 1, child, root, settings)
  }
  return nodeString
}

export const svgWrapper = (bodyText: string, settings: Settings) =>
`<?xml version="1.0" encoding="UTF-8" ?>
<svg width="${settings.width}" height="${settings.height}" xmlns="http://www.w3.org/2000/svg" version="1.1">
  ${bodyText}
</svg>
`

const treeToSVG = (root: yoga.NodeInstance, settings: Settings) =>
  svgWrapper( recurseTree(0, root, null, settings), settings)

export default treeToSVG
