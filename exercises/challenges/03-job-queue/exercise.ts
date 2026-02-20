import {
	Context,
	Data,
	Effect,
	type Either,
	HashMap,
	Layer,
	Ref,
	Scope,
} from "effect"

// ============================================================
// Types
// ============================================================

export type JobStatus = "pending" | "running" | "completed" | "failed"

export interface Job {
	readonly id: string
	readonly execute: Effect.Effect<string>
	readonly status: JobStatus
	readonly result?: string
	readonly error?: string
}

// ============================================================
// Errors
// ============================================================

export class JobNotFound extends Data.TaggedError("JobNotFound")<{
	readonly id: string
}> {}

export class QueueShutdown extends Data.TaggedError("QueueShutdown") {}

export class JobError extends Data.TaggedError("JobError")<{
	readonly id: string
	readonly message: string
}> {}

// ============================================================
// Service
// ============================================================

// TODO: Define JobQueue service with:
//   submit:     (id: string, execute: Effect<string>) => Effect<void, QueueShutdown>
//   getStatus:  (id: string) => Effect<JobStatus, JobNotFound>
//   processAll: Effect<Array<Either<string, JobError>>>
//   shutdown:   Effect<void>

export class JobQueue extends Context.Tag("JobQueue")<
	JobQueue,
	Record<string, never> // <-- Replace with real interface
>() {}

// ============================================================
// Layer
// ============================================================

// TODO: Build a layer that:
// 1. Creates Ref<HashMap<string, Job>> for jobs
// 2. Creates Ref<boolean> for shutdown flag
// 3. Registers a finalizer that sets shutdown = true
// 4. Returns the JobQueue implementation
//
// submit:     check shutdown flag with filterOrFail, then add to map
// getStatus:  look up job in map, fail with JobNotFound if missing
// processAll: get all pending jobs, run with concurrency, update statuses
// shutdown:   set shutdown flag to true

export const jobQueueLive = (
	concurrency: number,
): Layer.Layer<JobQueue, never, Scope.Scope> =>
	Layer.succeed(JobQueue, {} as never) // <-- Replace

// ============================================================
// Program 1: Submit jobs and process
// ============================================================

// 1. Submit all jobs (id + effect pairs)
// 2. Process all pending jobs
// 3. Return the status of each job by id
export const submitAndProcess = (
	jobs: ReadonlyArray<{ id: string; execute: Effect.Effect<string> }>,
): Effect.Effect<
	Array<{ id: string; status: JobStatus }>,
	never,
	JobQueue
> => {
	// Your code here
	return Effect.succeed([]) as never
}

// ============================================================
// Program 2: Submit after shutdown
// ============================================================

// 1. Shut down the queue
// 2. Try to submit a job
// 3. Return the error tag if QueueShutdown, or "unexpected" if it succeeded
export const submitAfterShutdown = (
	id: string,
	execute: Effect.Effect<string>,
): Effect.Effect<string, never, JobQueue> => {
	// Your code here
	return Effect.succeed("TODO") as never
}
