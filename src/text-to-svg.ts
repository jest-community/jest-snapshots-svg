import { TextWithAttributedStyle } from "./extract-text"
import { $ } from "./svg-util"
import { lineHeight } from "./text-layout"

const textStyles = style => ({
  "font-family": style.fontFamily,
  "font-weight": style.fontWeight,
  "font-style": style.fontStyle,
})

export default (x, y, lines: TextWithAttributedStyle[]): string => {
  console.log(JSON.stringify(lines))
  const { textLines } = lines.reduce(({ textLines, y }, line) => {
    const { text, attributedStyles } = line
    const nextY = y + lineHeight(line)

    const tspans = attributedStyles.map(({ start, end, style }, i) => (
      $("tspan", {
        x: i === 0 ? 0 : undefined,
        y: i === 0 ? nextY : undefined,
        ...textStyles(style),
      }, text.slice(start, end))
    ))

    return {
      y: nextY,
      textLines: textLines + "\n" + tspans.join("")
    }
  }, {
    y,
    textLines: ""
  })

  return $("text", { x, y }, textLines)
}
