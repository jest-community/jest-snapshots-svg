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
│   └── render.test.tsx-does-some-simple-jsx.svg
└── render.test.tsx
```

### Flaws

* Doesn't render text correctly - see [#11](https://github.com/orta/jest-snapshots-svg/issues/11)
* Doesn't render image - see [#18](https://github.com/orta/jest-snapshots-svg/issues/18)
* Not all flexbox attributes are supported - see [#19](https://github.com/orta/jest-snapshots-svg/issues/19)

### I want to work on this

OK, you need to clone this repo:

```sh
git clone https://github.com/orta/jest-snapshots-svg.git
```

There's the usual stuff, `yarn test` and `yarn lint`.

If you want to work against your own projects, then you need to set it up for linking and turn on watch mode.

```sh
yarn watch # starts a server, so make a new tab for the next bits
yarn link

cd [my_project]
yarn link jest-snapshot-svg
```

Now your project is using the dev version of this.

## TODO:

- **v0-0.5:** make it work
- **v0.5-1:** make it good
- **v1:** figure out how/if it should end up in jest
- **v2:** use iTerm to show the images inline
- **v3:** get vscode-jest to preview them inline
