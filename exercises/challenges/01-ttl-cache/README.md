# Challenge 1: TTL Cache

## Goal

Build an in-memory cache service where entries automatically expire
after a configurable time-to-live (TTL).

## Concepts Used

| Concept | From Level |
|---------|------------|
| `Ref<HashMap>` | 01 Basics, 07 State |
| `Context.Tag` + `Layer.effect` | 06 Services |
| `Data.TaggedError` | 02 Error Handling |
| `Effect.catchTag` | 02 Error Handling |
| `Effect.fork` + `Fiber` | 04 Concurrency |
| `Effect.sleep` | 04 Concurrency |
| `Effect.acquireRelease` / `addFinalizer` | 05 Resource Management |
| `Effect.scoped` | 05 Resource Management |

## Specification

### Types

```typescript
type CacheEntry<A> = {
  readonly value: A
  readonly expiresAt: number  // timestamp in ms
}
```

### Error

**CacheMiss** — tagged error with `key: string` field.
Thrown when `get` is called for a key that doesn't exist or has expired.

### Service: `TtlCache`

Tag: `"TtlCache"`, interface:

- `get: (key: string) => Effect<string, CacheMiss>`
  Returns the value if present **and not expired**. Expired → `CacheMiss`.

- `set: (key: string, value: string) => Effect<void>`
  Stores a value with expiration = `now + ttl`.

- `remove: (key: string) => Effect<void>`
  Removes a key from the cache.

- `size: Effect<number>`
  Returns count of **non-expired** entries.

### Layer: `ttlCacheLive`

`Layer<TtlCache, never, Scope>` — requires Scope because it starts a
background cleanup fiber.

Construction:
1. Accept `ttl` (milliseconds) as parameter
2. Create `Ref<HashMap<string, CacheEntry<string>>>` for state
3. Fork a **background fiber** that periodically (every `ttl / 2` ms)
   removes expired entries from the HashMap
4. Register a finalizer that interrupts the cleanup fiber on scope close
5. Return the `TtlCache` implementation

### Programs

**getOrSet** — get a cached value; if `CacheMiss`, compute the value,
store it, and return it.

**cachedLookup** — given an array of keys and a lookup function,
return results for all keys. Use the cache: hit → return cached,
miss → compute + cache + return. Run lookups in parallel.

## Hints

- `Date.now()` gives current timestamp — wrap in `Effect.sync(() => Date.now())`
- For the cleanup fiber: `Effect.forever(cleanup.pipe(Effect.delay(...)))`
- `HashMap.filter` can remove expired entries in one pass
- `Effect.addFinalizer` + `Fiber.interrupt` for cleanup on scope close
- `getOrSet` is just `get` + `catchTag("CacheMiss", () => set + return)`

## Expected Tests

- `get` returns value before TTL expires
- `get` fails with `CacheMiss` after TTL expires
- `set` overwrites existing entries
- `size` only counts non-expired entries
- `getOrSet` computes only on miss
- `cachedLookup` runs lookups in parallel
- Background cleanup removes expired entries
- Cleanup fiber is interrupted when scope closes
