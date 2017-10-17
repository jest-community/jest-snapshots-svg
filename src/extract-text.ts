export type AttributedStyle = { start: number, end: number, style: Object }

export type TextWithAttributedStyle = { text: string, attributedStyles: Array<AttributedStyle> }

const flattenStyles = styles => Array.isArray(styles)
  ? Object.assign({}, ...styles)
  : (styles || {})

const getStyles = component => flattenStyles(component.props.style)

const mergeStyles = (a, b) => Object.keys(b).length > 0 ? { ...a, ...b } : a

const defaultStyles = {
  fontSize: 14,
  lineHeight: 18,
  fontFamily: "Helvetica",
  fontWeight: "normal",
  fontVariant: "normal",
}

const appendStyleTo = (
  attributedStyles: Array<AttributedStyle>,
  text: string,
  style: Object
) => {
  const lastAttributedStyle = attributedStyles.length > 0
    ? attributedStyles[attributedStyles.length - 1]
    : null

  if (lastAttributedStyle !== null && style === lastAttributedStyle) {
    lastAttributedStyle.end += text.length
  } else {
    attributedStyles.push({
      start: lastAttributedStyle ? lastAttributedStyle.end : 0,
      end: text.length,
      style,
    })
  }
}

/*
This was previous workings. Just keeping until I"ve checked everything works.

type Run = { text: ", style: Object }

const concatRuns = (left: Array<Run>, right: Array<Run>): Array<Run> => {
  if (left.length === 0) return right
  if (right.length === 0) return left

  const lastLeft = left[left.length - 1]
  const firstRight = right[0]

  if (lastLeft.style !== firstRight.style) return left.concat(right)

  return left.slice(0, -1)
    .concat({ text: lastLeft.text + firstRight.text, style: lastLeft.style } as Run)
    .concat(right.slice(1))
}

const textToRuns = (component, style = getStyles(component)): Array<Run> =>
  (component.children || []).reduce((accum, child) => {
    if (child == null) return accum
    if (typeof child !== "object") return accum.concat({ text: String(child), style })
    return accum.concat(textToRuns(child, { ...style, ...getStyles(component) }))
  }, [])

export default (component): TextWithAttributedStyle => {
  let text = ""
  let attributedStyles: Array<AttributedStyle> = []

  for (const run of textToRuns(component)) {
    text += run.text
    appendStyleTo(attributedStyles, run.text, run.style)
  }

  return { text, attributedStyles }
}
*/

export default (component): TextWithAttributedStyle => {
  let text = ""
  let attributedStyles: Array<AttributedStyle> = []

  const iterate = (component, style = mergeStyles(defaultStyles, getStyles(component))) => {
    if (!component.children) return
    component.children.forEach((child) => {
      if (child == null) return
      if (typeof child !== "object") {
        const childText = String(child) // child might be a number
        text += childText
        appendStyleTo(attributedStyles, childText, style)
      } else {
        iterate(child, mergeStyles(style, getStyles(component)))
      }
    }, [])
  }

  iterate(component)

  return { text, attributedStyles }
}
