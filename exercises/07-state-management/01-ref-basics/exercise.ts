import { Effect as E, Ref } from "effect"

/**
 * TODO: Create a Ref initialized to 0, then read and return the value.
 *
 * Hint: Use Ref.make to create, Ref.get to read.
 */

export const createAndGet: E.Effect<number> = Ref.make(0).pipe(
	E.flatMap(Ref.get),
)

/**
 * TODO: Create a Ref initialized to 0, set it to 42, then read and return.
 *
 * Hint: Use Ref.make, Ref.set, and Ref.get.
 */
export const setAndGet: E.Effect<number> = E.gen(function* () {
	const ref = yield* Ref.make(0)
	yield* Ref.set(ref, 42)
	return yield* Ref.get(ref)
})

/**
 * TODO: Create a Ref initialized to 10, use Ref.updateAndGet to add 5.
 * Return the result of updateAndGet.
 *
 * Hint: Ref.updateAndGet applies a function and returns the new value.
 */
export const updateRef: E.Effect<number> = E.gen(function* () {
	const ref = yield* Ref.make(10)
	return yield* Ref.updateAndGet(ref, val => val + 5)
})

/**
 * TODO: Create a Ref initialized to "hello".
 * Use Ref.modify to return the string's length and store the uppercased string.
 *
 * Hint: Ref.modify takes a function that returns [returnValue, newState].
 */

export const modifyRef: E.Effect<number> = Ref.make("hello").pipe(
	E.flatMap(Ref.modify(str => [str.length, str.toUpperCase()])),
)

/**
 * TODO: Create a Ref initialized to 0.
 * Increment it n times using Effect.forEach over Array.from({ length: n }).
 * Return the final value.
 *
 * Hint: Use Ref.update inside Effect.forEach, then Ref.get at the end.
 */
export const counter = (n: number): E.Effect<number> => {
	// Your code here
	return E.gen(function* () {
		const ref = yield* Ref.make(0)
		const ran = Array.from({ length: n })
		yield* E.forEach(ran, () => Ref.update(ref, b => b + 1))
		return yield* Ref.get(ref)
	})
}
