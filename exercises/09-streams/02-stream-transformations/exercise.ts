import { Chunk, Effect, Stream } from "effect"

/**
 * TODO: Create a stream of 1, 2, 3 and map each element to double
 * its value. Collect and return as a readonly array.
 * Expected: [2, 4, 6]
 */
export const mapStream = (): Effect.Effect<readonly number[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}

/**
 * TODO: Create a stream from 1 to 10, filter to keep only even numbers.
 * Collect and return as a readonly array.
 * Expected: [2, 4, 6, 8, 10]
 */
export const filterStream = (): Effect.Effect<readonly number[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}

/**
 * TODO: Create a stream from 1 to 100, take only the first 5 elements.
 * Collect and return as a readonly array.
 * Expected: [1, 2, 3, 4, 5]
 */
export const takeFromStream = (): Effect.Effect<readonly number[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}

/**
 * TODO: Create a stream from 1 to 10, drop the first 7 elements.
 * Collect and return as a readonly array.
 * Expected: [8, 9, 10]
 */
export const dropFromStream = (): Effect.Effect<readonly number[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}

/**
 * TODO: Create a stream from 1 to 20, filter even numbers,
 * square each one (x * x), and take the first 3 results.
 * Collect and return as a readonly array.
 * Expected: [4, 16, 36]
 */
export const chainTransformations = (): Effect.Effect<readonly number[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}
