import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as ex from "./exercise"

describe("Sink Composition", () => {
	it("exercise 1: filterAndCollect", async () => {
		const result = await Effect.runPromise(ex.filterAndCollect())
		expect(result).toEqual([2, 4, 6])
	})

	it("exercise 2: transformedSum", async () => {
		const result = await Effect.runPromise(ex.transformedSum())
		expect(result).toBe(20)
	})

	it("exercise 3: filterByPredicate", async () => {
		const result = await Effect.runPromise(ex.filterByPredicate())
		expect(result).toEqual([20, 25, 30])
	})

	it("exercise 4: firstElements", async () => {
		const result = await Effect.runPromise(ex.firstElements())
		expect(result).toEqual([1, 2, 3])
	})

	it("exercise 5: findFirst", async () => {
		const result = await Effect.runPromise(ex.findFirst())
		expect(result).toBe(100)
	})
})
