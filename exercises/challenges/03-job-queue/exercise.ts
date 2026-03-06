import {
	Context,
	Data,
	Effect as E,
	type Either,
	HashMap,
	Layer,
	Option,
	Ref,
	type Scope,
} from "effect"

// ============================================================
// Types
// ============================================================

export type JobStatus = "pending" | "running" | "completed" | "failed"

export interface Job {
	readonly id: string
	readonly execute: E.Effect<string>
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
interface JobQueueApi {
	submit: (
		id: string,
		execute: E.Effect<string>,
	) => E.Effect<void, QueueShutdown>
	getStatus: (id: string) => E.Effect<JobStatus, JobNotFound>
	processAll: E.Effect<Array<Either.Either<string, JobError>>>
	shutdown: E.Effect<void>
}

export class JobQueue extends Context.Tag("JobQueue")<
	JobQueue,
	JobQueueApi
>() {}

// ============================================================
// Layer
// ============================================================

export const jobQueueLive = (
	concurrency: number,
): Layer.Layer<JobQueue, never, Scope.Scope> =>
	Layer.scoped(JobQueue)(
		E.gen(function* () {
			// 1. Creates Ref<HashMap<string, Job>> for jobs
			const jobsRef = yield* Ref.make(HashMap.empty<string, Job>())
			// 2. Creates Ref<boolean> for shutdown flag
			const shutDownRef = yield* Ref.make<boolean>(false)
			// 3. Registers a finalizer that sets shutdown = true
			yield* E.addFinalizer(() => Ref.set(shutDownRef, true))

			// 4. Returns the JobQueue implementation
			return JobQueue.of({
				// getStatus:  look up job in map, fail with JobNotFound if missing
				getStatus: id =>
					E.gen(function* () {
						const jobStatus = yield* Ref.get(jobsRef)
						return yield* Option.match(HashMap.get(jobStatus, id), {
							onSome: st => E.succeed(st.status),
							onNone: () => new JobNotFound({ id }),
						})
					}),
				// submit:     check shutdown flag with filterOrFail, then add to map
				submit: (id, execute) =>
					Ref.get(shutDownRef).pipe(
						E.filterOrFail(
							sd => !sd,
							() => new QueueShutdown(),
						),
						E.andThen(
							Ref.update(
								jobsRef,
								HashMap.set(id, {
									id,
									execute,
									status: "pending" as JobStatus,
								}),
							),
						),
					),
				// shutdown:   set shutdown flag to true
				shutdown: Ref.set(shutDownRef, true),
				// processAll: get all pending jobs, run with concurrency, update statuses
				processAll: E.gen(function* () {
					const jobs = yield* Ref.get(jobsRef).pipe(
						E.map(HashMap.filter(j => j.status === "pending")),
						E.map(HashMap.values),
					)
					return yield* E.forEach(
						jobs,
						({ id, execute }) =>
							Ref.update(
								jobsRef,
								HashMap.modify(id, old => ({ ...old, status: "running" })),
							).pipe(
								E.andThen(execute),
								E.tap(result =>
									Ref.update(
										jobsRef,
										HashMap.modify(id, old => ({
											...old,
											status: "completed",
											result,
										})),
									),
								),
								E.tapError(err =>
									Ref.update(
										jobsRef,
										HashMap.modify(id, old => ({
											...old,
											status: "failed",
											error: String(err),
										})),
									),
								),
								E.mapError(msg => new JobError({ id, message: String(msg) })),
								E.either,
							),
						{ concurrency },
					)
				}),
			})
		}),
	)

// ============================================================
// Program 1: Submit jobs and process
// ============================================================

// 1. Submit all jobs (id + effect pairs)
// 2. Process all pending jobs
// 3. Return the status of each job by id
export const submitAndProcess = (
	jobs: ReadonlyArray<{ id: string; execute: E.Effect<string> }>,
): E.Effect<Array<{ id: string; status: JobStatus }>, never, JobQueue> => {
	// Your code here
	return E.gen(function* () {
		const queue = yield* JobQueue
		yield* E.forEach(jobs, j => queue.submit(j.id, j.execute), {
			concurrency: "unbounded",
		}).pipe(E.orDie)
		yield* queue.processAll
		return yield* E.forEach(
			jobs,
			j => queue.getStatus(j.id).pipe(E.map(status => ({ id: j.id, status }))),
			{ concurrency: "unbounded" },
		).pipe(E.orDie)
	})
}

// ============================================================
// Program 2: Submit after shutdown
// ============================================================

// 1. Shut down the queue
// 2. Try to submit a job
// 3. Return the error tag if QueueShutdown, or "unexpected" if it succeeded
export const submitAfterShutdown = (
	id: string,
	execute: E.Effect<string>,
): E.Effect<string, never, JobQueue> =>
	JobQueue.pipe(
		E.tap(queue => queue.shutdown),
		E.tap(queue => queue.submit(id, execute)),
		E.map(() => "unexpected"),
		E.catchTag("QueueShutdown", err => E.succeed(err._tag)),
	)
