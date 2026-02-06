import { Effect } from "effect"

/**
 * Double the value of an Effect
 */
export const doubleValue = (
	effect: Effect.Effect<number>,
): Effect.Effect<number> => {
	return effect.pipe(Effect.map((n) => n * 2))
}

/**
 * Chain two Effects together
 */
export const chainEffects = (
	first: Effect.Effect<number>,
	double: (n: number) => Effect.Effect<number>,
): Effect.Effect<number> => {
	return first.pipe(Effect.flatMap(double))
}

/**
 * Transform a number Effect to a string Effect
 */
export const transformToString = (
	effect: Effect.Effect<number>,
): Effect.Effect<string> => {
	return effect.pipe(Effect.map((n) => n.toString()))
}

/**
 * Log the value and return it unchanged
 */
export const logAndReturn = <A>(effect: Effect.Effect<A>): Effect.Effect<A> => {
	return effect.pipe(Effect.tap((value) => Effect.log(value)))
}

/**
 * Complex composition
 */
export const calculateTotal = (n: number): Effect.Effect<string> => {
	return Effect.succeed(n).pipe(
		Effect.map((x) => x + 10),
		Effect.map((x) => x * 2),
		Effect.map((x) => `Result: ${x}`),
	)
}
