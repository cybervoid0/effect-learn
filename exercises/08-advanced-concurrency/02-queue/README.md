# Queue

## Concept

A **Queue** is a concurrent FIFO (first-in, first-out) data structure for passing values between fibers.
Queues support backpressure: a bounded queue will block producers when full and block consumers when empty, making them ideal for producer-consumer patterns.

### `Queue.bounded` - Create a bounded queue
Creates a queue with a maximum capacity. Producers block when the queue is full:
```typescript
const queue = yield* Queue.bounded<string>(10)
// Queue<string> with capacity 10
```

### `Queue.unbounded` - Create an unbounded queue
Creates a queue with no capacity limit:
```typescript
const queue = yield* Queue.unbounded<number>()
```

### `Queue.offer` - Add an item
Adds an item to the back of the queue. Blocks if the queue is full (bounded):
```typescript
yield* Queue.offer(queue, "hello")
```

### `Queue.take` - Remove and return an item
Removes and returns the front item. Blocks if the queue is empty:
```typescript
const item = yield* Queue.take(queue) // blocks until available
```

### `Queue.takeAll` - Drain the queue
Returns all available items at once as a `Chunk`:
```typescript
const items = yield* Queue.takeAll(queue) // Chunk<A>
```

### `Queue.size` - Check current size
Returns the number of items currently in the queue:
```typescript
const n = yield* Queue.size(queue)
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **offerAndTake** - Create a bounded queue (capacity 10), offer `"hello"`, take and return it
2. **multipleItems** - Create an unbounded queue, offer `1, 2, 3`, takeAll, convert the Chunk to an array and return
3. **queueSize** - Create a bounded queue (capacity 5), offer 3 items, return the queue size
4. **producerConsumer** - Fork a producer that offers `1-5`, fork a consumer that takes 5 items and sums them, join the consumer and return the sum
5. **boundedBackpressure** - Create a bounded queue (capacity 2), offer 2 items, fork an offer of a 3rd item (will block), take all 3 items and return them

## Examples

```typescript
import { Effect, Queue, Chunk, Fiber } from "effect"

// Basic offer and take
const basic = Effect.gen(function* () {
  const queue = yield* Queue.bounded<string>(10)
  yield* Queue.offer(queue, "hello")
  return yield* Queue.take(queue) // "hello"
})

// Producer-consumer pattern
const prodCon = Effect.gen(function* () {
  const queue = yield* Queue.bounded<number>(100)

  // Producer: puts items into the queue
  const producer = yield* Effect.fork(
    Effect.forEach([1, 2, 3], (n) => Queue.offer(queue, n), { discard: true })
  )

  // Consumer: takes items from the queue
  const items = yield* Queue.takeAll(queue)
  yield* Fiber.join(producer)

  return Chunk.toArray(items)
})
```

## Hints

- `Queue.takeAll` returns a `Chunk` -- use `Chunk.toArray` to convert to a regular array
- `Queue.offer` on a full bounded queue will block the fiber until space is available
- `Queue.take` on an empty queue will block until an item is offered
- For the producer-consumer exercise, fork the producer and consumer as separate fibers
- For backpressure, the 3rd offer on a capacity-2 queue will block until someone takes

## Bonus

Try to:
- Use `Queue.offerAll` to offer multiple items at once
- Create a sliding queue with `Queue.sliding` that drops old items when full
- Implement a simple work-stealing pattern with multiple consumer fibers
