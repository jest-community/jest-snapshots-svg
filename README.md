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

It does this by emulating the rendering process of React Native by calling yoga-layout directly in your tests, then converting the output of the layout-pass into SVG items that can easy be previewed in GitHub.

👍

## What does this look like in principal?

<table>
  <tr>
    <th width="30%">Your code</th>
    <th width="30%">The final SVG</th>
  </tr>
  <tr>
    <td><p>Write your normal Jest snapshot tests, but use <code>toMatchSVGSnapshot</code></p>

    import * as React from "react"
    import { View } from "react-native"
    import * as renderer from "react-test-renderer"

    const squareStyle = (color) => 
      ({ width: 50, height: 50, backgroundColor: color })

    it("Renders three centered blocks", () => {
      const jsx =
        <View style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <View style={squareStyle("powderblue")}/>
          <View style={squareStyle("skyblue")}/>
          <View style={style={squareStyle("steelblue")}
        </View>

      const component = renderer.create(jsx).toJSON()
      expect(component).toMatchSVGSnapshot(320, 480)
    })

  </td>
    <th rowspan="9"><img width="322" height"482" src="https://github.com/orta/jest-snapshots-svg/blob/use-long-names/web/screenshot.png?raw=true"></th>
  </tr>
  <tr>
    <td>Then you run your tests. <code>yarn jest</code>.</td>
  </tr>
    <td><p>Then you get SVG output in the <code>__snapshots__</code> folder. <a href='https://github.com/orta/jest-snapshots-svg/blob/master/src/_tests/example_layouts/__snapshots__/_align-items.test.tsx-renders-three-vertically-horizontally-centeredblocks.svg?short_path=8153b80'>Example</a></p>
    
    <?xml version="1.0" encoding="UTF-8" ?>
      <svg width="320" height="480" ...>
      <rect type="View".../>
      <g transform='translate(0, 0)'>
        <rect type="View" .../>
        <rect type="View" .../>
        <rect type="View" .../>
      </g>
    </svg>

</td>
  </tr>
</table>


### Flaws

This is definitely pre-1.0, we only have it working on a few tests in [artsy/emission](https://github.com/artsy/emission/). Expect alpha quality style snapshots for a while, but more people working on it will mean we all get a better chance at it working out well.

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
