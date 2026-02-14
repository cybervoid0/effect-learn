import { describe, expect, it } from "@effect/vitest"
import { Effect, SynchronizedRef } from "effect"
import * as Exercise from "./exercise"

describe("02-synchronized-ref", () => {
	describe("createSyncRef", () => {
		it("should return 'initial' from a newly created SynchronizedRef", async () => {
			const result = await Effect.runPromise(Exercise.createSyncRef)
			expect(result).toBe("initial")
		})
	})

	describe("effectfulUpdate", () => {
		it("should return 10 after effectfully adding 10 to SynchronizedRef(0)", async () => {
			const result = await Effect.runPromise(Exercise.effectfulUpdate)
			expect(result).toBe(10)
		})
	})

	describe("effectfulModify", () => {
		it("should return 5 (length of 'hello') from modifyEffect", async () => {
			const result = await Effect.runPromise(Exercise.effectfulModify)
			expect(result).toBe(5)
		})
	})

	describe("safeIncrement", () => {
		it("should increment the ref by 1", async () => {
			const result = await Effect.runPromise(
				Effect.gen(function* () {
					const ref = yield* SynchronizedRef.make(10)
					return yield* Exercise.safeIncrement(ref)
				}),
			)
			expect(result).toBe(11)
		})

		it("should increment from 0 to 1", async () => {
			const result = await Effect.runPromise(
				Effect.gen(function* () {
					const ref = yield* SynchronizedRef.make(0)
					return yield* Exercise.safeIncrement(ref)
				}),
			)
			expect(result).toBe(1)
		})
	})

	describe("concurrentUpdates", () => {
		it("should return 10 after 10 concurrent increments", async () => {
			const result = await Effect.runPromise(Exercise.concurrentUpdates)
			expect(result).toBe(10)
		})
	})
})
