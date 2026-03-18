import { Data, Match } from "effect"
import { describe, it, expect } from "vitest"
import * as ex from "./exercise"

describe("Algebraic Data Types", () => {
	it("exercise 1: createPoint", () => {
		const point = ex.createPoint()
		expect(point).toEqual({ x: 3, y: 4 })
	})

	it("exercise 2a: createCircle", () => {
		const circle = ex.createCircle()
		expect(circle._tag).toBe("Circle")
		expect(circle.radius).toBe(5)
	})

	it("exercise 2b: createSquare", () => {
		const square = ex.createSquare()
		expect(square._tag).toBe("Square")
		expect(square.side).toBe(3)
	})

	it("exercise 3: calculateArea for Circle", () => {
		const circle = ex.createCircle()
		const area = ex.calculateArea(circle)
		expect(area).toBeCloseTo(Math.PI * 25, 1)
	})

	it("exercise 3: calculateArea for Square", () => {
		const square = ex.createSquare()
		const area = ex.calculateArea(square)
		expect(area).toBe(9)
	})

	it("exercise 4 & 5: createResult and handleResult", () => {
		const Result = ex.createResult<number>()
		const okValue = Result.Ok({ value: 42 })
		const errValue = Result.Err({ reason: "Not found" })

		const okMessage = Match.value(okValue).pipe(
			Match.tag("Ok", ({ value }) => `Success: ${value}`),
			Match.tag("Err", ({ reason }) => `Error: ${reason}`),
			Match.exhaustive
		)

		const errMessage = Match.value(errValue).pipe(
			Match.tag("Ok", ({ value }) => `Success: ${value}`),
			Match.tag("Err", ({ reason }) => `Error: ${reason}`),
			Match.exhaustive
		)

		expect(okMessage).toBe("Success: 42")
		expect(errMessage).toBe("Error: Not found")
	})

	it("exercise 5: handleResult pattern matching", () => {
		const Result = ex.createResult<string>()
		const okResult = Result.Ok({ value: "hello" })
		const errResult = Result.Err({ reason: "timeout" })

		const okMsg = ex.handleResult(okResult)
		const errMsg = ex.handleResult(errResult)

		expect(okMsg).toBe("Success: hello")
		expect(errMsg).toBe("Error: timeout")
	})
})
