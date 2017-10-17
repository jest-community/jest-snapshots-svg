import { TextWithAttributedStyle } from "./extract-text"
import { fontForStyle } from "./font-loader"
const LineBreaker = require("linebreak")

export const lineWidth = ({ text, attributedStyles }: TextWithAttributedStyle): number =>
  attributedStyles.reduce((x, { start, end, style }, i) => {
    let body = text.slice(start, end)
    // Trim trailling whitespace
    if (i === attributedStyles.length - 1) body = body.replace(/\s+$/, "")
    return x + fontForStyle(style).getAdvanceWidth(body, (style as any).fontSize)
  }, 0)

export const lineHeight = (line: TextWithAttributedStyle): number =>
  Math.max(
    0,
    ...line.attributedStyles.map(({ style }) => (style as any).lineHeight)
  )

const textSlice = (
  textStyle: TextWithAttributedStyle,
  start: number,
  end: number
): TextWithAttributedStyle => {
  const text = textStyle.text.slice(start, end)
  const firstIndex = textStyle.attributedStyles.findIndex(style => style.end >= start)
  if (firstIndex === -1) throw new Error("Should not happen")
  const indexAfter = textStyle.attributedStyles.findIndex(style => style.end >= end)
  let attributedStyles = indexAfter > 0
    ? textStyle.attributedStyles.slice(firstIndex, indexAfter)
    : textStyle.attributedStyles.slice(firstIndex)
  const length = end - start
  attributedStyles = attributedStyles.map(attributedStyle => ({
    start: Math.max(attributedStyle.start - start, 0),
    end: Math.min(attributedStyle.end - start, length),
    style: attributedStyle.style,
  }))
  return { text, attributedStyles }
}

export const breakLines = (
  textStyle: TextWithAttributedStyle,
  width: number
): Array<TextWithAttributedStyle> => {
  const { text, attributedStyles } = textStyle
  const breaker = new LineBreaker(text)

  const lines: Array<TextWithAttributedStyle> = []
  let lineStart = 0
  let lastLine: TextWithAttributedStyle | null = null

  let bk = null
  while ((bk = breaker.nextBreak()) != null) {
    const { position } = bk as any
    const trialLine = textSlice(textStyle, lineStart, position)
    if (lastLine === null || lineWidth(trialLine) <= width) {
      lastLine = trialLine
    } else {
      lineStart = position
      lines.push(lastLine)
      lastLine = null
    }
  }

  if (lastLine !== null) lines.push(lastLine)

  return lines
}

export const measureLines = lines => ({
  width: Math.max(0, ...lines.map(lineWidth)),
  height: Math.max(0, ...lines.map(lineHeight)),
})
