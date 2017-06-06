declare namespace jest {
  interface Matchers {
    /** Checks and sets up SVG rendering for React Components. */
    toMatchSVGSnapshot(width: number, height: number): void;
  }
}
