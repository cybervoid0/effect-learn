import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("02-looping", () => {
\tit("should work correctly", () => {
\t\tconst result = Effect.runSync(Exercise.solution)
\t\texpect(result).toBeDefined()
\t})
})
