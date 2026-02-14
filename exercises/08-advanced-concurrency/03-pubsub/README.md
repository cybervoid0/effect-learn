# PubSub

## Concept

A **PubSub** (publish-subscribe) is a concurrent data structure that broadcasts messages to multiple subscribers.
Unlike a `Queue` where each message goes to exactly one consumer, a `PubSub` delivers every published message to ALL active subscribers.

### `PubSub.bounded` - Create a bounded PubSub
```typescript
const pubsub = yield* PubSub.bounded<string>(10)
// PubSub<string> with capacity 10
```

### `PubSub.publish` - Publish a message
Sends a message to all current subscribers:
```typescript
yield* PubSub.publish(pubsub, "hello")
// All subscribers will receive "hello"
```

### `PubSub.subscribe` - Subscribe to messages
Returns a scoped `Queue` that receives all published messages.
Must be used inside `Effect.scoped`:
```typescript
yield* Effect.scoped(
  Effect.gen(function* () {
    const sub = yield* PubSub.subscribe(pubsub)
    // sub is a Queue - use Queue.take to receive messages
    const msg = yield* Queue.take(sub)
  })
)
```

### Combining with scoped
Since `subscribe` returns a scoped resource, you typically use it within `Effect.scoped`:
```typescript
const subscriber = yield* Effect.fork(
  Effect.scoped(
    Effect.gen(function* () {
      const sub = yield* PubSub.subscribe(pubsub)
      return yield* Queue.take(sub)
    })
  )
)
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **publishAndReceive** - Create a PubSub(10), subscribe (scoped), publish `"hello"`, take from subscription and return
2. **multipleSubscribers** - Create a PubSub, create 2 subscribers, publish `"msg"`, both take and return `[sub1msg, sub2msg]`
3. **publishMany** - Create a PubSub, subscribe, publish `1, 2, 3`, take 3 items from subscription and return as an array
4. **fanOut** - Create a PubSub, 3 subscribers, publish `"broadcast"`, count how many received (expect 3)
5. **pubsubWithProcessing** - Create a PubSub<number>, subscribe, fork a publisher that sends 1-5, consumer takes 5 items and sums them, return sum

## Examples

```typescript
import { Effect, PubSub, Queue, Fiber } from "effect"

// Basic publish and subscribe
const basic = Effect.scoped(
  Effect.gen(function* () {
    const pubsub = yield* PubSub.bounded<string>(10)
    const sub = yield* PubSub.subscribe(pubsub)
    yield* PubSub.publish(pubsub, "hello")
    return yield* Queue.take(sub) // "hello"
  })
)

// Multiple subscribers
const multi = Effect.scoped(
  Effect.gen(function* () {
    const pubsub = yield* PubSub.bounded<string>(10)
    const sub1 = yield* PubSub.subscribe(pubsub)
    const sub2 = yield* PubSub.subscribe(pubsub)
    yield* PubSub.publish(pubsub, "broadcast")
    const msg1 = yield* Queue.take(sub1)
    const msg2 = yield* Queue.take(sub2)
    return [msg1, msg2] // ["broadcast", "broadcast"]
  })
)
```

## Hints

- `PubSub.subscribe` returns a scoped `Queue` -- you must be inside `Effect.scoped` or pass the scope
- Subscribe BEFORE publishing, otherwise messages are lost (no one is listening)
- Each subscriber gets its own `Queue` -- take from it just like a regular queue
- For concurrent patterns, fork subscribers and publisher as separate fibers
- `PubSub.publish` returns `boolean` indicating whether the message was published

## Bonus

Try to:
- Use `PubSub.publishAll` to publish a batch of messages
- Create a `PubSub.unbounded` for scenarios where backpressure is not needed
- Build a fan-out pattern where each subscriber transforms the message differently
