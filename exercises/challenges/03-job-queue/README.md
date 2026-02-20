# Challenge 3: Job Queue

## Goal

Build a job queue service that accepts jobs, executes them with
configurable concurrency, and tracks their status. Supports
graceful shutdown.

## Concepts Used

| Concept | From Level |
|---------|------------|
| `Ref<HashMap>` | 01 Basics |
| `Context.Tag` + `Layer.scoped` | 06 Services |
| `Data.TaggedError` + `catchTag` | 02 Error Handling |
| `Match.value` + `Match.tag` | 03 Control Flow |
| `Effect.forEach` + `concurrency` | 04 Concurrency |
| `Fiber.fork` + `Fiber.join` | 04 Concurrency |
| `Effect.acquireRelease` / `addFinalizer` | 05 Resource Management |
| `Effect.either` | 02 Error Handling |

## Specification

### Types

```typescript
type JobStatus = "pending" | "running" | "completed" | "failed"

type Job<A> = {
  readonly id: string
  readonly execute: Effect<A>
  readonly status: JobStatus
  readonly result?: A
  readonly error?: string
}
```

### Errors

**JobNotFound** — tagged error with `id: string`
**QueueShutdown** — tagged error (no fields) — thrown when submitting to a shut-down queue

### Service: `JobQueue`

Tag: `"JobQueue"`, interface:

- `submit: (id: string, execute: Effect<string>) => Effect<void, QueueShutdown>`
  Add a job with status "pending". Fail if queue is shut down.

- `getStatus: (id: string) => Effect<JobStatus, JobNotFound>`
  Return the current status of a job.

- `processAll: Effect<Array<Either<string, JobError>>>`
  Execute all "pending" jobs with configurable concurrency.
  Mark each as "running" → "completed"/"failed".
  Return results wrapped in Either.

- `shutdown: Effect<void>`
  Mark the queue as shut down. No more submissions allowed.

### Layer: `jobQueueLive`

`(concurrency: number) => Layer<JobQueue, never, Scope>`

Construction:
1. `Ref<HashMap<string, Job<string>>>` for job storage
2. `Ref<boolean>` for shutdown flag
3. Register finalizer that calls shutdown
4. Implement the service methods

### Programs

**submitAndProcess** — submit N jobs, process them all, return statuses.

**submitAfterShutdown** — shut down the queue, try to submit — should
get `QueueShutdown` error.

## Hints

- `Ref.modify` for atomic status transitions (pending → running)
- `Effect.forEach(pendingJobs, processOne, { concurrency })` for parallel execution
- `Effect.either` to catch job failures without crashing the queue
- `HashMap.filter` to find pending jobs
- For shutdown: simple `Ref<boolean>` + `filterOrFail`
