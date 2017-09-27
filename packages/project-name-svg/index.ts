import layoutNode, { Component } from 'project-name-core'
import treeToSVG from "./tree-to-svg"

export default (root: Component, width: number, height: number): string => {
    const settings = { width, height }
    return treeToSVG(layoutNode(root, settings), settings)
}
