import { Array as A, Effect as E } from "effect"

/**
 * TODO: Calculate sum of numbers from 1 to n using Effect.loop
 */
export const sumNumbers = (n: number): E.Effect<number> => {
	// Your code here
	return E.loop(1, {
		while: x => x <= n,
		step: x => x + 1,
		body: x => E.succeed(x),
	}).pipe(E.map(A.reduce(0, (acc, a) => acc + a)))
}

/**
 * TODO: Calculate factorial of n using Effect.iterate
 */
export const factorial = (n: number): E.Effect<number> =>
	E.iterate(
		{ i: 1, acc: 1 },
		{
			while: ({ i }) => i <= n,
			body: ({ acc, i }) => E.succeed({ i: i + 1, acc: acc * i }),
		},
	).pipe(E.map(({ acc }) => acc))

/**
 * TODO: Process array of numbers - double each number
 * Use Effect.forEach
 */
export const processArray = (numbers: number[]): E.Effect<number[]> =>
	E.forEach(numbers, n => E.succeed(n * 2), { concurrency: "unbounded" })
/**
 * TODO: Filter even numbers and double them
 * Use Effect.forEach
 * Hint: You can filter before forEach or use conditional logic inside
 */

export const filterAndMap = (numbers: number[]): E.Effect<number[]> =>
	E.forEach(
		A.filter(numbers, n => n % 2 === 0),
		even => E.succeed(even * 2),
		{ concurrency: "unbounded" },
	)

/**
 * TODO: Process array sequentially vs parallel
 * Return tuple [sequentialResult, parallelResult]
 * Each element should be processed with Effect.succeed(n * 2)
 * Sequential: concurrency: 1
 * Parallel: concurrency: "unbounded"
 */
export const sequentialVsParallel = (
	numbers: number[],
): E.Effect<[number[], number[]]> => {
	// Your code here
	return E.gen(function* () {
		const sequentialResult = E.forEach(numbers, n => E.succeed(n * 2), {
			concurrency: 1,
		})
		const parallelResult = E.forEach(numbers, n => E.succeed(n * 2), {
			concurrency: "unbounded",
		})
		return yield* E.all([sequentialResult, parallelResult], {
			concurrency: "unbounded",
		})
	})
}
