const nodeToSVG = jest.fn()
jest.mock("../node-to-svg.ts", () => ({ default: nodeToSVG }))

import * as yoga from "yoga-layout"
import { recurseTree, svgWrapper } from "../tree-to-svg"

describe("svgWrapper", () => {
    it("wraps whatever text you pass into it with an SVG schema", () => {
      const body = "[My Body]"
      const settings = {
        width: 444,
        height: 555
      }

      const results = svgWrapper(body, settings)
      expect(results).toMatchSnapshot()
    })
})

describe("recurseTree", () => {
    beforeEach(() => {
      nodeToSVG.mockReset()
    })

    it("Calls nodeToSVG for it's first node", () => {
      const children = []
      const fakeNode: any = {
        getChild: (index) => children[index],
        getChildCount: () => children.length,
      }
      const settings = {
        width: 1024,
        height: 768
      }
      const results = recurseTree(0, fakeNode, settings)
      expect(nodeToSVG.mock.calls.length).toEqual(1)
    })

    it("Calls nodeToSVG for it's children nodes", () => {
      const children = [] as any[]
      const root: any = {
        getChild: (index) => children[index],
        getChildCount: () => children.length,
        getComputedLeft: () => 20,
        getComputedTop: () => 20,
        id: "root"
      }
      const fakeNode2: any = {
        getChild: (index) => null,
        getChildCount: () => 0,
        id: "2"
      }

      const fakeNode3: any = {
        getChild: (index) => null,
        getChildCount: () => 0,
        id: "3"
      }

      children.push(fakeNode2)
      children.push(fakeNode3)

      const settings = {
        width: 1024,
        height: 768
      }

      const results = recurseTree(0, root, settings)
      expect(nodeToSVG.mock.calls.length).toEqual(3)
    })
})
