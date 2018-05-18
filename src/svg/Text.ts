import { TextWithAttributedStyle } from "../extract-text"
import { fontWithFallbacks } from "../font-loader"
import { lineBaseline, lineFontSize, lineHeight } from "../text-layout"
import { $ } from "./util"

const textStyles = style => ({
  "font-family": fontWithFallbacks(style.fontFamily),
  "font-weight": style.fontWeight,
  "font-style": style.fontStyle,
  "font-size": style.fontSize,
})

const textAligns = {
  left: 0,
  center: 0.5,
  right: 1,
}

const textAnchors = {
  left: "start",
  center: "middle",
  right: "end",
}

export default (x, y, width, height, lines: TextWithAttributedStyle[]): string => {
  const { textAlign = "left" as string } = lines[0].attributedStyles[0].style
  const originX = x + width * textAligns[textAlign]

  const { textLines } = lines.reduce((accum, line) => {
    const { text, attributedStyles } = line
    const originY = accum.y + lineBaseline(line) + (lineHeight(line) - lineFontSize(line)) / 2

    const tspans = attributedStyles.map(({ start, end, style }, i) => (
      $("tspan", {
        x: i === 0 ? originX : undefined,
        y: i === 0 ? originY : undefined,
        fill: style.color,
        ...textStyles(style),
      }, i === attributedStyles.length - 1
        ? text.slice(start, end).replace(/\s*$/, "")
        : text.slice(start, end)
      )
    ))

    return {
      y: accum.y + lineHeight(line),
      textLines: accum.textLines.concat(tspans.join("\n"))
    }
  }, {
    y,
    textLines: []
  } as { y: number, textLines: string[] })

  return $("text", {
    x,
    y,
    "text-anchor": textAlign !== "left" ? textAnchors[textAlign as string] : undefined,
  }, textLines.join("\n"))
}
