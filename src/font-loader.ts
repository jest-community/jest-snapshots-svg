const opentype = require("opentype.js")

const fonts = {}

const debug = ({ fontFamily, fontWeight, fontVariant }) =>
  `${fontFamily} (weight: ${fontWeight}, variant: ${fontVariant})`

const keyFor = ({ fontFamily, fontWeight, fontVariant }) =>
  `${fontFamily}:${fontWeight}:${fontVariant}`

export const loadFont = (fontFile, fontFamily, fontWeight, fontVariant) => {
  const style = { fontFamily, fontWeight, fontVariant }
  const key = keyFor(style)
  if (fonts[key]) throw new Error(`Already added ${debug(style)}`)
  fonts[key] = opentype.parse(fontFile)
}

export const fontForStyle = style => {
  const key = keyFor(style)
  if (!fonts[key]) throw new Error(`No font defined for ${debug(style)}`)
  return fonts[key]
}
