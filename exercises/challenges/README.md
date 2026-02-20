# Challenges

Consolidation exercises that combine concepts from levels 01–06.

Each challenge is a small standalone project that requires you to use
multiple Effect concepts together — just like in a real application.

## Prerequisites

You should have completed:
- 01 Basics (Effect.succeed, Effect.fail, Effect.gen, pipe)
- 02 Error Handling (TaggedError, catchTag, catchAll, Either)
- 03 Control Flow (Effect.if, filterOrFail, Match)
- 04 Concurrency (Fiber, fork, race, Effect.all, forEach)
- 05 Resource Management (acquireRelease, Scope, addFinalizer)
- 06 Services (Context.Tag, Layer, Layer.effect, Layer.provide)

## Challenges

| # | Name | Concepts Combined |
|---|------|-------------------|
| 01 | TTL Cache | Ref, HashMap, Service, Layer.effect, Fiber, acquireRelease, TaggedError |
| 02 | Rate Limiter | Ref, Service, Layer.effect, filterOrFail, Fiber, sleep |
| 03 | Job Queue | Ref, Service, Layer.effect, forEach + concurrency, acquireRelease, Either, Fiber |
