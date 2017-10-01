import * as yoga from "yoga-layout"
import { RenderedComponent, Settings } from "project-name-core"
import nodeToSVG from "./node-to-svg"
import wsp from "./whitespace"

export const recurseTree =
  (indent: number, root: RenderedComponent, settings: Settings) => {

    const nodeString = nodeToSVG(indent, root, settings)

    const childrenCount = root.children.length
    if (!childrenCount) { return nodeString }

    return nodeString + groupWrap(root, indent, () => {
      let childGroups = ""

      for (let index = 0; index < childrenCount; index++) {
        const child = root.children[index]
        // Don't go into Text nodes
        if (!(typeof child === "string")) {
          childGroups += recurseTree(indent + 1, child, settings)
        }
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

export const groupWrap = (node: RenderedComponent, indent: number, recurse: () => string) => `

${wsp(indent)}<g transform='translate(${node.layout.left}, ${node.layout.top})'>${recurse()}
${wsp(indent)}</g>
`

const treeToSVG = (root: RenderedComponent, settings: Settings) => {
  return svgWrapper(recurseTree(0, root, settings), settings)
}

export default treeToSVG
