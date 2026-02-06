import { Effect } from "effect"

/**
 * TODO: Calculate sum of numbers from 1 to n using Effect.loop
 */
export const sumNumbers = (n: number): Effect.Effect<number> => {
	// Your code here
	return Effect.succeed(0) // Replace with correct implementation
}

/**
 * TODO: Calculate factorial of n using Effect.iterate
 */
export const factorial = (n: number): Effect.Effect<number> => {
	// Your code here
	return Effect.succeed(0) // Replace with correct implementation
}

/**
 * TODO: Process array of numbers - double each number
 * Use Effect.forEach
 */
export const processArray = (
	numbers: number[],
): Effect.Effect<number[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}

/**
 * TODO: Filter even numbers and double them
 * Use Effect.forEach
 * Hint: You can filter before forEach or use conditional logic inside
 */
export const filterAndMap = (
	numbers: number[],
): Effect.Effect<number[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}

/**
 * TODO: Process array sequentially vs parallel
 * Return tuple [sequentialResult, parallelResult]
 * Each element should be processed with Effect.succeed(n * 2)
 * Sequential: concurrency: 1
 * Parallel: concurrency: "unbounded"
 */
export const sequentialVsParallel = (
	numbers: number[],
): Effect.Effect<[number[], number[]]> => {
	// Your code here
	return Effect.succeed([[], []]) // Replace with correct implementation
}
