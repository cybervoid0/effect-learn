import { Effect, Queue } from "effect"

/**
 * TODO: Create a bounded queue with capacity 10.
 * Offer "hello", then take and return it.
 *
 * Hint: Queue.bounded<string>(10), Queue.offer, Queue.take.
 */
export const offerAndTake: Effect.Effect<string> = Effect.succeed("") // Replace with correct implementation

/**
 * TODO: Create an unbounded queue.
 * Offer 1, 2, 3. Then takeAll and convert the Chunk to an array.
 * Return the array.
 *
 * Hint: Queue.unbounded<number>(), Queue.offer for each, Queue.takeAll, Chunk.toArray.
 */
export const multipleItems: Effect.Effect<readonly number[]> = Effect.succeed([]) // Replace with correct implementation

/**
 * TODO: Create a bounded queue with capacity 5.
 * Offer 3 items (e.g. "a", "b", "c").
 * Return the queue size.
 *
 * Hint: Queue.size returns Effect<number>.
 */
export const queueSize: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation

/**
 * TODO: Create a bounded queue.
 * Fork a producer that offers numbers 1 through 5.
 * Fork a consumer that takes 5 items and sums them.
 * Join the consumer and return the sum.
 *
 * Hint: The consumer should take items one at a time in a loop.
 */
export const producerConsumer: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation

/**
 * TODO: Create a bounded queue with capacity 2.
 * Offer 2 items (1 and 2) which fills the queue.
 * Fork an offer of a 3rd item (3) -- this will block due to backpressure.
 * Take item 1, then take item 2, then take item 3 (unblocks the forked offer).
 * Return all three items as [first, second, third].
 *
 * Hint: The 3rd offer blocks until you take from the queue.
 */
export const boundedBackpressure: Effect.Effect<readonly [number, number, number]> = Effect.succeed([0, 0, 0] as const) // Replace with correct implementation
