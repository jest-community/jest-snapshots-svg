import "../../index"

import * as React from "react"
import { View } from "react-native"
import * as renderer from "react-test-renderer"

// https://facebook.github.io/react-native/docs/flexbox.html

it("No border radius", () => {
  const jsx = <View style={{ width: 100, height: 50 }} />

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})

it("Small border radius", () => {
  const jsx = <View style={{ width: 100, height: 50, borderRadius: 10 }} />

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})

it("Border radius larger than height", () => {
  const jsx = <View style={{ width: 100, height: 50, borderRadius: 1000 }} />

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})

it("Border radius larger than width", () => {
  const jsx = <View style={{ width: 50, height: 100, borderRadius: 1000 }} />

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})

it("Varying border radii", () => {
  const jsx = (
    <View
      style={{
        width: 100,
        height: 100,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 40,
        borderTopLeftRadius: 50,
        borderWidth: 10,
        borderColor: "blue",
        backgroundColor: "red"
      }}
    />
  )

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})

it("Varying border radii dashed", () => {
  const jsx = (
    <View
      style={{
        width: 100,
        height: 100,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 40,
        borderTopLeftRadius: 50,
        borderWidth: 10,
        borderColor: "blue",
        borderStyle: "dashed",
        backgroundColor: "red"
      }}
    />
  )

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})

it("Varying border radii dotted", () => {
  const jsx = (
    <View
      style={{
        width: 100,
        height: 100,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 40,
        borderTopLeftRadius: 50,
        borderWidth: 10,
        borderColor: "blue",
        borderStyle: "dotted",
        backgroundColor: "red"
      }}
    />
  )

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})

it("Varying border widths", () => {
  const jsx = (
    <View
      style={{
        width: 100,
        height: 100,
        borderRadius: 30,
        borderTopWidth: 5,
        borderRightWidth: 10,
        borderBottomWidth: 15,
        borderLeftWidth: 20,
        borderColor: "blue",
        backgroundColor: "red"
      }}
    />
  )

  const component = renderer.create(jsx).toJSON()
  expect(component).toMatchSVGSnapshot(320, 480)
})
