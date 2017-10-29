export const $ = (type: string, attributes: object, children?: string): string => {
  const opening = Object.keys(attributes).reduce((accum, key) => (
    attributes[key] != null ? `${accum} ${key}="${attributes[key]}"` : accum
  ), `<${type}`)
  return children ? `${opening}>${children}</${type}>` : `${opening}/>`
}
