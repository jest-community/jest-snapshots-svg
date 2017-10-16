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
  {
    startCompletion = 0.5,
    endCompletion = 0.5,
    anticlockwise = false,
    moveCommand = '',
  }: {
    startCompletion?: number,
    endCompletion?: number,
    moveCommand?: 'M' | 'L' | '',
    anticlockwise?: boolean,
  } = {}
) => {
  const baseAngle = (side + 3) * (Math.PI / 2)

  const startSide = anticlockwise ? (side + 1) % 4 : side
  const endSide = anticlockwise ? side : (side + 1) % 4
  const sweep = anticlockwise ? 0 : 1
  const completionFactor = Math.PI / 2 * (anticlockwise ? -1 : 1)

  let path = ''
  const startCorner = cornerEllipseAtSide(x, y, width, height, radii, insets, startSide)

  if (moveCommand !== '') {
    const moveAngle = baseAngle - startCompletion * completionFactor
    const move = positionOnCorner(moveAngle, startCorner)
    path += `${moveCommand}${move.x},${move.y}`
  }

  if (startCompletion > 0) {
    const start = positionOnCorner(baseAngle, startCorner)
    path += `A${startCorner.rx},${startCorner.ry} 0 0,${sweep} ${start.x},${start.y}`
  }

  const endCorner = cornerEllipseAtSide(x, y, width, height, radii, insets, endSide)
  const mid = positionOnCorner(baseAngle, endCorner)
  path += `L${mid.x},${mid.y}`

  if (endCompletion > 0) {
    const endAngle = baseAngle + endCompletion * completionFactor
    const end = positionOnCorner(endAngle, endCorner)
    path += `A${endCorner.rx},${endCorner.ry} 0 0,${sweep} ${end.x},${end.y}`
  }

  return path
}

const pathForRect = (x, y, width, height, radii, insets, anticlockwise: boolean = false) => {
  const sideIndices = [0, 1, 2, 3]
  if (anticlockwise) sideIndices.reverse()
  const sides = sideIndices.map((side, index) => (
    drawSide(x, y, width, height, radii, insets, side, {
      startCompletion: 0,
      endCompletion: 1,
      moveCommand: index === 0 ? 'M' : '',
      anticlockwise,
    })
  ))
  return sides.join('') + 'Z'
}

const filledPathForSide = (x, y, width, height, radii, insets, side) => (
  drawSide(x, y, width, height, radii, [0, 0, 0, 0], side, { moveCommand: 'M' }) +
  drawSide(x, y, width, height, radii, insets, side, { moveCommand: 'L', anticlockwise: true }) +
  'Z'
)

const strokedPathForSide = (x, y, width, height, radii, insets, side) => (
  drawSide(x, y, width, height, radii, scaleSides(insets, 0.5), side, { moveCommand: 'M' })
)

const dashStyles = {
  dotted: width => ({ 'stroke-linecap': 'round', 'stroke-dasharray': `0, ${width * 1.5}`}),
  dashed: width => ({ 'stroke-dasharray': `${width * 2}, ${width}`}),
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
  const fill = style.backgroundColor || 'none'

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
    // Offset size by half border radius, as RN draws border inside, whereas SVG draws on both sides
    svgText = $('rect', {
      ...attributes,
      x: left - borderWidth * 0.5,
      y: top - borderWidth * 0.5,
      width: width - borderWidth,
      height: height - borderWidth,
      fill,
      stroke: borderColors[0],
      "stroke-width": borderWidth,
      rx: borderRadii[0] - borderWidth * 0.5,
      ry: borderRadii[0] - borderWidth * 0.5,
    })
  } else if (sidesEqual(borderWidths) && sidesEqual(borderColors) && borderStyle === "solid") {
    const borderWidth = borderWidths[0]
    svgText = $("path", {
      ...attributes,
      fill,
      stroke: borderColors[0],
      "stroke-width": borderWidth,
      d: pathForRect(left, top, width, height, borderRadii, scaleSides(borderWidths, 0.5))
    })
  } else if (sidesEqual(borderColors) && borderStyle === "solid") {
    console.log(':D');
    const backgroundShape = $('path', {
      ...attributes,
      fill,
      d: pathForRect(left, top, width, height, borderRadii, scaleSides(borderWidths, 0.5))
    })
    const borderShape = $('path', {
      fill: borderColors[0],
      d: pathForRect(left, top, width, height, borderRadii, [0, 0, 0, 0]) +
        pathForRect(left, top, width, height, borderRadii, borderWidths, true)
    })
    svgText = backgroundShape + borderShape
  } else if (sidesEqual(borderWidths) && sidesEqual(borderColors)) {
    const borderWidth = borderWidths[0]
    const backgroundShape = $('path', {
      ...attributes,
      fill,
      d: pathForRect(left, top, width, height, borderRadii, [0, 0, 0, 0])
    })
    const borderShape = $('path', {
      ...dashStyles[borderStyle](borderWidth),
      fill: 'none',
      stroke: borderColors[0],
      "stroke-width": borderWidth,
      d: pathForRect(left, top, width, height, borderRadii, scaleSides(borderWidths, 0.5))
    })
    svgText = backgroundShape + borderShape
  } else if (borderStyle === 'solid') {
    const backgroundShape = $('path', {
      ...attributes,
      fill,
      d: pathForRect(left, top, width, height, borderRadii, scaleSides(borderWidths, 0.5)),
    });
    const borders = borderColors.map((borderColor, side) => (
      $('path', {
        fill: borderColor || 'none',
        d: filledPathForSide(left, top, width, height, borderRadii, borderWidths, side),
      })
    ))
    return backgroundShape + borders.join('')
  } else {
    const backgroundShape = $('path', {
      ...attributes,
      fill,
      d: pathForRect(left, top, width, height, borderRadii, [0, 0, 0, 0]),
    });
    const borders = borderColors.map((borderColor, side) => (
      $('path', {
        ...dashStyles[borderStyle](borderWidths[side]),
        stroke: borderColor,
        "stroke-width": borderWidths[side],
        d: strokedPathForSide(left, top, width, height, borderRadii, borderWidths, side),
      })
    ))
    return backgroundShape + borders.join('')
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

const $ = (type, settings) => `<${type}${attributes(settings)}/>`

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
