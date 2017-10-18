import { TextWithAttributedStyle } from "./extract-text"
import { $ } from "./svg-util"
import { lineWidth, lineHeight, lineBaseline } from "./text-layout"

const textStyles = style => ({
  "font-family": style.fontFamily,
  "font-weight": style.fontWeight,
  "font-style": style.fontStyle,
  "font-size": style.fontSize,
})

const textAligns = {
  left: 0,
  center: 0.5,
  right: 1,
}

export default (x, y, width, height, lines: TextWithAttributedStyle[]): string => {
  const { textLines } = lines.reduce(({ textLines, y }, line) => {
    const { text, attributedStyles } = line
    const originX = (width - lineWidth(line)) * textAligns[(attributedStyles[0].style as any).textAlign]
    const originY = y + lineBaseline(line)

    const tspans = attributedStyles.map(({ start, end, style }, i) => (
      $("tspan", {
        x: i === 0 ? originX : undefined,
        y: i === 0 ? originY : undefined,
        ...textStyles(style),
      }, text.slice(start, end))
    ))

    return {
      y: y + lineHeight(line),
      textLines: textLines + "\n" + tspans.join("")
    }
  }, {
    y,
    textLines: ""
  })

  return $("text", { x, y }, textLines)
}
