import * as yoga from "yoga-layout"
import { Settings } from "./index"
import nodeToSVG from "./node-to-svg"
import wsp from "./whitespace"

export const recurseTree =
  (indent: number, root: yoga.NodeInstance, parent: yoga.NodeInstance | null, settings: Settings) => {

    const nodeString = nodeToSVG(indent, root, settings)

    const childrenCount = root.getChildCount()
    if (!childrenCount) { return nodeString }

    return nodeString + groupWrap(root, indent, () => {
      let childGroups = ""
      for (let index = 0; index < childrenCount; index++) {
        const child = root.getChild(index)
        childGroups += "  " + recurseTree(indent + 1, child, root, settings)
      }

      return childGroups
    })
  }

export const svgWrapper = (bodyText: string, settings: Settings) =>
  `<?xml version="1.0" encoding="UTF-8" ?>
<svg width="${settings.width}" height="${settings.height}" xmlns="http://www.w3.org/2000/svg" version="1.1">
${bodyText}
</svg>
`

export const groupWrap = (node: yoga.NodeInstance, indent: number, recurse: () => string) => `

${wsp(indent)}<g transform='translate(${node.getComputedLeft()}, ${node.getComputedTop()})'>${recurse()}
${wsp(indent)}</g>
`

const treeToSVG = (root: yoga.NodeInstance, settings: Settings) => {
  root.calculateLayout(settings.width, settings.height, yoga.DIRECTION_LTR)
  return svgWrapper(recurseTree(0, root, null, settings), settings)
}

export default treeToSVG
