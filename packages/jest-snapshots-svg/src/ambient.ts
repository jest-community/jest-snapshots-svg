// Add our matcher to Jest's definitions

declare namespace jest {
  interface Matchers<R> {
    /** Checks and sets up SVG rendering for React Components. */
    toMatchSVGSnapshot(width: number, height: number): void;
  }
}
