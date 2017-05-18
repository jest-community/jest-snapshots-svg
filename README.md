# jest-snapshots-svg

*Aim:* Take a React Native component tree, and render it into an SVG.

```ts
// _tests/render.test.tsx

import * as React from "react"
import { Text } from "react-native"
import * as renderer from "react-test-renderer"

describe("Fixtures", () => {
  it("does some simple JSX", () => {
    const artist = renderer.create(<Text />)
    \expect(artist.toJSON()).toMatchSnapshot()

    expect(artist.toJSON()).toMatchSVGSnapshot(1024, 768)
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


## TODO:

*v1:* make it work
*v2:* use iTerm to show the images inline
*v3:* get vscode-jest to preview them inline
