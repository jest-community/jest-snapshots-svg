
export function flattenStyles(style): object {
    if (style === null || typeof style !== "object") {
        return {}
    }

    if (!Array.isArray(style)) {
        return style
    }

    const result = {}
    for (let i = 0, styleLength = style.length; i < styleLength; ++i) {
        const computedStyle = flattenStyles(style[i])
        if (computedStyle) {
            Object.keys(computedStyle).forEach((key) => result[key] = computedStyle[key])
        }
    }
    return result
}
