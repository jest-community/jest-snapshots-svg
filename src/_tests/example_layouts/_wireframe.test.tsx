import "../../index"

import * as React from "react"
import { View } from "react-native"
import * as renderer from "react-test-renderer"

it("Simple wireframe", () => {
  const jsx = <View style={{ width: 100, height: 50 }} />

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480, { wireframe: true })
})

it("Nested wireframe", () => {
  const jsx =
    <View style={{ width: 100, height: 50, flexDirection: "row" }}>
      <View style={{ flex: 1, margin: 5 }} />
      <View style={{ flex: 1, margin: 5 }} />
      <View style={{ flex: 1, margin: 5 }} />
    </View>

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480, { wireframe: true })
})

it("Simple wireframe with border radius", () => {
  const jsx = <View style={{ width: 100, height: 50, borderRadius: 20 }} />

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480, { wireframe: true })
})
