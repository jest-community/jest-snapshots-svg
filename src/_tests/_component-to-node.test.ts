import * as yoga from "yoga-layout"

import componentToNode, { styleFromComponent } from "../component-to-node"

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
      height: 768
    }

    const node = componentToNode(component, settings)
    node.calculateLayout(yoga.UNDEFINED, yoga.UNDEFINED, yoga.DIRECTION_INHERIT)

    expect(node.getComputedWidth()).toEqual(300)
    expect(node.getComputedHeight()).toEqual(40)

    node.free()
  })
})

const componentWithStyle = (style: any) => ({ kind: "Stub", props: {style}})

describe("styleFromComponent", () => {
  it("handles deeply nested arrays of styles", () => {
    const style = [
      {
        fontSize: 30,
        color: "black",
        textAlign: "left",
        paddingLeft: 20,
        paddingRight: 20
      },
      [
        {
          textAlign: "center",
          fontSize: 30,
          lineHeight: 32,
          width: 280,
          marginTop: 35,
          alignSelf: "center"
        },
        null
      ],
      { fontFamily: "AGaramondPro-Regular" }
    ]
    const component = componentWithStyle(style)
    expect(styleFromComponent).toMatchSnapshot()
  })
})
