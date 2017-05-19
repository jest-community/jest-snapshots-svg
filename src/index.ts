import * as yoga from "yoga-layout"

export interface Component {
    type: string,
    props: any,
    children: Component[] | null
}

export interface Settings {
    width: number
    height: number
}

export default function hello(settings: Settings, json: Component) {
    const {height, width} = settings
    const rootNode = yoga.Node.create()
    rootNode.setWidth(width)
    rootNode.setHeight(height)
    rootNode.setPadding(yoga.EDGE_ALL, 20)
    rootNode.setDisplay(yoga.DISPLAY_FLEX)
    rootNode.setFlexDirection(yoga.FLEX_DIRECTION_ROW)

    const child1 = yoga.Node.create()
    child1.setWidth(250)
    child1.setHeight(400)
    child1.setFlex(0)

    const child2 = yoga.Node.create()
    child2.setWidth(400)
    child2.setHeight(500)
    child2.setFlex(1)

    rootNode.insertChild(child1, 0)
    rootNode.insertChild(child2, 1)

    rootNode.calculateLayout(1024, 768, yoga.DIRECTION_LTR)

    console.log(`
    root pos: {${rootNode.getComputedLeft()}, ${rootNode.getComputedTop()},
               ${rootNode.getComputedWidth()}, ${rootNode.getComputedHeight()}}
`)
    for (let i = 0, l = rootNode.getChildCount(); i < l; ++i) {
        const child = rootNode.getChild(i)
        console.log(`
    child ${i} pos: {${child.getComputedLeft()}, ${child.getComputedTop()},
                     ${child.getComputedWidth()}, ${child.getComputedHeight()}}`)
        console.log(child.getComputedLayout().toString())
    }

    rootNode.removeChild(child1)
    rootNode.removeChild(child2)

    console.log(`There are ${yoga.getInstanceCount()} nodes`)
    yoga.Node.destroy(child2)
    console.log(`There are ${yoga.getInstanceCount()} nodes left`)
    child1.free()
    console.log(`There are ${yoga.getInstanceCount()} nodes left`)
    rootNode.freeRecursive()
    console.log(`There are ${yoga.getInstanceCount()} nodes left`)
}
