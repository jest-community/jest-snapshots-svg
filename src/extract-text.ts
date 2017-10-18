export interface AttributedStyle { start: number, end: number, style: Object }

export interface TextWithAttributedStyle { text: string, attributedStyles: AttributedStyle[] }

const flattenStyles = (styles): Object => Array.isArray(styles)
  ? Object.assign({}, ...styles)
  : (styles || {})

const getStyles = component => flattenStyles(component.props.style)

const mergeStyles = (a, b) => Object.keys(b).length > 0 ? { ...a, ...b } : a

const defaultStyles = {
  fontSize: 14,
  lineHeight: 18,
  fontFamily: "SF UI Text",
  fontWeight: "normal",
  fontStyle: "normal",
  textAlign: "left",
}

const appendStyleTo = (
  attributedStyles: AttributedStyle[],
  text: string,
  style: Object
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

  const iterate = (component, style = mergeStyles(defaultStyles, getStyles(component))) => {
    if (!component.children) return
    component.children.forEach(child => {
      if (child == null) return
      if (typeof child !== "object") {
        const childText = String(child) // child might be a number
        text += childText
        appendStyleTo(attributedStyles, childText, style)
      } else {
        iterate(child, mergeStyles(style, getStyles(child)))
      }
    }, [])
  }

  iterate(component)

  return { text, attributedStyles }
}
