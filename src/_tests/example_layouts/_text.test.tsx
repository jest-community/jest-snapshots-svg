import "../../index"

import * as React from "react"
import { Text, View } from "react-native"
import * as renderer from "react-test-renderer"

it("Renders three vertically/horizontally centeredblocks", () => {
  const jsx =
    <View style={{
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <Text style={{
        width: 100,
        fontFamily: "AGaramondPro-Regular",
        fontSize: 16,
        marginTop: 5,
      }}>Hello there, here are some words</Text>
    </View>

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})
