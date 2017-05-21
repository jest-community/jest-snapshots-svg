import "../index"

import * as React from "react"
import { View } from "react-native"
import * as renderer from "react-test-renderer"

import componentTreeToNodeTree from "../component-tree-to-nodes"
import renderedComponentTree from "../reapply-layouts-to-components"
import treeToSVG from "../tree-to-svg"

import * as fs from "fs"
import * as yoga from "yoga-layout"

it("handles some simple JSX", () => {
  const jsx = (
    <View style={{width: 100, height: 200, marginLeft: 40, marginTop: 40, paddingLeft: 20}}>
      <View style={{width: 20, height: 20}}/>
      <View style={{width: 160, height: 40, marginTop: 20}}>
        <View style={{width: 10, height: 10, marginLeft: 10, marginTop: 20}}/>
        <View style={{width: 10, height: 10, marginLeft: 20, marginTop: 10}}/>
      </View>
      <View style={{width: 20, height: 20}}/>
    </View>
  )

  const component = renderer.create(jsx).toJSON()
  const settings = {
    width:  600,
    height: 400,
  }

  const rootNode = componentTreeToNodeTree(component, settings)
  const rendered = renderedComponentTree(component, rootNode)
  const results = treeToSVG(rendered, settings)

  fs.writeFileSync("jsx-render.svg", results)
  expect(results).toMatchSnapshot()

  expect(component).toMatchSVGSnapshot(1024, 768)
  rootNode.freeRecursive()
})
