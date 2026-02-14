import { Chunk, Effect, Ref, Sink, Stream } from "effect"

/**
 * TODO: Run Stream.make(1, 2, 3, 4, 5) into Sink.collectAll(),
 * then convert the resulting Chunk to an array with Chunk.toArray.
 * Expected: [1, 2, 3, 4, 5]
 */
export const collectAll = (): Effect.Effect<number[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}

/**
 * TODO: Run Stream.make(10, 20, 30) into Sink.sum.
 * Expected: 60
 */
export const sumElements = (): Effect.Effect<number> => {
	// Your code here
	return Effect.succeed(0) // Replace with correct implementation
}

/**
 * TODO: Run Stream.make("a", "b", "c", "d") into Sink.count.
 * Expected: 4
 */
export const countElements = (): Effect.Effect<number> => {
	// Your code here
	return Effect.succeed(0) // Replace with correct implementation
}

/**
 * TODO: Run Stream.make(1, 2, 3, 4, 5) into Sink.fold with:
 * - Initial value: 0
 * - Continue predicate: acc => acc < 10
 * - Step function: (acc, n) => acc + n
 * The fold should stop when the accumulator reaches 10 or more.
 * Expected: 10
 */
export const foldElements = (): Effect.Effect<number> => {
	// Your code here
	return Effect.succeed(0) // Replace with correct implementation
}

/**
 * TODO: Create a Ref<number[]>, run Stream.make(1, 2, 3) into
 * Sink.forEach that appends each element to the Ref.
 * Return the final Ref value.
 * Expected: [1, 2, 3]
 */
export const forEachSink = (): Effect.Effect<number[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}
