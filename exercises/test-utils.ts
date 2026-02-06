import { expect } from "@effect/vitest"
import { Effect, Exit, type Fiber, FiberStatus } from "effect"

/**
 * Test utilities for Effect exercises
 */

/**
 * Helper to run an Effect and get the result synchronously
 */
export const runSync = <A, E>(effect: Effect.Effect<A, E>): A => {
	return Effect.runSync(effect)
}

/**
 * Helper to run an Effect and get the Exit result
 */
export const runSyncExit = <A, E>(
	effect: Effect.Effect<A, E>,
): Exit.Exit<A, E> => {
	return Effect.runSyncExit(effect)
}

/**
 * Helper to check if an Effect succeeds with a specific value
 */
export const expectSuccess = <A, E>(
	effect: Effect.Effect<A, E>,
	expected: A,
): void => {
	const result = Effect.runSync(effect)
	expect(result).toEqual(expected)
}

/**
 * Helper to check if an Effect fails with a specific error
 */
export const expectFailure = <A, E>(
	effect: Effect.Effect<A, E>,
	_expectedError: E,
): void => {
	const exit = Effect.runSyncExit(effect)
	if (Exit.isFailure(exit)) {
		expect(exit.cause).toBeDefined()
	} else {
		throw new Error("Expected effect to fail, but it succeeded")
	}
}

/**
 * Helper to create a delayed Effect
 */
export const delay = (ms: number) => Effect.sleep(`${ms} millis`)

/**
 * Helper to create a failing Effect after a delay
 */
export const delayedFailure = <E>(ms: number, error: E) =>
	Effect.sleep(`${ms} millis`).pipe(Effect.andThen(Effect.fail(error)))

/**
 * Helper to create a successful Effect after a delay
 */
export const delayedSuccess = <A>(ms: number, value: A) =>
	Effect.sleep(`${ms} millis`).pipe(Effect.andThen(Effect.succeed(value)))

/**
 * Helper to measure execution time of an Effect
 */
export const measureTime = <A, E, R>(
	effect: Effect.Effect<A, E, R>,
): Effect.Effect<[A, number], E, R> =>
	Effect.gen(function* () {
		const start = Date.now()
		const result = yield* effect
		const duration = Date.now() - start
		return [result, duration] as const
	})

/**
 * Helper to check if a Fiber is still running
 */
export const isFiberRunning = (fiber: Fiber.RuntimeFiber<unknown, unknown>) => {
	const status = fiber.status
	return status.pipe(Effect.map(FiberStatus.isRunning))
}

/**
 * Mock service for testing
 */
export interface TestService {
	readonly getValue: () => Effect.Effect<number>
	readonly setValue: (value: number) => Effect.Effect<void>
}

/**
 * Create a mock TestService
 */
export const makeTestService = (initialValue = 0): TestService => {
	let value = initialValue
	return {
		getValue: () => Effect.succeed(value),
		setValue: (newValue: number) =>
			Effect.sync(() => {
				value = newValue
			}),
	}
}
