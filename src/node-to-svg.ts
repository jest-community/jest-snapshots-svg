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
  sides = applySides(sides, style.borderColor, Side.All)
  sides = applySides(sides, style.borderTopColor, Side.Top)
  sides = applySides(sides, style.borderRightColor, Side.Right)
  sides = applySides(sides, style.borderBottomColor, Side.Bottom)
  sides = applySides(sides, style.borderLeftColor, Side.Left)
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

type Corner = { rx: number, ry: number, x: number, y: number }

const cornerEllipseAtSide = (
  x: number,
  y: number,
  width: number,
  height: number,
  radii: Sides<number>,
  insets: Sides<number>,
  side: number,
): Corner => {
  const radius = radii[side]
  const insetBefore = insets[(side + 3) % 4]
  const insetAfter = insets[side]
  return {
    rx: Math.max(radius - (side % 2 === 0 ? insetBefore : insetAfter), 0),
    ry: Math.max(radius - (side % 2 === 0 ? insetAfter : insetBefore), 0),
    x: x + [0, 1, 1, 0][side] * width + [1, -1, -1, 1][side] * radius,
    y: y + [0, 0, 1, 1][side] * height + [1, 1, -1, -1][side] * radius,
  }
}

const to6Dp = x => Math.round(x * 1E6) / 1E6

const positionOnCorner = (angle: number, corner: Corner) => ({
  x: to6Dp(corner.x + corner.rx * Math.cos(angle)),
  y: to6Dp(corner.y + corner.ry * Math.sin(angle))
})

const drawSide = (
  x: number,
  y: number,
  width: number,
  height: number,
  radii: Sides<number>,
  insets: Sides<number>,
  side: number,
  startCompletion: number = 0.5,
  endCompletion: number = 0.5,
  anticlockwise: boolean = false,
) => {
  const baseAngle = (side + 3) * (Math.PI / 2)

  const startSide = anticlockwise ? (side + 1) % 4 : side
  const endSide = anticlockwise ? side : (side + 1) % 4
  const sweep = anticlockwise ? 0 : 1

  let path = ''
  if (startCompletion > 0) {
    const startCorner = cornerEllipseAtSide(x, y, width, height, radii, insets, startSide)
    const start = positionOnCorner(baseAngle, startCorner)
    path += `A${startCorner.rx},${startCorner.ry} 0 0,${sweep} ${start.x},${start.y}`
  }

  const endCorner = cornerEllipseAtSide(x, y, width, height, radii, insets, endSide)
  const mid = positionOnCorner(baseAngle, endCorner)
  path += `L${mid.x},${mid.y}`

  if (endCompletion > 0) {
    const endAngle = baseAngle + endCompletion * Math.PI / 2 * (anticlockwise ? -1 : 1)
    const end = positionOnCorner(endAngle, endCorner)
    path += `A${endCorner.rx},${endCorner.ry} 0 0,${sweep} ${end.x},${end.y}`
  }

  return path
}

const pathForRect = (x, y, width, height, radii, insets, anticlockwise: boolean = false) => {
  const startCorner = cornerEllipseAtSide(x, y, width, height, radii, insets, 0)
  const startAngle = anticlockwise ? Math.PI : (3 * Math.PI / 2)
  const start = positionOnCorner(startAngle, startCorner)
  const sides = [0, 1, 2, 3].map(side => (
    drawSide(x, y, width, height, radii, insets, side, 0, 1, anticlockwise)
  ))
  if (anticlockwise) sides.reverse()
  return `M${start.x},${start.y}` + sides.join('') + 'Z'
}

const nodeToSVG = (indent: number, node: RenderedComponent, settings: Settings) => {
  const attributes: any = {
    type: node.type,
  }

  const { layout, props } = node
  const style = styleFromComponent(node) || {}
  const { top, left, width, height } = layout

  const borderWidths = getBorderWidth(style)
  const borderColors = getBorderColor(style)
  let borderRadii = getBorderRadius(style)

  // TODO: Scale. I'll work this out later.
  const borderScale = Math.max(
    (borderRadii[0] + borderRadii[2]) / layout.width,
    (borderRadii[1] + borderRadii[3]) / layout.width,
    (borderRadii[0] + borderRadii[3]) / layout.height,
    (borderRadii[1] + borderRadii[2]) / layout.height,
    1
  )
  if (borderScale > 1) borderRadii = scaleSides(borderRadii, 1 / borderScale)

  // TODO: Enable this
  // if (!style.backgroundColor && sidesEqual(borderWidths) && borderWidths[0] === 0) {
  //   return ''
  // }

  const borderStyle: string = style.borderStyle || "solid"

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
      attributes.rx = borderRadii[0] - borderWidth * 0.5
      attributes.ry = borderRadii[0] - borderWidth * 0.5
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
  } else if (sidesEqual(borderWidths) && sidesEqual(borderColors) && borderStyle === "solid") {
    const borderWidth = borderWidths[0]
    attributes.fill = style.backgroundColor || "none"
    if (borderWidth !== 0) {
      attributes.stroke = borderColors[0]
      attributes["stroke-width"] = borderWidth
    }
    attributes.d =
      pathForRect(top, left, width, height, borderRadii, scaleSides(borderWidths, 0.5))
    svgText = svg2("path", attributes)
  } else if (sidesEqual(borderColors) && borderStyle === "solid") {
    // FIXME: This has bugs
    const attr1 = Object.assign({}, attributes)
    attr1.fill = style.backgroundColor || "none"
    attr1.d =
      pathForRect(top, left, width, height, borderRadii, [0, 0, 0, 0])

    const attr2 = Object.assign({}, attributes)
    attr2.fill = borderColors[0]
    attr2.d =
      pathForRect(top, left, width, height, borderRadii, [0, 0, 0, 0]) +
      pathForRect(top, left, width, height, borderRadii, borderWidths, true)

    svgText = svg2("path", attr1) + svg2("path", attr2)
  } else if (sidesEqual(borderWidths) && sidesEqual(borderColors)) {
    const borderWidth = borderWidths[0]

    const attr1 = Object.assign({}, attributes)
    attr1.fill = style.backgroundColor || "none"
    attr1.d =
      pathForRect(top, left, width, height, borderRadii, [0, 0, 0, 0])

    const attr2 = Object.assign({}, attributes)
    attr2.fill = "none"
    if (borderWidth !== 0) {
      attr2.stroke = borderColors[0]
      attr2["stroke-width"] = borderWidth
    }
    const dash = (borderStyle === "dashed" ? 5 : 1) * borderWidth
    attr2["stroke-dasharray"] = `${dash}, ${dash}`
    attr2.d =
      pathForRect(top, left, width, height, borderRadii, scaleSides(borderWidths, 0.5))

    svgText = svg2("path", attr1) + svg2("path", attr2)
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

const svg2 = (type, settings) => `<${type}${attributes(settings)}/>`

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
