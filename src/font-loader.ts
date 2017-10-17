const opentype = require("opentype.js")

const fonts = {}

const debug = ({ fontFamily, fontWeight, fontStyle }) =>
  `${fontFamily} (weight: ${fontWeight}, style: ${fontStyle})`

const keyFor = ({ fontFamily, fontWeight, fontStyle }) =>
  `${fontFamily}:${fontWeight}:${fontStyle}`

export const loadFont = (fontFile, fontFamily, fontWeight, fontStyle) => {
  const style = { fontFamily, fontWeight, fontStyle }
  const key = keyFor(style)
  if (fonts[key]) throw new Error(`Already added ${debug(style)}`)
  fonts[key] = opentype.parse(fontFile)
}

export const fontForStyle = style => {
  const key = keyFor(style)
  if (!fonts[key]) throw new Error(`No font defined for ${debug(style)}`)
  return fonts[key]
}
