import { Effect, Schedule, Ref } from "effect"

/**
 * Exercise 1: repeatNTimes
 *
 * Create a Ref starting at 0, increment it once, then repeat 3 more times
 * using Schedule.recurs(3). Return the final value of the Ref.
 *
 * Expected result: 4 (1 initial + 3 repeats)
 */
export const repeatNTimes: Effect.Effect<number> = Effect.gen(function* () {
	// TODO: Implement
	return yield* Effect.succeed(0)
})

/**
 * Exercise 2: retryWithRecurs
 *
 * Create a Ref tracking attempt count. Build an effect that increments the Ref
 * and fails until the count reaches 3, then succeeds with the count.
 * Use Effect.retry with Schedule.recurs(5).
 *
 * Expected result: 3
 */
export const retryWithRecurs: Effect.Effect<number> = Effect.gen(function* () {
	// TODO: Implement
	return yield* Effect.succeed(0)
})

/**
 * Exercise 3: exponentialRetry
 *
 * Create an exponential back-off schedule starting at "10 millis",
 * capped at 3 retries using Schedule.compose(Schedule.recurs(3)).
 *
 * Return the schedule itself.
 */
export const exponentialRetry: Schedule.Schedule<number, unknown> = Schedule.recurs(0) // TODO: Replace with correct schedule

/**
 * Exercise 4: repeatWhile
 *
 * Create a Ref at 0, increment it, and repeat while the value is less than 5
 * using Schedule.whileOutput(n => n < 5).
 *
 * Expected result: 5
 */
export const repeatWhile: Effect.Effect<number> = Effect.gen(function* () {
	// TODO: Implement
	return yield* Effect.succeed(0)
})

/**
 * Exercise 5: retryOrElse
 *
 * Create an effect that always fails with "error". Retry it 2 times using
 * Schedule.recurs(2). If retries are exhausted, return "fallback" using
 * Effect.retryOrElse.
 *
 * Expected result: "fallback"
 */
export const retryOrElse: Effect.Effect<string> = Effect.gen(function* () {
	// TODO: Implement
	return yield* Effect.succeed("")
})
