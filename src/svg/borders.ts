import {ViewStyle} from "react-native"
import * as yoga from "yoga-dom"

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
export type Sides<T> = [T, T, T, T]

const applySides = <T>(sides: Sides<T>, value: T | null | undefined, side: Side): Sides<T> => {
  if (value == null) {
    return sides
  }

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

export const getBorderWidth = (style: any): Sides<number> => {
  let sides: Sides<number> = [0, 0, 0, 0]
  sides = applySides(sides, style.borderWidth, Side.All)
  sides = applySides(sides, style.borderTopWidth, Side.Top)
  sides = applySides(sides, style.borderRightWidth, Side.Right)
  sides = applySides(sides, style.borderBottomWidth, Side.Bottom)
  sides = applySides(sides, style.borderLeftWidth, Side.Left)
  return sides
}

export const getBorderColor = (style: any): Sides<string> => {
  let sides: Sides<string> = ["black", "black", "black", "black"]
  sides = applySides(sides, style.borderColor, Side.All)
  sides = applySides(sides, style.borderTopColor, Side.Top)
  sides = applySides(sides, style.borderRightColor, Side.Right)
  sides = applySides(sides, style.borderBottomColor, Side.Bottom)
  sides = applySides(sides, style.borderLeftColor, Side.Left)
  return sides
}

export const getBorderRadius = (style: any): Sides<number> => {
  let sides: Sides<number> = [0, 0, 0, 0]
  // Close enough. We get the right result.
  sides = applySides(sides, style.borderRadius, Side.All)
  sides = applySides(sides, style.borderTopLeftRadius, Side.Top)
  sides = applySides(sides, style.borderTopRightRadius, Side.Right)
  sides = applySides(sides, style.borderBottomRightRadius, Side.Bottom)
  sides = applySides(sides, style.borderBottomLeftRadius, Side.Left)
  return sides
}

export const getScaledBorderRadius = (style: any, width: number, height: number): Sides<number> => {
  let borderRadii = getBorderRadius(style)

  const borderScale = Math.max(
    (borderRadii[0] + borderRadii[2]) / width,
    (borderRadii[1] + borderRadii[3]) / width,
    (borderRadii[0] + borderRadii[3]) / height,
    (borderRadii[1] + borderRadii[2]) / height,
    1
  )

  if (borderScale > 1) {
    borderRadii = scaleSides(borderRadii, 1 / borderScale)
  }

  return borderRadii
}

export const sidesEqual = <T>(sides: Sides<T>): boolean =>
  sides[0] === sides[1] &&
  sides[0] === sides[2] &&
  sides[0] === sides[3]

export const scaleSides = (sides: Sides<number>, scale: number): Sides<number> =>
  [sides[0] * scale, sides[1] * scale, sides[2] * scale, sides[3] * scale]

interface Corner { rx: number, ry: number, x: number, y: number }

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
    moveCommand = "",
  }: {
    startCompletion?: number,
    endCompletion?: number,
    moveCommand?: "M" | "L" | "",
    anticlockwise?: boolean,
  } = {}
) => {
  const baseAngle = (side + 3) * (Math.PI / 2)

  const startSide = anticlockwise ? (side + 1) % 4 : side
  const endSide = anticlockwise ? side : (side + 1) % 4
  const sweep = anticlockwise ? 0 : 1
  const completionFactor = Math.PI / 2 * (anticlockwise ? -1 : 1)

  let path = ""
  const startCorner = cornerEllipseAtSide(x, y, width, height, radii, insets, startSide)

  if (moveCommand !== "") {
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

export const pathForRect = (x, y, width, height, radii, insets, anticlockwise: boolean = false) => {
  const sideIndices = [0, 1, 2, 3]

  if (anticlockwise) {
    sideIndices.reverse()
  }

  const sides = sideIndices.map((side, index) => (
    drawSide(x, y, width, height, radii, insets, side, {
      startCompletion: 0,
      endCompletion: 1,
      moveCommand: index === 0 ? "M" : "",
      anticlockwise,
    })
  ))
  return sides.join("") + "Z"
}

export const filledPathForSide = (x, y, width, height, radii, insets, side) => (
  drawSide(x, y, width, height, radii, [0, 0, 0, 0], side, { moveCommand: "M" }) +
  drawSide(x, y, width, height, radii, insets, side, { moveCommand: "L", anticlockwise: true }) +
  "Z"
)

export const strokedPathForSide = (x, y, width, height, radii, insets, side) => (
  drawSide(x, y, width, height, radii, scaleSides(insets, 0.5), side, { moveCommand: "M" })
)

export const dashStyles = {
  dotted: width => ({ "stroke-linecap": "round", "stroke-dasharray": `0, ${width * 1.5}`}),
  dashed: width => ({ "stroke-dasharray": `${width * 2}, ${width}`}),
}
