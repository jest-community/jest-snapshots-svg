import * as yoga from "yoga-layout"

import nodeToSVG from "../node-to-svg"

const component = (name) => ({
  type: name,
  props: {} as any,
  children: [],
  layout: {
    left: 0,
    right: 6,
    top: 0,
    bottom: 100,
    width: 600,
    height: 400
  }
})
const settings = {
        width: 1024,
        height: 768,
      }

describe("nodeToSVG", () => {
    it("handles a simple square", () => {
      const rootNode = component("my component")

      const results = nodeToSVG(0, rootNode, settings)
      expect(results).toMatchSnapshot()
    })

    it("shows the text colour outline when there is no BG", () => {
      const rootNode = component("my component")
      rootNode.props.style = {
        color: "white",
      }

      const results = nodeToSVG(0, rootNode, settings)
      expect(results).toMatchSnapshot()
    })
})
