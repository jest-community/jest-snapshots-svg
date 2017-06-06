import * as yoga from "yoga-layout"

import componentToNode from "../component-to-node"

describe("componentToNode", () => {
    it("generates the width for a simple component", () => {
      const component = {
        type: "View",
        props: {
          style: {
            width: 300,
            height: 40
          }
        },
        children: null
      }

      const settings = {
        width: 1024,
        height: 768,
      }

      const node = componentToNode(component, settings)
      node.calculateLayout(yoga.UNDEFINED, yoga.UNDEFINED, yoga.DIRECTION_INHERIT)

      expect(node.getComputedWidth()).toEqual(300)
      expect(node.getComputedHeight()).toEqual(40)

      node.free()
    })
})
