import { ViewStyle } from "react-native"
import * as yoga from "yoga-layout"

import { styleFromComponent } from "../component-to-node"
import { RenderedComponent } from "../index"
import wsp from "../whitespace"
import {
  dashStyles,
  filledPathForSide,
  getBorderColor,
  getBorderRadius,
  getBorderWidth,
  pathForRect,
  scaleSides,
  sidesEqual,
  strokedPathForSide,
} from "./borders"
import { $ } from "./util"

export default ({ top, left, width, height }: yoga.Layout, style: any) => {

  const borderWidths = getBorderWidth(style)
  const borderColors = getBorderColor(style)
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

  const borderWidth = 1

  const attributes: any = {
    "type": "View",
    "fill": "none",
    "stroke": "black",
    "stroke-width": borderWidth,
  }

  if (sidesEqual(borderRadii)) {
    const borderRadius = borderRadii[0]
    // Offset size by half border radius, as RN draws border inside, whereas SVG draws on both sides
    return $("rect", {
      ...attributes,
      x: left - borderWidth * 0.5,
      y: top - borderWidth * 0.5,
      width: width - borderWidth,
      height: height - borderWidth,
      rx: borderRadii[0] - borderWidth * 0.5,
      ry: borderRadii[0] - borderWidth * 0.5,
    })
  } else {
    return $("path", {
      ...attributes,
      "fill": "none",
      "stroke": borderColors[0],
      "stroke-width": borderWidth,
      "d": pathForRect(left, top, width, height, borderRadii, scaleSides(borderWidths, 0.5))
    })
  }
}
