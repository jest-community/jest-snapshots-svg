import { AttributedStyle, TextWithAttributedStyle } from "./extract-text"
import { fontForStyle } from "./font-loader"
const LineBreaker = require("linebreak")

export const lineWidth = ({ text, attributedStyles }: TextWithAttributedStyle): number =>
  attributedStyles.reduce((x, { start, end, style }, i) => {
    let body = text.slice(start, end)
    // Trim trailling whitespace
    if (i === attributedStyles.length - 1) {
      body = body.replace(/\s+$/, "")
    }
    const font = fontForStyle(style)
    return x + font.layout(body).advanceWidth / font.unitsPerEm * (style as any).fontSize
  }, 0)

export const lineHeight = (line: TextWithAttributedStyle): number =>
  Math.max(
    0,
    ...line.attributedStyles.map(({ style }) => (style as any).lineHeight)
  )

const baselineForAttributedStyle = ({ style }: AttributedStyle): number => {
  const font = fontForStyle(style)
  return font.ascent / font.unitsPerEm * (style as any).fontSize
}

export const lineBaseline = (line: TextWithAttributedStyle): number =>
  Math.max(0, ...line.attributedStyles.map(baselineForAttributedStyle))

const textSlice = (
  textStyle: TextWithAttributedStyle,
  start: number,
  end: number
): TextWithAttributedStyle => ({
  text: textStyle.text.slice(start, end),
  attributedStyles: textStyle.attributedStyles
    .filter(a => a.end > start && a.start < end)
    .map(a => ({
      start: Math.max(a.start - start, 0),
      end: Math.min(a.end - start, end - start),
      style: a.style,
    }))
})

export const breakLines = (
  textStyle: TextWithAttributedStyle,
  width: number
): TextWithAttributedStyle[] => {
  const { text, attributedStyles } = textStyle
  const breaker = new LineBreaker(text)

  const lines: TextWithAttributedStyle[] = []
  let lineStart = 0
  let lastPosition = 0
  let lastLine: TextWithAttributedStyle | null = null

  let bk = breaker.nextBreak()
  while (bk != null) {
    const { position, required } = bk as any
    const testLine = textSlice(textStyle, lineStart, position)
    if (lastLine === null || (!required && lineWidth(testLine) <= width)) {
      lastLine = testLine
    } else {
      lines.push(lastLine)
      lineStart = lastPosition
      lastLine = textSlice(textStyle, lineStart, position)
    }
    lastPosition = position
    bk = breaker.nextBreak()
  }

  if (lastLine !== null) {
    lines.push(lastLine)
  }

  return lines
}

export const measureLines = lines => ({
  width: Math.max(0, ...lines.map(lineWidth)),
  height: lines.reduce((a, b) => a + lineHeight(b), 0),
})
