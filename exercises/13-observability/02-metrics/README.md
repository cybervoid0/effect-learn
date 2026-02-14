# Metrics

## Concept

Effect includes a built-in metrics system that lets you instrument your application with counters, gauges, and histograms without pulling in external libraries. Metrics are first-class values that you create and then use as effects.

Key metrics APIs:
- `Metric.counter` - monotonically increasing counter (e.g., request count)
- `Metric.gauge` - point-in-time measurement (e.g., temperature, active connections)
- `Metric.histogram` - distribution of values (e.g., response times)
- `Metric.increment` / `Metric.set` / `Metric.update` - modify metric values
- `Metric.tagged` - attach dimensional tags to metrics

Metrics are defined once and can be used across your program. They compose naturally with Effect pipelines.

## Assignment

Implement the following functions in `exercise.ts`:

1. **`incrementCounter`** - Create a counter named "request_count", increment it 3 times, and return 3.
2. **`setGauge`** - Create a gauge named "temperature", set it to 36.6, and return 36.6.
3. **`trackWithHistogram`** - Create a histogram with boundaries, use it to track the value 42, and return 42.
4. **`taggedCounter`** - Create a counter "http_requests" with tag `method: "GET"`, increment it, and return "tagged".
5. **`countAndReturn`** - Create a counter that tracks how many times an effect runs, use `Effect.repeat` to run 5 times, return the repeat count (5).

## Examples

```typescript
import { Effect, Metric } from "effect"

// Create and use a counter
const myCounter = Metric.counter("my_counter")
const program = Metric.increment(myCounter)

// Create and set a gauge
const myGauge = Metric.gauge("cpu_usage")
const setUsage = myGauge.pipe(Metric.set(75.5))

// Tag a metric
const tagged = myCounter.pipe(Metric.tagged("env", "production"))
```

## Hints

- `Metric.counter("name")` creates a counter. Use `Metric.increment(counter)` to bump it.
- `Metric.gauge("name")` creates a gauge. Use `gauge.pipe(Metric.set(value))` to set its value.
- `Metric.histogram("name", { boundaries: Metric.Histogram.Boundaries.linear({ start: 0, width: 10, count: 10 }) })` creates a histogram.
- Use `Metric.tagged("key", "value")` to add tags to any metric.
- `Effect.repeat(effect, Schedule.recurs(n))` runs the effect n additional times (n+1 total).

## Bonus

- Try using `Metric.trackDuration` to measure how long an effect takes.
- Explore `Metric.summary` for percentile-based metrics.
