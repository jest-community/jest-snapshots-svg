import * as fontManager from "font-manager"
import * as fontkit from "fontkit"
import * as fs from "fs"

const weights = {
  normal: "400",
  bold: "700"
}

const fonts = {}
const fontFallbacks = {}
let defaultFont = "Helvetica"

export const getDefaultFont = () => defaultFont
export const setDefaultFont = (fontName: string) => defaultFont = fontName

const numberWeight = weight => weights[weight] || weight

const keyFor = ({ fontFamily, fontWeight, fontStyle }) =>
  `${fontFamily} (weight: ${numberWeight(fontWeight)} style: ${fontStyle})`

interface NameMatch { match: string, value: string }

const weightNames = [
  { match: "thin", value: "100" },
  { match: "ultra light", value: "200" },
  { match: "light", value: "300" },
  { match: "normal", value: "400" },
  { match: "medium", value: "500" },
  { match: "semi bold", value: "600" },
  { match: "bold", value: "700" },
  { match: "ultra bold", value: "800" },
  { match: "heavy", value: "900" },
  { match: "100", value: "100" },
  { match: "200", value: "200" },
  { match: "300", value: "300" },
  { match: "400", value: "400" },
  { match: "500", value: "500" },
  { match: "600", value: "600" },
  { match: "700", value: "700" },
  { match: "800", value: "800" },
  { match: "900", value: "900" },
]

const italicNames = [
  { match: "italic", value: "italic" },
  { match: "oblique", value: "italic" },
]

const matchNames = (target: string, names: NameMatch[], defaultValue: string): string => {
  const match = names.find(name => target.toLowerCase().includes(name.match))
  return match ? match.value : defaultValue
}

const addFont = (font, style) => {
  const fontFamily = style.fontFamily || font.familyName
  const fontWeight = style.fontWeight || matchNames(font.subfamilyName, weightNames, "400")
  const fontStyle = style.fontStyle || matchNames(font.subfamilyName, italicNames, "normal")
  const key = keyFor({ fontFamily, fontWeight, fontStyle })

  if (!fontFamily || !fontWeight || !fontStyle) {
    throw new Error(`Could not find styles for font: ${key}`)
  }

  fonts[key] = font
}

export const loadFont = (
  fontFile,
  style: { fontFamily?: string, fontWeight?: string, fontStyle?: string, postscriptName?: string } = {}
) => {
  const font = fontkit.create(fontFile, style.postscriptName)
  if (font.fonts) {
    font.fonts.forEach(f => addFont(f, { fontFamily: style.fontFamily }))
  } else {
    addFont(font, style)
  }
}

export const addFontFallback = (fontFamily: string, fallback: string) => {
  fontFallbacks[fontFamily] = fallback
}

export const fontForStyle = (style, force = false) => {
  const key = keyFor(style)
  if (fonts[key]) {
    return fonts[key]
  } else if (force) {
    throw new Error(`No font defined for ${key}`)
  }

  const fontDescriptor = fontManager.findFontSync({
    family: style.fontFamily,
    weight: Number(numberWeight(style.fontWeight)),
    italic: style.fontStyle === "italic",
  })

  if (fontDescriptor) {
    loadFont(fs.readFileSync(fontDescriptor.path))
  }

  return fontForStyle(style, true)
}

export const fontWithFallbacks = (fontFamily: string): string => (
  fontFallbacks[fontFamily] ? `'${fontFamily}', ${fontFallbacks[fontFamily]}` : `'${fontFamily}'`
)
