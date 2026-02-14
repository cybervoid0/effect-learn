import { Effect, Metric, Ref, Schedule } from "effect"

/**
 * Create a counter, increment it 3 times, return 3
 */
export const incrementCounter: Effect.Effect<number> = Effect.gen(function* () {
	const counter = Metric.counter("request_count")
	yield* Metric.increment(counter)
	yield* Metric.increment(counter)
	yield* Metric.increment(counter)
	return 3
})

/**
 * Create a gauge, set it to 36.6, return 36.6
 */
export const setGauge: Effect.Effect<number> = Effect.gen(function* () {
	const gauge = Metric.gauge("temperature")
	yield* gauge.pipe(Metric.set(36.6))
	return 36.6
})

/**
 * Create a histogram, track value 42, return 42
 */
export const trackWithHistogram: Effect.Effect<number> = Effect.gen(function* () {
	const histogram = Metric.histogram("response_time", {
		boundaries: Metric.Histogram.Boundaries.linear({ start: 0, width: 10, count: 10 }),
	})
	yield* histogram.pipe(Metric.update(42))
	return 42
})

/**
 * Create a tagged counter, increment it, return "tagged"
 */
export const taggedCounter: Effect.Effect<string> = Effect.gen(function* () {
	const counter = Metric.counter("http_requests").pipe(
		Metric.tagged("method", "GET"),
	)
	yield* Metric.increment(counter)
	return "tagged"
})

/**
 * Count effect runs with a counter and Ref
 */
export const countAndReturn: Effect.Effect<number> = Effect.gen(function* () {
	const counter = Metric.counter("run_count")
	const ref = yield* Ref.make(0)
	yield* Effect.gen(function* () {
		yield* Metric.increment(counter)
		yield* Ref.update(ref, (n) => n + 1)
	}).pipe(Effect.repeat(Schedule.recurs(4)))
	return yield* Ref.get(ref)
})
