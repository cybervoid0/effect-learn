import { Effect, SubscriptionRef } from "effect"

/**
 * TODO: Create a SubscriptionRef initialized to 0,
 * get the initial value, and return it.
 *
 * Hint: SubscriptionRef.make, SubscriptionRef.get work like Ref.
 */
export const createSubRef: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation

/**
 * TODO: Create a SubscriptionRef initialized to "start",
 * set it to "end", then get and return the value.
 *
 * Hint: Use SubscriptionRef.set to update, SubscriptionRef.get to read.
 */
export const updateAndRead: Effect.Effect<string> = Effect.succeed("") // Replace with correct implementation

/**
 * TODO: Create a SubscriptionRef initialized to 0.
 * Fork a subscriber that takes 3 values from ref.changes.
 * Then set the ref to 1, 2, 3 in sequence.
 * Join the subscriber and return the collected values as a number[].
 *
 * Hint: Use Stream.take(3), Stream.runCollect, Chunk.toArray.
 * The subscriber sees the current value (0) plus updates.
 */
export const collectChanges: Effect.Effect<number[]> = Effect.succeed([]) // Replace with correct implementation

/**
 * TODO: Create a SubscriptionRef initialized to 0.
 * Create 2 subscribers, each taking 2 values from ref.changes.
 * Set the ref to 1, then 2.
 * Join both subscribers and check they received the same values.
 * Return true if both received identical arrays.
 *
 * Hint: Fork both subscribers before setting values.
 */
export const multipleSubscribers: Effect.Effect<boolean> = Effect.succeed(false) // Replace with correct implementation

/**
 * TODO: Create a SubscriptionRef initialized to "a".
 * Fork a subscriber that takes 4 values from ref.changes.
 * Set the ref to "b", "c", "d" in sequence.
 * Join the subscriber and return the collected values as a string[].
 *
 * Hint: The subscriber will see "a" (initial), "b", "c", "d".
 */
export const trackHistory: Effect.Effect<string[]> = Effect.succeed([]) // Replace with correct implementation
