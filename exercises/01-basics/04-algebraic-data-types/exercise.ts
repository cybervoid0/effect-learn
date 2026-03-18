import { Data, Match } from "effect"

/**
 * Exercise 1: createPoint
 *
 * Use Data.struct to create a Point record with x and y coordinates.
 * Return a point at (3, 4).
 */
export const createPoint = () => {
	// TODO: Implement
	return { x: 0, y: 0 }
}

/**
 * Exercise 2: createShape
 *
 * Create two classes using Data.TaggedClass:
 * - Circle with a readonly radius field
 * - Square with a readonly side field
 *
 * Return a union type called Shape and create both Circle(5) and Square(3).
 */
export class Circle extends Data.TaggedClass("Circle")<{
	readonly radius: number
}> {}

export class Square extends Data.TaggedClass("Square")<{
	readonly side: number
}> {}

export type Shape = Circle | Square

export const createCircle = (): Circle => {
	// TODO: Implement
	return new Circle({ radius: 0 })
}

export const createSquare = (): Square => {
	// TODO: Implement
	return new Square({ side: 0 })
}

/**
 * Exercise 3: calculateArea
 *
 * Use Match.value() with Match.tag() and Match.exhaustive to calculate
 * the area of any Shape. Handle both Circle (π * r²) and Square (side²).
 *
 * Expected: Circle(5) -> ~78.5, Square(3) -> 9
 */
export const calculateArea = (shape: Shape): number => {
	// TODO: Implement
	return 0
}

/**
 * Exercise 4: createResult
 *
 * Use Data.taggedEnum to create a Result type with:
 * - Ok variant containing a value of type T
 * - Err variant containing a reason string
 *
 * Return the constructors and utilities.
 */
export const createResult = <T>() => {
	type Result = Data.TaggedEnum<{
		Ok: { readonly value: T }
		Err: { readonly reason: string }
	}>

	// TODO: Implement
	return {} as ReturnType<typeof Data.taggedEnum<Result>>
}

/**
 * Exercise 5: handleResult
 *
 * Given a Result (from the taggedEnum), use pattern matching to:
 * - Return the value if Ok
 * - Return the reason prefixed with "Error: " if Err
 */
export const handleResult = (result: unknown): string => {
	// TODO: Implement
	return ""
}
