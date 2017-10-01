const mockNodeToSVG = jest.fn()
jest.mock("../node-to-svg.ts", () => ({ default: mockNodeToSVG }))

import * as yoga from "yoga-layout"
import { RenderedComponent } from "../index"
import { recurseTree, svgWrapper } from "../tree-to-svg"

describe("svgWrapper", () => {
    it("wraps whatever text you pass into it with an SVG schema", () => {
      const body = "[My Body]"
      const settings = {
        width: 444,
        height: 555,
      }

      const results = svgWrapper(body, settings)
      expect(results).toMatchSnapshot()
    })
})

const component = (name) => ({
  type: name,
  props: {},
  children: [],
  textContent: undefined,
  layout: {
    left: 2,
    right: 6,
    top: 80,
    bottom: 100,
    width: 200,
    height: 200
  }
}) as RenderedComponent

describe("recurseTree", () => {
    beforeEach(() => {
      mockNodeToSVG.mockReset()
    })

    it("Calls nodeToSVG for it's first node", () => {
      const root = component("main")

      const settings = {
        width: 1024,
        height: 768,
      }
      const results = recurseTree(0, root, settings)
      expect(mockNodeToSVG.mock.calls.length).toEqual(1)
    })

    it("Calls nodeToSVG for it's children nodes", () => {
      const root = component("main")
      root.children = [component("1"), component("2")]

      const settings = {
        width: 1024,
        height: 768,
        styleMap: new WeakMap()
      }

      const results = recurseTree(0, root, settings)
      expect(mockNodeToSVG.mock.calls.length).toEqual(3)
    })
})
