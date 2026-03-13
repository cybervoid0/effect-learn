# Semaphore

## Concept

A **Semaphore** is a concurrency primitive that limits the number of concurrent accesses to a shared resource. It manages a set of "permits" — a fiber must acquire a permit before proceeding and releases it when done.

### `Effect.makeSemaphore` - Create a semaphore
```typescript
const sem = yield* Effect.makeSemaphore(3)
// Semaphore with 3 permits
```

### `withPermits` - Run effect with acquired permits
The primary API. Acquires N permits before running the effect, releases them automatically on completion (even on failure or interruption):
```typescript
yield* sem.withPermits(1)(myEffect)
// Acquires 1 permit → runs myEffect → releases 1 permit
```

### Use as Mutex
A semaphore with 1 permit acts as a **mutex** (mutual exclusion lock) — only one fiber can enter the critical section at a time:
```typescript
const mutex = yield* Effect.makeSemaphore(1)
yield* mutex.withPermits(1)(criticalSection)
```

### Use as Connection Pool
A semaphore with N permits naturally models a resource pool:
```typescript
const pool = yield* Effect.makeSemaphore(5)
// At most 5 concurrent database queries
yield* pool.withPermits(1)(dbQuery)
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **basicPermit** - Create a semaphore(1), run `Effect.succeed(42)` inside `withPermits(1)`, return the result
2. **limitConcurrency** - Create a semaphore(2), run 5 concurrent tasks that each sleep briefly, track max concurrent count using Ref, return max (should be ≤ 2)
3. **mutualExclusion** - Create a semaphore(1) as mutex, protect a non-atomic read-yield-write on a Ref from 10 concurrent fibers, return final count (should be exactly 10)
4. **connectionPool** - Create a semaphore(3) simulating a pool, run 10 concurrent tasks, track max concurrent, return max (should be ≤ 3)

## Examples

```typescript
import { Effect, Ref } from "effect"

// Protecting a critical section
const protected = Effect.gen(function* () {
  const sem = yield* Effect.makeSemaphore(1)
  const ref = yield* Ref.make(0)
  yield* sem.withPermits(1)(
    Ref.update(ref, n => n + 1)
  )
  return yield* Ref.get(ref)
})

// Why semaphore matters: non-atomic operations
// Without semaphore, this read-yield-write loses updates:
const broken = Effect.gen(function* () {
  const ref = yield* Ref.make(0)
  // Fiber A reads 5, yields, Fiber B reads 5, yields
  // Fiber A writes 6, Fiber B writes 6 → lost update!
  const val = yield* Ref.get(ref)
  yield* Effect.yieldNow()
  yield* Ref.set(ref, val + 1)
})
```

## Hints

- `withPermits` handles acquire/release automatically — no need for manual cleanup
- A semaphore with 1 permit = mutex (mutual exclusion)
- Use `Ref.updateAndGet` to atomically increment and get the new value
- `Effect.yieldNow()` forces the current fiber to yield, useful for simulating race conditions
- Combine with `Effect.forEach(..., { concurrency: "unbounded" })` for concurrent execution

## Bonus

Try to:
- Verify that WITHOUT semaphore, `mutualExclusion` produces a count less than 10
- Use semaphore with `withPermits(N)` where N > 1 to require multiple permits at once
- Think about how you'd build a read-write lock: N permits for readers, all N permits for an exclusive writer
