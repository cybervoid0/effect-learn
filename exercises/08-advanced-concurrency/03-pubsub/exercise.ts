import { Effect, PubSub, Queue } from "effect"

/**
 * TODO: Create a bounded PubSub<string> with capacity 10.
 * Subscribe to it, publish "hello", take from the subscription queue.
 * Return the received message.
 *
 * Hint: PubSub.subscribe is scoped — wrap everything in Effect.scoped.
 * Subscribe BEFORE publishing, otherwise the message is lost.
 */
export const publishAndReceive: Effect.Effect<string> = Effect.succeed("") // Replace with correct implementation

/**
 * TODO: Create a bounded PubSub<string> with capacity 10.
 * Create 2 subscribers, then publish "msg" once.
 * Both subscribers should receive the same message.
 * Return [sub1msg, sub2msg].
 *
 * Hint: Both subscriptions must be active before publishing.
 */
export const multipleSubscribers: Effect.Effect<readonly [string, string]> =
	Effect.succeed(["", ""] as const) // Replace with correct implementation

/**
 * TODO: Create a bounded PubSub<number> with capacity 10.
 * Subscribe, then publish numbers 1, 2, 3 individually.
 * Take 3 items from the subscription and return as an array.
 * Expected: [1, 2, 3]
 *
 * Hint: Use Queue.take for each item, or a loop.
 */
export const publishMany: Effect.Effect<readonly number[]> = Effect.succeed([]) // Replace with correct implementation

/**
 * TODO: Create a bounded PubSub<string> with capacity 10.
 * Create 3 subscribers. Publish "broadcast" once.
 * Each subscriber takes one message.
 * Return the count of subscribers that received "broadcast".
 * Expected: 3
 *
 * Hint: Collect messages from all subscribers, then count.
 */
export const fanOut: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation

/**
 * TODO: Create a bounded PubSub<number> with capacity 10.
 * Subscribe first, then fork a publisher that publishes 1 through 5.
 * The consumer takes 5 items and returns their sum.
 * Expected: 15
 *
 * Hint: Subscribe BEFORE forking the publisher to avoid losing messages.
 * The consumer should take items in a loop (or use Effect.forEach).
 */
export const pubsubWithProcessing: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation
