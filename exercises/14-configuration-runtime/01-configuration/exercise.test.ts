import { describe, expect, it } from "@effect/vitest"
import { ConfigProvider, Effect, Layer } from "effect"
import * as Exercise from "./exercise"

describe("01-configuration", () => {
	describe("readStringConfig", () => {
		it.effect("should read APP_NAME from config", () =>
			Effect.gen(function* () {
				const provider = ConfigProvider.fromMap(
					new Map([["APP_NAME", "MyApp"]]),
				)
				const result = yield* Exercise.readStringConfig.pipe(
					Effect.provide(Layer.setConfigProvider(provider)),
				)
				expect(result).toBe("MyApp")
			}),
		)
	})

	describe("readNumberConfig", () => {
		it.effect("should read PORT as a number from config", () =>
			Effect.gen(function* () {
				const provider = ConfigProvider.fromMap(
					new Map([["PORT", "3000"]]),
				)
				const result = yield* Exercise.readNumberConfig.pipe(
					Effect.provide(Layer.setConfigProvider(provider)),
				)
				expect(result).toBe(3000)
			}),
		)
	})

	describe("configWithDefault", () => {
		it.effect("should return the configured value when present", () =>
			Effect.gen(function* () {
				const provider = ConfigProvider.fromMap(
					new Map([["LOG_LEVEL", "debug"]]),
				)
				const result = yield* Exercise.configWithDefault.pipe(
					Effect.provide(Layer.setConfigProvider(provider)),
				)
				expect(result).toBe("debug")
			}),
		)

		it.effect("should return 'info' as default when LOG_LEVEL is missing", () =>
			Effect.gen(function* () {
				const provider = ConfigProvider.fromMap(new Map())
				const result = yield* Exercise.configWithDefault.pipe(
					Effect.provide(Layer.setConfigProvider(provider)),
				)
				expect(result).toBe("info")
			}),
		)
	})

	describe("combinedConfig", () => {
		it.effect("should combine HOST and PORT into an object", () =>
			Effect.gen(function* () {
				const provider = ConfigProvider.fromMap(
					new Map([
						["HOST", "localhost"],
						["PORT", "8080"],
					]),
				)
				const result = yield* Exercise.combinedConfig.pipe(
					Effect.provide(Layer.setConfigProvider(provider)),
				)
				expect(result).toEqual({ host: "localhost", port: 8080 })
			}),
		)
	})

	describe("mappedConfig", () => {
		it.effect("should read PORT and multiply by 10", () =>
			Effect.gen(function* () {
				const provider = ConfigProvider.fromMap(
					new Map([["PORT", "300"]]),
				)
				const result = yield* Exercise.mappedConfig.pipe(
					Effect.provide(Layer.setConfigProvider(provider)),
				)
				expect(result).toBe(3000)
			}),
		)
	})
})
