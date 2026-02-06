# Effect Learning Exercises

Complete list of exercises for learning Effect from basic concepts to advanced patterns.

## How to Use

1. Start with Level 1 and progress sequentially
2. Read `README.md` in each exercise to understand the concept
3. Implement functions in `exercise.ts`
4. Run tests: `npm test [path]`
5. Compare with `solution.ts` if stuck

## Progress

Mark completed exercises:

## Level 1: Basics (3 exercises)

Learn the fundamentals of creating, running, and transforming Effects.

- [ ] **01-creating-effects** - Creating Effects with succeed, fail, sync, promise
- [ ] **02-running-effects** - Running Effects with runSync, runPromise, runFork
- [ ] **03-transforming-effects** - Transforming Effects with map, flatMap, andThen

## Level 2: Error Handling (3 exercises)

Learn to work with errors in Effect.

- [ ] **01-expected-errors** - Typed errors via Effect.fail
- [ ] **02-catching-errors** - Handling errors via catchAll, catchTag, catchSome
- [ ] **03-fallback-strategies** - Fallback strategies via orElse, retry, timeout

## Level 3: Control Flow (3 exercises)

Control flow management in Effect.

- [ ] **01-conditional-logic** - Conditional logic via Effect.if, when, unless
- [ ] **02-looping** - Loops via Effect.loop, iterate, forEach
- [ ] **03-combining-effects** - Combining via Effect.all, zip, struct

## Level 4: Concurrency (3 exercises)

Concurrency basics and working with Fibers.

- [ ] **01-fibers-basics** - Working with Fiber via fork, join, await, interrupt
- [ ] **02-racing-effects** - Racing via Effect.race, raceAll
- [ ] **03-parallel-execution** - Parallel execution with concurrency

## Level 5: Resource Management (2 exercises)

Safe resource management.

- [ ] **01-scope-basics** - Scope and automatic cleanup via acquireRelease
- [ ] **02-acquire-release** - Complex resource management patterns

## Level 6: Services (3 exercises)

Dependency Injection in Effect.

- [ ] **01-defining-services** - Defining services via Context.Tag
- [ ] **02-using-services** - Using services via Effect.service
- [ ] **03-layers** - Service composition via Layer

## Level 7: State Management (3 exercises)

State management in Effect.

- [ ] **01-ref-basics** - Mutable state via Ref
- [ ] **02-synchronized-ref** - Atomic operations via SynchronizedRef
- [ ] **03-subscription-ref** - Reactive state via SubscriptionRef

## Level 8: Advanced Concurrency (4 exercises)

Advanced concurrency primitives.

- [ ] **01-deferred** - Synchronization via Deferred
- [ ] **02-queue** - Queues via Queue
- [ ] **03-pubsub** - Pub-Sub via PubSub
- [ ] **04-semaphore** - Concurrency limiting via Semaphore

## Level 9: Streams (4 exercises)

Data stream processing.

- [ ] **01-stream-basics** - Creating and consuming Stream
- [ ] **02-stream-transformations** - Transforming Stream
- [ ] **03-stream-combining** - Combining Stream
- [ ] **04-stream-error-handling** - Error handling in Stream

## Level 10: Sink (2 exercises)

Consuming data from Stream.

- [ ] **01-sink-basics** - Basic Sink usage
- [ ] **02-sink-composition** - Sink composition

## Level 11: Scheduling & Caching (3 exercises)

Scheduling and caching.

- [ ] **01-schedule-basics** - Scheduling via Schedule
- [ ] **02-caching-effects** - Caching via Effect.cached
- [ ] **03-cache-advanced** - Advanced caching via Cache

## Level 12: Batching & Requests (2 exercises)

Request batching for optimization.

- [ ] **01-batching-basics** - Batching via Request and RequestResolver
- [ ] **02-batching-advanced** - Advanced batching and DataLoader pattern

## Level 13: Observability (3 exercises)

Logging, metrics, and tracing.

- [ ] **01-logging** - Logging via built-in Logger
- [ ] **02-metrics** - Metrics via Metric
- [ ] **03-tracing** - Tracing via Tracer

## Level 14: Configuration & Runtime (3 exercises)

Configuration and custom runtimes.

- [ ] **01-configuration** - Configuration via Config
- [ ] **02-config-provider** - Custom ConfigProvider
- [ ] **03-runtime-custom** - Custom Runtime

## Level 15: Advanced Patterns (3 exercises)

Advanced Effect usage patterns.

- [ ] **01-interruption** - Interruption and graceful shutdown
- [ ] **02-supervisor** - Fiber supervision via Supervisor
- [ ] **03-effect-gen-advanced** - Advanced Effect.gen usage

---

**Total: 47 exercises**

## Additional Resources

- [Effect Documentation](https://effect.website/docs/)
- [Effect Discord](https://discord.gg/effect-ts)
- [Effect GitHub](https://github.com/Effect-TS/effect)

## Tips

- Don't rush, study concepts sequentially
- Experiment with the code
- Read Effect documentation
- Ask questions in Discord community
- Compare your solution with the reference
