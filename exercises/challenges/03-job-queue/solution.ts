import {
	Context,
	Data,
	Effect,
	Either,
	HashMap,
	Layer,
	Option,
	Ref,
	Scope,
} from "effect"

export type JobStatus = "pending" | "running" | "completed" | "failed"

export interface Job {
	readonly id: string
	readonly execute: Effect.Effect<string>
	readonly status: JobStatus
	readonly result?: string
	readonly error?: string
}

export class JobNotFound extends Data.TaggedError("JobNotFound")<{
	readonly id: string
}> {}

export class QueueShutdown extends Data.TaggedError("QueueShutdown") {}

export class JobError extends Data.TaggedError("JobError")<{
	readonly id: string
	readonly message: string
}> {}

export class JobQueue extends Context.Tag("JobQueue")<
	JobQueue,
	{
		readonly submit: (
			id: string,
			execute: Effect.Effect<string>,
		) => Effect.Effect<void, QueueShutdown>
		readonly getStatus: (
			id: string,
		) => Effect.Effect<JobStatus, JobNotFound>
		readonly processAll: Effect.Effect<
			Array<Either.Either<string, JobError>>
		>
		readonly shutdown: Effect.Effect<void>
	}
>() {}

export const jobQueueLive = (
	concurrency: number,
): Layer.Layer<JobQueue, never, Scope.Scope> =>
	Layer.scoped(
		JobQueue,
		Effect.gen(function* () {
			const jobs = yield* Ref.make(HashMap.empty<string, Job>())
			const isShutdown = yield* Ref.make(false)

			yield* Effect.addFinalizer(() => Ref.set(isShutdown, true))

			return {
				submit: (id: string, execute: Effect.Effect<string>) =>
					Effect.gen(function* () {
						const shutdown = yield* Ref.get(isShutdown)
						if (shutdown) {
							return yield* Effect.fail(
								new QueueShutdown(),
							)
						}
						yield* Ref.update(
							jobs,
							HashMap.set(id, {
								id,
								execute,
								status: "pending" as const,
							}),
						)
					}),

				getStatus: (id: string) =>
					Effect.gen(function* () {
						const map = yield* Ref.get(jobs)
						const job = HashMap.get(map, id)
						if (Option.isNone(job)) {
							return yield* Effect.fail(
								new JobNotFound({ id }),
							)
						}
						return job.value.status
					}),

				processAll: Effect.gen(function* () {
					const map = yield* Ref.get(jobs)
					const pending = HashMap.filter(
						map,
						(job) => job.status === "pending",
					)
					const pendingJobs = Array.from(
						HashMap.values(pending),
					)

					return yield* Effect.forEach(
						pendingJobs,
						(job) =>
							Effect.gen(function* () {
								yield* Ref.update(
									jobs,
									HashMap.set(job.id, {
										...job,
										status: "running" as const,
									}),
								)

								const result = yield* Effect.either(
									job.execute,
								)

								if (Either.isRight(result)) {
									yield* Ref.update(
										jobs,
										HashMap.set(job.id, {
											...job,
											status: "completed" as const,
											result: result.right,
										}),
									)
									return Either.right(
										result.right,
									) as Either.Either<string, JobError>
								}

								const errorMsg = String(result.left)
								yield* Ref.update(
									jobs,
									HashMap.set(job.id, {
										...job,
										status: "failed" as const,
										error: errorMsg,
									}),
								)
								return Either.left(
									new JobError({
										id: job.id,
										message: errorMsg,
									}),
								) as Either.Either<string, JobError>
							}),
						{ concurrency },
					)
				}),

				shutdown: Ref.set(isShutdown, true),
			}
		}),
	)

// Program 1: Submit and process
export const submitAndProcess = (
	jobDefs: ReadonlyArray<{
		id: string
		execute: Effect.Effect<string>
	}>,
): Effect.Effect<
	Array<{ id: string; status: JobStatus }>,
	never,
	JobQueue
> =>
	Effect.gen(function* () {
		const queue = yield* JobQueue
		yield* Effect.forEach(jobDefs, (j) =>
			queue.submit(j.id, j.execute),
		)
		yield* queue.processAll
		return yield* Effect.forEach(jobDefs, (j) =>
			Effect.gen(function* () {
				const status = yield* queue.getStatus(j.id)
				return { id: j.id, status }
			}),
		)
	})

// Program 2: Submit after shutdown
export const submitAfterShutdown = (
	id: string,
	execute: Effect.Effect<string>,
): Effect.Effect<string, never, JobQueue> =>
	Effect.gen(function* () {
		const queue = yield* JobQueue
		yield* queue.shutdown
		return yield* queue.submit(id, execute).pipe(
			Effect.catchTag("QueueShutdown", () =>
				Effect.succeed("QueueShutdown"),
			),
		)
	})
