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
	const ref = yield* Ref.make(0)
	yield* Ref.update(ref, (n) => n + 1).pipe(
		Effect.repeat(Schedule.recurs(3))
	)
	return yield* Ref.get(ref)
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
	const attempts = yield* Ref.make(0)
	const result = yield* Effect.gen(function* () {
		const count = yield* Ref.updateAndGet(attempts, (n) => n + 1)
		if (count < 3) {
			return yield* Effect.fail("not yet" as const)
		}
		return count
	}).pipe(Effect.retry(Schedule.recurs(5)))
	return result
})

/**
 * Exercise 3: exponentialRetry
 *
 * Create an exponential back-off schedule starting at "10 millis",
 * capped at 3 retries using Schedule.compose(Schedule.recurs(3)).
 *
 * Return the schedule itself.
 */
export const exponentialRetry: Schedule.Schedule<number, unknown> = Schedule.exponential("10 millis").pipe(
	Schedule.compose(Schedule.recurs(3))
)

/**
 * Exercise 4: repeatWhile
 *
 * Create a Ref at 0, increment it, and repeat while the value is less than 5
 * using Schedule.whileOutput(n => n < 5).
 *
 * Expected result: 5
 */
export const repeatWhile: Effect.Effect<number> = Effect.gen(function* () {
	const ref = yield* Ref.make(0)
	yield* Ref.updateAndGet(ref, (n) => n + 1).pipe(
		Effect.repeat(Schedule.whileOutput((n: number) => n < 5))
	)
	return yield* Ref.get(ref)
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
	const result = yield* Effect.fail("error" as const).pipe(
		Effect.retryOrElse(
			Schedule.recurs(2),
			() => Effect.succeed("fallback" as const)
		)
	)
	return result
})
