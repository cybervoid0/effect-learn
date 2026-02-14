import { Effect, Ref } from "effect"

/**
 * Create a Ref initialized to 0, then read and return the value
 */
export const createAndGet: Effect.Effect<number> = Effect.gen(function* () {
	const ref = yield* Ref.make(0)
	return yield* Ref.get(ref)
})

/**
 * Create a Ref initialized to 0, set it to 42, then read and return
 */
export const setAndGet: Effect.Effect<number> = Effect.gen(function* () {
	const ref = yield* Ref.make(0)
	yield* Ref.set(ref, 42)
	return yield* Ref.get(ref)
})

/**
 * Create a Ref initialized to 10, use updateAndGet to add 5
 */
export const updateRef: Effect.Effect<number> = Effect.gen(function* () {
	const ref = yield* Ref.make(10)
	return yield* Ref.updateAndGet(ref, (n) => n + 5)
})

/**
 * Create a Ref initialized to "hello", modify to return length and store uppercased
 */
export const modifyRef: Effect.Effect<number> = Effect.gen(function* () {
	const ref = yield* Ref.make("hello")
	return yield* Ref.modify(ref, (s) => [s.length, s.toUpperCase()])
})

/**
 * Create a Ref initialized to 0, increment n times, return final value
 */
export const counter = (n: number): Effect.Effect<number> => {
	return Effect.gen(function* () {
		const ref = yield* Ref.make(0)
		yield* Effect.forEach(
			Array.from({ length: n }, (_, i) => i),
			() => Ref.update(ref, (count) => count + 1),
			{ discard: true },
		)
		return yield* Ref.get(ref)
	})
}
