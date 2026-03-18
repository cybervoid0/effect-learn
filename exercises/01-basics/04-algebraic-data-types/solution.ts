import { Data, Match } from "effect"

export const createPoint = () => {
	return Data.struct({ x: 3, y: 4 })
}

export class Circle extends Data.TaggedClass("Circle")<{
	readonly radius: number
}> {}

export class Square extends Data.TaggedClass("Square")<{
	readonly side: number
}> {}

export type Shape = Circle | Square

export const createCircle = (): Circle => {
	return new Circle({ radius: 5 })
}

export const createSquare = (): Square => {
	return new Square({ side: 3 })
}

export const calculateArea = (shape: Shape): number => {
	return Match.value(shape).pipe(
		Match.tag("Circle", ({ radius }) => Math.PI * radius * radius),
		Match.tag("Square", ({ side }) => side * side),
		Match.exhaustive
	)
}

export const createResult = <T>() => {
	type Result = Data.TaggedEnum<{
		Ok: { readonly value: T }
		Err: { readonly reason: string }
	}>

	return Data.taggedEnum<Result>()
}

export const handleResult = (result: unknown): string => {
	return Match.value(result).pipe(
		Match.tag("Ok", ({ value }: any) => `Success: ${value}`),
		Match.tag("Err", ({ reason }: any) => `Error: ${reason}`),
		Match.exhaustive
	)
}
