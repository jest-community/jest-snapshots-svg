import "../../index"

import * as React from "react"
import { Text, View } from "react-native"
import * as renderer from "react-test-renderer"

it("Renders text blocks", () => {
  const jsx =
    <View style={{
      flex: 1,
      width: 600,
      height: 600
    }}>
      <Text style={{
        width: 200,
        fontFamily: "AGaramondPro-Regular",
        fontSize: 16,
        marginTop: 5,
      }}>Hello there, here are some words</Text>
    </View>

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})
