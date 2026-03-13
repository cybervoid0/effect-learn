import { Effect, Ref } from "effect"

/**
 * TODO: Create a semaphore with 1 permit.
 * Use withPermits(1) to run Effect.succeed(42).
 * Return the result.
 *
 * Hint: Effect.makeSemaphore(n), sem.withPermits(n)(effect).
 */
export const basicPermit: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation

/**
 * TODO: Create a semaphore with 2 permits.
 * Run 5 concurrent tasks. Each task should:
 *   1. Atomically increment a "current" Ref (Ref.updateAndGet)
 *   2. Update a "max" Ref with Math.max(max, current)
 *   3. Sleep for 10 millis
 *   4. Decrement the "current" Ref
 * All tasks must go through sem.withPermits(1).
 * Return the max concurrent count (should be ≤ 2).
 *
 * Hint: Use Effect.forEach with { concurrency: "unbounded" }.
 */
export const limitConcurrency: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation

/**
 * TODO: Create a semaphore with 1 permit (mutex).
 * Create a Ref<number> initialized to 0.
 * Run 10 concurrent fibers, each doing a NON-ATOMIC increment:
 *   1. Read current value from Ref
 *   2. yield* Effect.yieldNow()  (forces context switch)
 *   3. Write (current + 1) to Ref
 * Protect this entire sequence with sem.withPermits(1).
 * Return the final count (should be exactly 10).
 *
 * Without the semaphore, concurrent read-yield-write would lose updates.
 */
export const mutualExclusion: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation

/**
 * TODO: Create a semaphore with 3 permits (simulating a connection pool).
 * Run 10 concurrent tasks. Each task should:
 *   1. Atomically increment a "current" Ref
 *   2. Update a "max" Ref with Math.max(max, current)
 *   3. Sleep for 5 millis
 *   4. Decrement the "current" Ref
 * All tasks must go through sem.withPermits(1).
 * Return the max concurrent count (should be ≤ 3).
 */
export const connectionPool: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation
