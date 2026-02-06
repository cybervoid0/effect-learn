#!/usr/bin/env tsx
/**
 * Script to generate exercise structure for all levels
 */

import * as fs from "node:fs"
import * as path from "node:path"

const EXERCISES_DIR = path.join(process.cwd(), "exercises")

interface Exercise {
	level: string
	name: string
	title: string
	concept: string
}

const exercises: Exercise[] = [
	// Level 1: Basics
	{
		level: "01-basics",
		name: "01-creating-effects",
		title: "Creating Effects",
		concept: "Learn how to create Effects using succeed, fail, sync, and promise",
	},
	{
		level: "01-basics",
		name: "02-running-effects",
		title: "Running Effects",
		concept: "Learn how to run Effects using runSync, runPromise, and runFork",
	},
	{
		level: "01-basics",
		name: "03-transforming-effects",
		title: "Transforming Effects",
		concept: "Learn how to transform Effects using map, flatMap, and andThen",
	},
	// Level 2: Error Handling
	{
		level: "02-error-handling",
		name: "01-expected-errors",
		title: "Expected Errors",
		concept: "Learn how to work with typed errors using Effect.fail",
	},
	{
		level: "02-error-handling",
		name: "02-catching-errors",
		title: "Catching Errors",
		concept: "Learn how to catch errors using catchAll, catchTag, catchSome",
	},
	{
		level: "02-error-handling",
		name: "03-fallback-strategies",
		title: "Fallback Strategies",
		concept: "Learn fallback strategies using orElse, retry, timeout",
	},
	// Add more exercises here...
]

function generateReadme(exercise: Exercise): string {
	return `# ${exercise.title}

## Концепция

${exercise.concept}

## Задание

Реализуйте функции в файле \`exercise.ts\`.

## Примеры

\`\`\`typescript
import { Effect } from "effect"

// Add examples here
\`\`\`

## Подсказки

- Используйте документацию Effect: https://effect.website/docs/
- Проверьте тесты для понимания ожидаемого поведения

## Бонус

Попробуйте расширить решение дополнительными функциями.
`
}

function generateExercise(): string {
	return `import { Effect } from "effect"

/**
 * TODO: Implement the exercise functions
 */

export const solution = Effect.succeed("TODO: Implement me!")
`
}

function generateSolution(): string {
	return `import { Effect } from "effect"

/**
 * Solution implementation
 */

export const solution = Effect.succeed("Implemented!")
`
}

function generateTest(exercise: Exercise): string {
	return `import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("${exercise.name}", () => {
	it("should work correctly", () => {
		const result = Effect.runSync(Exercise.solution)
		expect(result).toBeDefined()
	})
})
`
}

function createExerciseFiles(exercise: Exercise) {
	const exercisePath = path.join(EXERCISES_DIR, exercise.level, exercise.name)

	// Skip if already exists
	if (fs.existsSync(path.join(exercisePath, "README.md"))) {
		console.log(`Skipping ${exercise.name} (already exists)`)
		return
	}

	// Create README if it doesn't exist
	const readmePath = path.join(exercisePath, "README.md")
	if (!fs.existsSync(readmePath)) {
		fs.writeFileSync(readmePath, generateReadme(exercise))
	}

	// Create exercise.ts if it doesn't exist
	const exerciseTsPath = path.join(exercisePath, "exercise.ts")
	if (!fs.existsSync(exerciseTsPath)) {
		fs.writeFileSync(exerciseTsPath, generateExercise())
	}

	// Create solution.ts if it doesn't exist
	const solutionPath = path.join(exercisePath, "solution.ts")
	if (!fs.existsSync(solutionPath)) {
		fs.writeFileSync(solutionPath, generateSolution())
	}

	// Create test file if it doesn't exist
	const testPath = path.join(exercisePath, "exercise.test.ts")
	if (!fs.existsSync(testPath)) {
		fs.writeFileSync(testPath, generateTest(exercise))
	}

	console.log(`✓ Created ${exercise.name}`)
}

// Generate all exercises
console.log("Generating exercise files...")
for (const exercise of exercises) {
	createExerciseFiles(exercise)
}
console.log("Done!")
