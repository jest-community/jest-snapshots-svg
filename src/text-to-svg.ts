import { TextWithAttributedStyle } from "./extract-text"
import { lineHeight } from "./text-layout"
import { $ } from "./svg-util"

const textStyles = style => ({
  'font-family': style.fontFamily,
  'font-weight': style.fontWeight,
  'font-variant': style.fontVariant,
})

export default (x, y, lines: Array<TextWithAttributedStyle>): string => {
  const { textLines } = lines.reduce(({ textLines, y }, line) => {
    const { text, attributedStyles } = line
    const nextY = y + lineHeight(line)

    const tspans = attributedStyles.map(({ start, end, style }, i) => (
      $('tspan', {
        x: i === 0 ? 0 : undefined,
        y: i === 0 ? nextY : undefined,
        ...textStyles(style),
      }, text.slice(start, end))
    ))

    return {
      y: nextY,
      textLines: textLines + '\n' + tspans.join('')
    }
  }, {
    y,
    textLines: ''
  });

  return $('text', { x, y }, textLines)
}
