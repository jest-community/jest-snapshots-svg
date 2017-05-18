import * as React from "react"
import { Text } from "react-native"
import * as renderer from "react-test-renderer"

import ourRenderer from "../"

describe("Fixtures", () => {
  it("does some simple JSX", () => {
    const artist = renderer.create(<Text />)
    ourRenderer(1024, 768, artist.toJSON())
    // expect(artist.toJSON()).toMatchSnapshot()
  })
})
