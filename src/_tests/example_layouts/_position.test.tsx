import "../../index"

import * as React from "react"
import { Text, View } from "react-native"
import * as renderer from "react-test-renderer"

it("Renders views on top position", () => {
  const jsx =
    <View style={{ flex: 1 }}>
      <View style={{
        position: "absolute",
        top: 10,
        left: 10,
        right: 10,
        height: 100,
      }} />
      <View style={{
        position: "absolute",
        top: 20,
        left: 20,
        right: 20,
        height: 80,
      }} />
    </View>
  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})

it("Renders views on bottom position", () => {
  const jsx =
    <View style={{ flex: 1 }}>
      <View style={{
        position: "absolute",
        left: 10,
        right: 10,
        bottom: 10,
        height: 100,
      }} />
      <View style={{
        position: "absolute",
        left: 20,
        right: 20,
        bottom: 20,
        height: 80,
      }} />
    </View>
  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})

it("Renders views on left position", () => {
  const jsx =
    <View style={{ flex: 1 }}>
      <View style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: 100,
      }} />
    </View>
  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})
