import { Chunk, Effect, Option, Sink, Stream } from "effect"

/**
 * Exercise 1: filterAndCollect
 *
 * Use Sink.filterInput to keep only even numbers from [1,2,3,4,5,6],
 * then collect them into an array.
 *
 * Expected: [2, 4, 6]
 */
export const filterAndCollect = (): Effect.Effect<number[]> => {
	// TODO: Implement
	return Effect.succeed([])
}

/**
 * Exercise 2: transformedSum
 *
 * Use Sink.mapInput to double each number before summing [1,2,3,4].
 * Result: (1*2 + 2*2 + 3*2 + 4*2) = 20
 *
 * Expected: 20
 */
export const transformedSum = (): Effect.Effect<number> => {
	// TODO: Implement
	return Effect.succeed(0)
}

/**
 * Exercise 3: filterByPredicate
 *
 * Use Sink.filterInput to keep only values > 15 from [5, 10, 20, 25, 30],
 * then collect them.
 *
 * Expected: [20, 25, 30]
 */
export const filterByPredicate = (): Effect.Effect<number[]> => {
	// TODO: Implement
	return Effect.succeed([])
}

/**
 * Exercise 4: firstElements
 *
 * Use Sink.take(3) to get only the first 3 elements from a stream
 * of 1..10, then convert to array.
 *
 * Expected: [1, 2, 3]
 */
export const firstElements = (): Effect.Effect<number[]> => {
	// TODO: Implement
	return Effect.succeed([])
}

/**
 * Exercise 5: findFirst
 *
 * Use Sink.head to get the first element from [100, 200, 300].
 * Sink.head returns Option, so extract the value.
 *
 * Expected: 100
 */
export const findFirst = (): Effect.Effect<number> => {
	// TODO: Implement
	return Effect.succeed(0)
}
