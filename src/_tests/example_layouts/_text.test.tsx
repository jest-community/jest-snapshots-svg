import "../../index"

import * as React from "react"
import { Text, View } from "react-native"
import * as renderer from "react-test-renderer"

import { loadFont } from "../../index"

it("Renders a line of text", () => {
  const jsx =
    <View style={{ width: 100 }}>
      <Text>Hello world</Text>
    </View>

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})

it("Renders multiple lines of text", () => {
  const jsx =
    <View style={{ width: 100 }}>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eleifend congue faucibus. In
        {" "}eget tortor in odio luctus eleifend. Nullam pretium justo nisi, nec volutpat turpis
        {" "}tempor et.
      </Text>
    </View>

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})

it("Renders multiple lines of text with multiple styles", () => {
  const jsx =
    <View style={{ width: 100 }}>
      <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      {" "}<Text style={{ fontStyle: "italic" }}>Sed eleifend congue faucibus.</Text>
      {" "}In eget tortor in odio luctus eleifend. Nullam pretium justo nisi, nec volutpat turpis tempor et.</Text>
    </View>

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})

it("Renders multiple lines of text with text align", () => {
  const jsx =
    <View style={{ width: 100 }}>
      <View>
        <Text style={{ textAlign: "left" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
      </View>
      <View>
        <Text style={{ textAlign: "center" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
      </View>
      <View>
        <Text style={{ textAlign: "right" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
      </View>
    </View>

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})
