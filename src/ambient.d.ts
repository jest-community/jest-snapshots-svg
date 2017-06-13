// Add our matcher to Jest's definitions

declare namespace jest {
  interface Matchers {
    /** Checks and sets up SVG rendering for React Components. */
    toMatchSVGSnapshot(width: number, height: number): void;
  }
}

// Initial stub of the Yoga type system
// Based on https://facebook.github.io/yoga/docs/api/javascript/
//

declare module "yoga-layout" {

  // https://github.com/facebook/yoga/blob/master/javascript/sources/YGEnums.js
  // and https://github.com/facebook/yoga/blob/master/gentest/gentest-javascript.js 5

  const UNDEFINED: number

  const ALIGN_COUNT = 8
  const ALIGN_AUTO = 0
  const ALIGN_FLEX_START = 1
  const ALIGN_CENTER = 2
  const ALIGN_FLEX_END = 3
  const ALIGN_STRETCH = 4
  const ALIGN_BASELINE = 5
  const ALIGN_SPACE_BETWEEN = 6
  const ALIGN_SPACE_AROUND = 7

  /** Do not use this in your code */
  enum Align {
    Count = 8,
    Auto = 0,
    FlexStart = 1,
    Center = 2,
    FlexEnd = 3,
    Stretch = 4,
    Baseline = 5,
    SpaceBetween = 6,
    SpaceAround = 7,
  }

  const DIMENSION_COUNT = 2
  const DIMENSION_WIDTH = 0
  const DIMENSION_HEIGHT = 1

  const DIRECTION_COUNT = 3
  const DIRECTION_INHERIT = 0
  const DIRECTION_LTR = 1
  const DIRECTION_RTL = 2

  /** Do not use this in your code */
  enum Direction {
    Count = 3,
    Inherit = 0,
    LTR = 1,
    RTL = 2,
  }

  const DISPLAY_COUNT = 2
  const DISPLAY_FLEX = 0
  const DISPLAY_NONE = 1

  /** Do not use this in your code */
  enum Display {
    Count = 2,
    Flex = 0,
    None = 1,
  }

  const EDGE_COUNT = 9
  const EDGE_LEFT = 0
  const EDGE_TOP = 1
  const EDGE_RIGHT = 2
  const EDGE_BOTTOM = 3
  const EDGE_START = 4
  const EDGE_END = 5
  const EDGE_HORIZONTAL = 6
  const EDGE_VERTICAL = 7
  const EDGE_ALL = 8

  /** Do not use this in your code */
  enum Edge {
    Count = 9,
    Left = 0,
    Top = 1,
    Right = 2,
    Bottom = 3,
    Start = 4,
    End = 5,
    Horizontal = 6,
    Vertical = 7,
    All = 8,
  }

  const EXPERIMENTAL_FEATURE_COUNT = 1
  const EXPERIMENTAL_FEATURE_WEB_FLEX_BASIS = 0

  const FLEX_DIRECTION_COUNT = 4
  const FLEX_DIRECTION_COLUMN = 0
  const FLEX_DIRECTION_COLUMN_REVERSE = 1
  const FLEX_DIRECTION_ROW = 2
  const FLEX_DIRECTION_ROW_REVERSE = 3

  /** Do not use this in your code */
  enum FlexDirection {
    Count = 4,
    Column = 0,
    ColumnReverse = 1,
    Row = 2,
    RowReverse = 3,
  }

  const JUSTIFY_COUNT = 5
  const JUSTIFY_FLEX_START = 0
  const JUSTIFY_CENTER = 1
  const JUSTIFY_FLEX_END = 2
  const JUSTIFY_SPACE_BETWEEN = 3
  const JUSTIFY_SPACE_AROUND = 4

  /** Do not use this in your code */
  enum Justify {
    Count = 5,
    FlexStart = 0,
    Center = 1,
    FlexEnd = 2,
    SpaceBetween = 3,
    SpaceAround = 3,
  }

  const LOG_LEVEL_COUNT = 6
  const LOG_LEVEL_ERROR = 0
  const LOG_LEVEL_WARN = 1
  const LOG_LEVEL_INFO = 2
  const LOG_LEVEL_DEBUG = 3
  const LOG_LEVEL_VERBOSE = 4
  const LOG_LEVEL_FATAL = 5

  const MEASURE_MODE_COUNT = 3
  const MEASURE_MODE_UNDEFINED = 0
  const MEASURE_MODE_EXACTLY = 1
  const MEASURE_MODE_AT_MOST = 2

  const NODE_TYPE_COUNT = 2
  const NODE_TYPE_DEFAULT = 0
  const NODE_TYPE_TEXT = 1

  const OVERFLOW_COUNT = 3
  const OVERFLOW_VISIBLE = 0
  const OVERFLOW_HIDDEN = 1
  const OVERFLOW_SCROLL = 2

  const POSITION_TYPE_COUNT = 2
  const POSITION_TYPE_RELATIVE = 0
  const POSITION_TYPE_ABSOLUTE = 1

  const PRINT_OPTIONS_COUNT = 3
  const PRINT_OPTIONS_LAYOUT = 1
  const PRINT_OPTIONS_STYLE = 2
  const PRINT_OPTIONS_CHILDREN = 4

  const UNIT_COUNT = 4
  const UNIT_UNDEFINED = 0
  const UNIT_POINT = 1
  const UNIT_PERCENT = 2
  const UNIT_AUTO = 3

  /** Do not use this in your code */
  enum Unit {
    Count = 3,
    Undefined = 0,
    Point = 1,
    Percent = 2,
    Auto = 3,
  }

  const WRAP_COUNT = 3
  const WRAP_NO_WRAP = 0
  const WRAP_WRAP = 1
  const WRAP_WRAP_REVERSE = 2

  /** Do not use this in your code */
  enum Wrap {
    Count = 3,
    No = 0,
    Wrap = 1,
    WrapReverse = 2,
  }

  class Layout {
    left: number
    right: number
    top: number
    bottom: number
    width: number
    height: number

    constructor(left: number, right: number, top: number, bottom: number, width: number, height: number)
    fromJS(expose: () => void)
    toString(): string
  }

  interface Sizable {
    width: number
    height: number
  }

  class Size {
    static fromJS(Sizeable): Size

    width: number
    height: number
    constructor(width: number, height: number)
    fromJS(expose: () => void)
    toString(): string
  }

  class Value {
    unit: Unit
    value: any

    constructor(unit: Unit, value: any)

    fromJS(expose: () => void)
    toString(): string
    valueOf(): any
  }

  interface NodeInstance {
    // setPosition(x: number, y:number)
    // setMargin()
    // setFlexBasis ()

    setWidth(width: number)
    setHeight(height: number)
    setMinWidth(width: number)
    setMinHeight(height: number)
    setMaxWidth(height: number)
    setMaxHeight(height: number)
    setPadding(edge: Edge, value: number)
    setMargin(edge: Edge, value: number) // maybe?
    setDisplay(display: Display)

    setFlex(ordinal: number)
    setFlexDirection(direct: FlexDirection)
    setJustifyContent(justify: Justify)
    setAlignItems(alignment: number)
    setAlignSelf(alignment: number)

    insertChild(node: NodeInstance, index: number)
    removeChild(node: NodeInstance)

    getComputedLeft(): number
    getComputedRight(): number
    getComputedTop(): number
    getComputedBottom(): number
    getComputedWidth(): number
    getComputedHeight(): number

    getChild(index: number): NodeInstance
    getChildCount(): number

    free()
    freeRecursive()

    // Triggers a layout pass, but doesn't give you the results
    calculateLayout(width: number, height: number, direction: Direction)
    // Generates the layout
    getComputedLayout(): Layout
  }

  interface NodeFactory {
    create: () => NodeInstance
    destroy(child: NodeInstance)
  }

  const Node: NodeFactory

  // Globals
  function getInstanceCount(): number
}

// import {ViewStyle} from "react-native"

// interface NodeInstance {
//   style: ViewStyle
// }
