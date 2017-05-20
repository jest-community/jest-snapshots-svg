# jest-snapshots-svg

Take a React Native component tree, and render it into an SVG.

```ts
// _tests/render.test.tsx

import * as React from "react"
import { Text } from "react-native"
import * as renderer from "react-test-renderer"
import "jest-snapshot-svg"

describe("Fixtures", () => {
  it("does some simple JSX", () => {
    const component = renderer.create(<Text />).toJSON()
    expect(component).toMatchSnapshot()
    expect(component).toMatchSVGSnapshot(480, 640)
  })
})
```

Would make:

```sh
src/_tests/
├── __snapshots__
│   ├── render.test.tsx.snap
│   └── render.test.tsx.svg
└── render.test.tsx
```

## Note:

This is not in production yet. So buyer's beware.

## TODO:

- **v0-0.5:** make it work
- **v0.5-1:** make it good
- **v1:** figure out how/if it should end up in jest
- **v2:** use iTerm to show the images inline
- **v3:** get vscode-jest to preview them inline
