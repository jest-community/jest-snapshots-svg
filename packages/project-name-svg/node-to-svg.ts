import * as yoga from "yoga-layout"
import { RenderedComponent, Settings } from "project-name-core"
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

  const svgText = node.textContent ?
    text(layout.left, layout.top, layout.width, layout.height, node.props.style, node.textContent)
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

const text = (x, y, w, h, style, textContent) => {
  const extensions = 'requiredExtensions="http://www.w3.org/1999/xhtml"'
  const fontSize = style && style.fontSize || 14
  const fontFamily = (style && `'${style.fontFamily}',`) || ""
  const textStyle = `style="font-family:${fontFamily}'Times New Roman';font-size:${fontSize}px"`
  return `<foreignObject ${extensions} x="${x}" y="${y}" width="${w}" height="${h}">`
       + `<body xmlns="http://www.w3.org/1999/xhtml" style="margin:0;"><p ${textStyle}>${textContent}</p>`
       + "</body></foreignObject>"
}

export default nodeToSVG
