import "../../index"

import * as React from "react"
import { View } from "react-native"
import * as renderer from "react-test-renderer"

// https://facebook.github.io/react-native/docs/flexbox.html

it("Renders three vertically/horizontally centeredblocks", () => {
  const jsx =
      <View style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <View style={{width: 50, height: 50, backgroundColor: "powderblue"}} />
        <View style={{width: 50, height: 50, backgroundColor: "skyblue"}} />
        <View style={{width: 50, height: 50, backgroundColor: "steelblue"}} />
      </View>

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})
