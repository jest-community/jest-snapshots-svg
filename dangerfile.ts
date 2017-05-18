import { danger, fail, warn } from "danger"
import * as fs from "fs"

// Setup
const pr = danger.github.pr
const modified = danger.git.modified_files
const newFiles = danger.git.created_files
const bodyAndTitle = (pr.body + pr.title).toLowerCase()

// Custom modifiers for people submitting PRs to be able to say "skip this"
const trivialPR = bodyAndTitle.includes("trivial")
const acceptedNoTests = bodyAndTitle.includes("skip new tests")

const filesOnly = (file: string) => fs.existsSync(file) && fs.lstatSync(file).isFile()

// Custom subsets of known files
const modifiedAppFiles = modified.filter(p => p.includes("lib/")).filter(p => filesOnly(p))
const modifiedTestFiles = modified.filter(p => p.includes("_tests")).filter(p => filesOnly(p))

// When there are app-changes and it's not a PR marked as trivial, expect
// there to be CHANGELOG changes.
const changelogChanges = modified.includes("CHANGELOG.md")
if (modifiedAppFiles.length > 0 && !trivialPR && !changelogChanges) {
  fail("No CHANGELOG added.")
}

// No PR is too small to warrant a paragraph or two of summary
if (pr.body.length === 0) {
  fail("Please add a description to your PR.")
}
