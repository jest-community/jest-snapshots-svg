import * as yoga from "yoga-layout"

import treeToSVG from "../tree-to-svg"

describe("treeToSVG", () => {
  it("wraps whatever text you pass into it with an SVG schema", () => {
    const renderedComponent = {
      type: "my component",
      props: {},
      children: [],
      layout: {
        left: 2,
        right: 6,
        top: 80,
        bottom: 100,
        width: 200,
        height: 200
      }
    }

    const settings = {
      width: 1024,
      height: 768,
    }

    const results = treeToSVG(renderedComponent, settings)
    expect(results).toMatchSnapshot()
  })
})
