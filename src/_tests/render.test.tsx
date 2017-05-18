import * as React from "react"
import { Text } from "react-native"
import * as renderer from "react-test-renderer"

describe("Fixtures", () => {
  it("does some simple JSX", () => {
    const artist = renderer.create(<Text />)
    expect(artist.toJSON()).toMatchSnapshot()
  })
})
