import {ViewStyle} from "react-native"
import * as yoga from "yoga-layout"

import { styleFromComponent } from "./component-to-node"
import { RenderedComponent, Settings } from "./index"
import wsp from "./whitespace"

enum Side {
    All,
    Vertical,
    Horizontal,
    Top,
    Right,
    Bottom,
    Left
}

// Done in CSS order
type Sides<T> = [T, T, T, T]

const applySides = <T>(sides: Sides<T>, value: T | null | undefined, side: Side): Sides<T> => {
  if (value == null) return sides
  const [top, right, bottom, left] = sides
  switch (side) {
    case Side.All: return [value, value, value, value]
    case Side.Vertical: return [value, right, value, left]
    case Side.Horizontal: return [top, value, bottom, value]
    case Side.Top: return [value, right, bottom, left]
    case Side.Right: return [top, value, bottom, left]
    case Side.Bottom: return [top, right, value, left]
    case Side.Left: return [top, right, bottom, value]
  }
}

const getBorderWidth = (style: any): Sides<number> => {
  let sides: Sides<number> = [0, 0, 0, 0]
  sides = applySides(sides, style.borderWidth, Side.All)
  sides = applySides(sides, style.borderTopWidth, Side.Top)
  sides = applySides(sides, style.borderRightWidth, Side.Right)
  sides = applySides(sides, style.borderBottomWidth, Side.Bottom)
  sides = applySides(sides, style.borderLeftWidth, Side.Left)
  return sides
}

const getBorderStyle = (style: any): Sides<string> => {
  let sides: Sides<string> = ["solid", "solid", "solid", "solid"]
  sides = applySides(sides, style.borderStyle, Side.All)
  return sides
}

const getBorderColor = (style: any): Sides<string> => {
  let sides: Sides<string> = ["black", "black", "black", "black"]
  sides = applySides(sides, style.borderWidth, Side.All)
  sides = applySides(sides, style.borderTopWidth, Side.Top)
  sides = applySides(sides, style.borderRightWidth, Side.Right)
  sides = applySides(sides, style.borderBottomWidth, Side.Bottom)
  sides = applySides(sides, style.borderLeftWidth, Side.Left)
  return sides
}

const getBorderRadius = (style: any): Sides<number> => {
  let sides: Sides<number> = [0, 0, 0, 0]
  // Close enough. We get the right result.
  sides = applySides(sides, style.borderRadius, Side.All)
  sides = applySides(sides, style.borderTopLeftRadius, Side.Top)
  sides = applySides(sides, style.borderTopRightRadius, Side.Right)
  sides = applySides(sides, style.borderBottomRightRadius, Side.Bottom)
  sides = applySides(sides, style.borderBottomLeftRadius, Side.Left)
  return sides
}

const sidesEqual = <T>(sides: Sides<T>): boolean =>
  sides[0] === sides[1] &&
  sides[0] === sides[2] &&
  sides[0] === sides[3]

const scaleSides = (sides: Sides<number>, scale: number): Sides<number> =>
  [sides[0] * scale, sides[1] * scale, sides[2] * scale, sides[3] * scale]

const nodeToSVG = (indent: number, node: RenderedComponent, settings: Settings) => {
  const attributes: any = {
    type: node.type,
  }

  const { layout, props } = node
  const style = styleFromComponent(node) || {}
  const { top, left, width, height } = layout

  const borderWidths = getBorderWidth(style)
  const borderColors = getBorderColor(style)
  const borderRadii = getBorderRadius(style)

  // TODO: Scale. I'll work this out later.
  // const borderScale = Math.max(
  //   (borderRadii[1] + borderRadii[3]) / layout.width,
  //   (borderRadii[0] + borderRadii[2]) / layout.height
  // )
  // borderRadii = scaleSides(borderRadii, borderScale)

  // TODO: Enable this
  // if (!style.backgroundColor && sidesEqual(borderWidths) && borderWidths[0] === 0) {
  //   return ''
  // }

  const borderStyle: string = node.props.borderStyle || "solid"

  let svgText: string
  if (node.textContent) {
    svgText = text(left, top, width, height, style, node.textContent)
  } else if (
    sidesEqual(borderWidths) &&
    sidesEqual(borderColors) &&
    sidesEqual(borderRadii) &&
    borderStyle === "solid"
  ) {
    const borderWidth = borderWidths[0]
    const borderRadius = borderRadii[0]
    attributes.fill = style.backgroundColor || "none"
    if (borderWidth !== 0) {
      attributes.stroke = borderColors[0]
      attributes["stroke-width"] = borderWidth
    }
    if (borderRadius !== 0) {
      attributes.rx = borderRadii[0]
      attributes.ry = borderRadii[0]
    }
    // Offset size by half border radius, as RN draws border inside, whereas SVG draws on both sides
    svgText = svg(
      "rect",
      left - borderWidth * 0.5,
      top - borderWidth * 0.5,
      width - borderWidth,
      height - borderWidth,
      attributes
    )
  } else {
    throw new Error("Not yet handled (WIP)")
  }

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
