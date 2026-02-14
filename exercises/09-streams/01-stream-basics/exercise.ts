import { Chunk, Effect, Stream } from "effect"

/**
 * TODO: Create a stream emitting 1, 2, 3 using Stream.make,
 * run it with Stream.runCollect, and convert to a readonly array
 * using Chunk.toReadonlyArray.
 */
export const createSimpleStream = (): Effect.Effect<readonly number[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}

/**
 * TODO: Create a stream from the given array using Stream.fromIterable,
 * run it with Stream.runCollect, and return as a readonly array.
 */
export const streamFromArray = (
	items: readonly string[],
): Effect.Effect<readonly string[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}

/**
 * TODO: Create a stream of integers from 1 to 10 (inclusive) using
 * Stream.range, run it, and return as a readonly array.
 */
export const rangeStream = (): Effect.Effect<readonly number[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}

/**
 * TODO: Create an empty stream using Stream.empty, run it, and
 * return as a readonly array.
 */
export const emptyStream = (): Effect.Effect<readonly never[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}

/**
 * TODO: Create a single-element stream from Effect.succeed(42) using
 * Stream.fromEffect, run it, and return as a readonly array.
 */
export const streamFromEffect = (): Effect.Effect<readonly number[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}
