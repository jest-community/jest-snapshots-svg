import * as yoga from "yoga-layout"

import nodeToSVG from "../node-to-svg"

describe("nodeToSVG", () => {
    it("handles a simple square", () => {
      const rootNode = yoga.Node.create()
      rootNode.setWidth(600)
      rootNode.setHeight(400)
      rootNode.setDisplay(yoga.DISPLAY_FLEX)
      rootNode.setFlexDirection(yoga.FLEX_DIRECTION_ROW)

      const settings = {
        width: 1024,
        height: 768
      }

      const results = nodeToSVG(rootNode, null, settings)
      expect(results).toMatchSnapshot()

      rootNode.free()
    })
})
