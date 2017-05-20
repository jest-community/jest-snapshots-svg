// import * as fs from "fs"
import * as yoga from "yoga-layout"

import treeToSVG from "../tree-to-svg"

describe("treeToSVG", () => {
    it("wraps whatever text you pass into it with an SVG schema", () => {
      const rootNode = yoga.Node.create()
      rootNode.setWidth(600)
      rootNode.setHeight(400)
      rootNode.setMargin(yoga.EDGE_ALL, 20)
      rootNode.setDisplay(yoga.DISPLAY_FLEX)
      rootNode.setFlexDirection(yoga.FLEX_DIRECTION_ROW)

      const settings = {
        width: 1024,
        height: 768
      }

      const results = treeToSVG(rootNode, settings)
      expect(results).toMatchSnapshot()

      rootNode.freeRecursive()
    })
})
