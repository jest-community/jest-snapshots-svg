import * as path from "path"
import * as yoga from "yoga-layout"
import { getSvgFonts, getUsedFontKeys } from "./font-loader"
import { RenderedComponent, Settings } from "./index"
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

const svgFonts = (snapshotsDir?: string) => {
  if (!snapshotsDir) {
    return ""
  }

  const fonts = getSvgFonts()
  const used = getUsedFontKeys()
  const keys = Object.keys(fonts).filter((key) => used.includes(key))
  if (keys.length === 0) {
    return ""
  }

  let svgText = `  <defs>
    <style type="text/css">
    <![CDATA[
`
  keys.forEach((key) => {
    const font = fonts[key]

    svgText += `      @font-face {
        font-family: ${font.style.fontFamily};
        src: url(${path.relative(snapshotsDir, font.path)});\n`
    if (font.style.fontWeight) {
      svgText += `        font-weight: ${font.style.fontWeight};\n`
    }
    if (font.style.fontStyle) {
      svgText += `        font-style: ${font.style.fontStyle};\n`
    }
    svgText += `      }\n`
  })
  svgText += `    ]]>
    </style>
  </defs>
`
  return svgText
}

export const svgWrapper = (bodyText: string, settings: Settings, snapshotsDir?: string) =>
  `<?xml version="1.0" encoding="UTF-8" ?>
<svg width="${settings.width}" height="${settings.height}" xmlns="http://www.w3.org/2000/svg" version="1.1">
${svgFonts(snapshotsDir)}${bodyText}
</svg>
`

export const groupWrap = (node: RenderedComponent, indent: number, recurse: () => string) => `

${wsp(indent)}<g transform='translate(${node.layout.left}, ${node.layout.top})'>${recurse()}
${wsp(indent)}</g>
`

const treeToSVG = (root: RenderedComponent, settings: Settings, snapshotsDir?: string) => {
  return svgWrapper(recurseTree(0, root, settings), settings, snapshotsDir)
}

export default treeToSVG
