import * as React from "react"
import { View } from "react-native"
import * as renderer from "react-test-renderer"

import componentTreeToNodeTree from "../component-tree-to-nodes"
import treeToSVG from "../tree-to-svg"

import * as fs from "fs"
import * as yoga from "yoga-layout"

it("handles some simple JSX", () => {
  const jsx = (
    <View style={{width: 200, height: 200, marginLeft: 40, marginTop: 40, paddingLeft: 20}}>
      <View style={{width: 20, height: 20}}/>
      <View style={{width: 20, height: 20}}/>
      <View style={{width: 20, height: 20}}/>
    </View>
  )
  const component = renderer.create(jsx).toJSON()
  const settings = {
    width:  600,
    height: 400,
  }
  console.log(component)
  const rootNode = componentTreeToNodeTree(component, settings)
  const results = treeToSVG(rootNode, settings)

  fs.writeFileSync("jsx-render.svg", results)
  expect(results).toMatchSnapshot()

  rootNode.freeRecursive()
})
