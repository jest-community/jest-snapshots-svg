# jest-snapshots-svg

Take a React Native component tree, and render it into an SVG.

```ts
// _tests/render.test.tsx

import * as React from "react"
import { Text } from "react-native"
import * as renderer from "react-test-renderer"
import "jest-snapshots-svg"

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
    import "jest-snapshots-svg"

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
          <View style={squareStyle("steelblue")}/>
        </View>

      const component = renderer.create(jsx).toJSON()
      expect(component).toMatchSVGSnapshot(320, 480)
    })

  </td>
    <th rowspan="9"><img width="322" height"482" src="https://github.com/jest-community/jest-snapshots-svg/blob/use-long-names/web/screenshot.png?raw=true"></th>
  </tr>
  <tr>
    <td>Then you run your tests. <code>yarn jest</code>.</td>
  </tr>
    <td><p>Then you get SVG output in the <code>__snapshots__</code> folder. <a href='https://github.com/jest-community/jest-snapshots-svg/blob/master/src/_tests/example_layouts/__snapshots__/_align-items.test.tsx-renders-three-vertically-horizontally-centeredblocks.svg?short_path=8153b80'>Example</a></p>

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

### Fonts

If you use `<Text />` elements, you must have access to the font files so we can lay the text out.
Usually, this just means having the font installed. However, if this goes wrong, this can be done
manually via the `loadFont` function, where you pass in the font file as a buffer. If you need a
fallback, you can use `addFontFallback`. If you just want to be able to specify the default
fontFamily to use, you can use `setDefaultFont`.

```js
import { addFontFallback, loadFont, setDefaultFont } from "jest-snapshots-svg"

setDefaultFont("DejaVu Sans")
loadFont(fs.readFileSync("your-font-file.ttf"))
addFontFallback("Your Font", "'Helvetica', 'Arial', sans-serif")
```

This should be able to determine the `fontFamily`, `fontWeight`, and `fontStyle`. However, if it's
wrong, or it failed, you can pass these in as a second argument.

```js
loadFont(fs.readFileSync("your-font-file.ttf"), {
  fontFamily: "Helvetica",
  fontWeight: "normal",
  fontStyle: "normal"
})
```

If you have a `.ttc` file (a collection of multiple files), and it fails to correctly guess the font
style parameters, you can provide a `postscriptName` in the style object to target a specific font.
Do this in combination with passing in the font style arguments. See more about this over at
[fontkit](https://github.com/devongovett/fontkit#api).

## Adding relative font path definitions to the output svg

An alternative way to load a font is to use the `addFontToSvg` function instead of the normal `loadFont`. This takes as input the path (can be a node_modules import reference) to load the font from, plus optionally the normal font style information that loadFont takes. Loading the font this way means that we can keep a reference to the file path that the font was loaded from, and then embed the path to the font into the svg in a css style definition.

```js
addFontToSvg("@expo/vector-icons/fonts/FontAwesome.ttf")
```

Any fonts loaded using `addFontToSvg` will be checked against the list of actual fonts used in Text styles in the component. Only those that have actually been used in the rendered component will be output into the svg.

### Using relative font paths with react-native-vector-icons and @expo/vector-icons

In order for the above to work with the vector icons, you will need to create a test mock file for these packages. The default output from react-test-renderer does not include the actual character codes to display, which means that it cannot be captured from the rendered component to add to the svg. The file should be added to the `__mocks__` directory _next to_ the node_modules directory, and should have the same name/path as the module it is replacing.

For a typical project with the node_modules directory in the project root directory you should create a file `<project_root>/__mocks__/@expo/vector-icons.js` (or ts if you are using typescript) for mocking @expo/vector-icons. For react-native-vector-icons the mock file should be `<project_root>/__mocks__/react-native-vector-icons.js`.

In the mock file, you need to set the render function to return a Text component, with the font style details set to match the icon font and the text itself set to the unicode reference for the particular character that should be displayed for that icon.

An example mock for @expo/vector-icons could be (written in typescript):

```js
import * as fs from "fs"
import { addFontToSvg } from "jest-snapshots-svg"
import * as React from "react"
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native"
import { IconProps } from "react-native-vector-icons/Icon"

const glyphmapDir = "@expo/vector-icons/vendor/react-native-vector-icons/glyphmaps"
const fontDir = "@expo/vector-icons/fonts"

export const createIconSet = (
  glyphMap: { [name: string]: string | number },
  fontFamily: string,
  fontFile?: string) =>
{
  const filename = require.resolve(`${fontDir}/${fontFamily}.ttf`)
  addFontToSvg(filename, { fontFamily, fontStyle: "normal", fontWeight: "normal" })

  class Icon extends React.Component<IconProps, any> {
    static loadFont() {
      console.log("called Icon:loadFont()")
    }
    static getImageSource() {
      console.log("called Icon.getImageSource()")
    }

    render() {
      const { name, size, color, style, ...props } = this.props

      let glyph = name ? glyphMap[name] : undefined
      if (typeof glyph === "number") {
        glyph = String.fromCodePoint(glyph);
      }

      const styleDefaults: TextStyle = {
        fontFamily,
        fontSize: size,
        fontWeight: "normal",
        fontStyle: "normal",
        color
      }

      return (
        <Text {...props} style={[styleDefaults, style]}>
          {`&#x${glyph
            .codePointAt(0)
            .toString(16)
            .toUpperCase()};`}
        </Text>
      );
    }
  }

  return Icon
}

export const createIconSetFromFontello = jest.fn()
export const createIconSetFromIcoMoon = jest.fn()

// If you know you're only going to use a few/one of these fonts, you can safely
// remove any you won't use.
export const Entypo = createIconSet(
  require(`${glyphmapDir}/Entypo.json`),
  "Entypo"
)
export const EvilIcons = createIconSet(
  require(`${glyphmapDir}/EvilIcons.json`),
  "EvilIcons"
)
export const Feather = createIconSet(
  require(`${glyphmapDir}/Feather.json`),
  "Feather"
)
export const FontAwesome = createIconSet(
  require(`${glyphmapDir}/FontAwesome.json`),
  "FontAwesome"
)
export const Foundation = createIconSet(
  require(`${glyphmapDir}/Foundation.json`),
  "Foundation"
)
export const Ionicons = createIconSet(
  require(`${glyphmapDir}/Ionicons.json`),
  "Ionicons"
)
export const MaterialCommunityIcons = createIconSet(
  require(`${glyphmapDir}/MaterialCommunityIcons.json`),
  "MaterialCommunityIcons"
)
export const MaterialIcons = createIconSet(
  require(`${glyphmapDir}/MaterialIcons.json`),
  "MaterialIcons"
)
export const Octicons = createIconSet(
  require(`${glyphmapDir}/Octicons.json`),
  "Octicons"
)
export const SimpleLineIcons = createIconSet(
  require(`${glyphmapDir}/SimpleLineIcons.json`),
  "SimpleLineIcons"
)
export const Zocial = createIconSet(
  require(`${glyphmapDir}/Zocial.json`),
  "Zocial"
)
```

For react-native-vector-icons, change the `glyphmapDir` and `fontDir` paths:

```js
const glyphmapDir = "react-native-vector-icons/glyphmaps"
const fontDir = "react-native-vector-icons/Fonts"
```

### Flaws

This is definitely pre-1.0, we only have it working on a few tests in [artsy/emission](https://github.com/artsy/emission/). Expect alpha quality style snapshots for a while, but more people working on it will mean we all get a better chance at it working out well.

* Doesn't render image - see [#18](https://github.com/jest-community/jest-snapshots-svg/issues/18)
* Not all flexbox attributes are supported - see [#19](https://github.com/jest-community/jest-snapshots-svg/issues/19)

### I want to work on this

OK, you need to clone this repo:

```sh
git clone https://github.com/jest-community/jest-snapshots-svg.git
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
