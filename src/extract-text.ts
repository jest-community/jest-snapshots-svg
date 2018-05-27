import { flattenStyles } from "./flatten-styles"
import { getDefaultFont, registerFontUsed } from "./font-loader"
export interface AttributedStyle { start: number, end: number, style: any }

export interface TextWithAttributedStyle { text: string, attributedStyles: AttributedStyle[] }

const getStyles = component => flattenStyles(component.props.style)

const mergeStyles = (a, b) => Object.keys(b).length > 0 ? { ...a, ...b } : a

const defaultStyles = {
  color: "black",
  fontSize: 14,
  fontStyle: "normal",
  fontWeight: "normal",
  lineHeight: 18,
  textAlign: "left",
}

const appendStyleTo = (
  attributedStyles: AttributedStyle[],
  text: string,
  style: object
) => {
  const lastAttributedStyle = attributedStyles.length > 0
    ? attributedStyles[attributedStyles.length - 1]
    : null

  if (lastAttributedStyle !== null && style === lastAttributedStyle) {
    lastAttributedStyle.end += text.length
  } else {
    const start = lastAttributedStyle ? lastAttributedStyle.end : 0
    const end = start + text.length
    attributedStyles.push({ start, end, style })
  }
}

export default (component): TextWithAttributedStyle => {
  let text = ""
  const attributedStyles: AttributedStyle[] = []

  const defaultStylesWithFont = mergeStyles(defaultStyles, { fontFamily: getDefaultFont() })
  const iterate = (c, style = mergeStyles(defaultStylesWithFont, getStyles(c))) => {
    registerFontUsed(style.fontFamily, style.fontWeight, style.fontStyle);
    (c.children || []).forEach(child => {
      if (child == null) {
        /* Do nothing */
      } else if (typeof child !== "object") {
        const childText = String(child) // child might be a number
        text += childText
        appendStyleTo(attributedStyles, childText, style)
      } else {
        iterate(child, mergeStyles(style, getStyles(child)))
      }
    })
  }

  iterate(component)

  return { text, attributedStyles }
}
