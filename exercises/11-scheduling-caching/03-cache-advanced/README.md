# Cache Advanced

## Concept

The `Cache` module provides a full-featured, concurrent-safe cache with configurable capacity and time-to-live (TTL). Unlike `Effect.cached` which memoizes a single effect, `Cache` is a key-value store where each key maps to a lazily-computed, cached value.

Key API:
- **`Cache.make({ capacity, timeToLive, lookup })`** - Creates a cache with a maximum number of entries, a TTL for each entry, and a lookup function that computes the value for a given key.
- **`cache.get(key)`** - Retrieves the value for a key. If the key is not in the cache, the lookup function is called to compute it.

The cache automatically handles:
- **Deduplication**: If multiple fibers request the same key simultaneously, the lookup runs only once.
- **Eviction**: When the cache is full, the least recently accessed entries are evicted.
- **Expiration**: Entries older than the TTL are recomputed on next access.
- **Error caching**: Failed lookups are also cached (and retried on next access after TTL).

## Assignment

Implement the following functions in `exercise.ts`:

1. **`createBasicCache`** - Create a cache with capacity 100, TTL `"1 hour"`, and a lookup that converts a number to its string representation. Get the value for key 42 and return it.
2. **`cacheLookup`** - Create a cache with a Ref tracking lookup calls. Get the same key twice. Return the value and the call count (should be 1 since the second call uses the cache).
3. **`cacheMultipleKeys`** - Create a cache and get values for keys 1, 2, and 3. Return all three values as a tuple.
4. **`cacheCapacity`** - Create a cache with capacity 2. Get keys 1, 2, 3 (evicts 1). Get key 1 again (triggers re-lookup). Track total lookups and return the count.
5. **`cacheWithErrors`** - Create a cache whose lookup fails for negative keys. Get a positive key (succeeds) and a negative key (fails). Return the success value and whether the negative key failed.

## Examples

```typescript
import { Cache, Effect } from "effect"

const program = Effect.gen(function* () {
  const cache = yield* Cache.make({
    capacity: 100,
    timeToLive: "1 hour",
    lookup: (key: number) => Effect.succeed(`value-${key}`)
  })

  const value = yield* cache.get(42)
  // value === "value-42"
})
```

## Hints

- `Cache.make` returns an `Effect` that must be yielded to get the cache instance.
- The `lookup` function receives the key and must return an `Effect`.
- Use `Effect.catchAll` or `Effect.either` to handle cache lookup errors gracefully in tests.
- Cache eviction is based on capacity -- when full, inserting a new key evicts the least recently used entry.

## Bonus

- Explore `cache.refresh(key)` to proactively recompute a value without waiting for TTL expiration.
- Try `Cache.makeWith` to vary TTL based on the lookup result.
