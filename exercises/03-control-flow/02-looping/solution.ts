import { Effect } from "effect"

/**
 * Calculate sum of numbers from 1 to n using Effect.loop
 */
export const sumNumbers = (n: number): Effect.Effect<number> => {
	return Effect.loop(
		1, // start at 1
		{
			while: (i) => i <= n,
			step: (i) => i + 1,
			body: (i) => Effect.succeed(i),
			discard: false,
		},
	).pipe(Effect.map((numbers) => numbers.reduce((sum, n) => sum + n, 0)))
}

/**
 * Calculate factorial of n using Effect.iterate
 */
export const factorial = (n: number): Effect.Effect<number> => {
	return Effect.iterate(
		{ current: 1, acc: 1 },
		{
			while: ({ current }) => current <= n,
			body: ({ current, acc }) =>
				Effect.succeed({ current: current + 1, acc: acc * current }),
		},
	).pipe(Effect.map(({ acc }) => acc))
}

/**
 * Process array of numbers - double each number
 */
export const processArray = (numbers: number[]): Effect.Effect<number[]> => {
	return Effect.forEach(numbers, (n) => Effect.succeed(n * 2))
}

/**
 * Filter even numbers and double them
 */
export const filterAndMap = (numbers: number[]): Effect.Effect<number[]> => {
	const evenNumbers = numbers.filter((n) => n % 2 === 0)
	return Effect.forEach(evenNumbers, (n) => Effect.succeed(n * 2))
}

/**
 * Process array sequentially vs parallel
 */
export const sequentialVsParallel = (
	numbers: number[],
): Effect.Effect<[number[], number[]]> => {
	const sequential = Effect.forEach(numbers, (n) => Effect.succeed(n * 2), {
		concurrency: 1,
	})

	const parallel = Effect.forEach(numbers, (n) => Effect.succeed(n * 2), {
		concurrency: "unbounded",
	})

	return Effect.all([sequential, parallel])
}
