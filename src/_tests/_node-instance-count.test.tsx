import "../index"

import * as yoga from "yoga-layout"

import * as React from "react"
import { View } from "react-native"
import * as renderer from "react-test-renderer"

import treeToSVG from "../tree-to-svg"

describe("Counting nodes", () => {
    it("it is good with memory", () => {

      expect(yoga.getInstanceCount()).toEqual(0)

      const jsx =
        <View style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <View style={{width: 50, height: 50, backgroundColor: "powderblue"}} />
        < View style={{width: 50, height: 50, backgroundColor: "skyblue"}} />
        <View style={{width: 50, height: 50, backgroundColor: "steelblue"}} />
      </View>

      const component = renderer.create(jsx).toJSON()
      expect(component).toMatchSVGSnapshot(320, 480)

      expect(yoga.getInstanceCount()).toEqual(0)
    })
})
