#!/usr/bin/env tsx
/**
 * CLI tool for managing exercises
 */

import * as fs from "node:fs"
import * as path from "node:path"
import { execSync } from "node:child_process"

const EXERCISES_DIR = path.join(process.cwd(), "exercises")

const command = process.argv[2]
const exercisePath = process.argv[3]

function showHelp() {
	console.log(`
Effect Learning Exercises CLI

Usage:
  npm run exercise <command> [path]

Commands:
  list              List all exercises
  show <path>       Show exercise README
  test <path>       Run tests for an exercise
  solution <path>   Show solution for an exercise
  verify <path>     Verify your solution
  help              Show this help message

Examples:
  npm run exercise list
  npm run exercise show 01-basics/01-creating-effects
  npm run exercise test 01-basics/01-creating-effects
  npm run exercise solution 01-basics/01-creating-effects
  npm run exercise verify 01-basics/01-creating-effects
`)
}

function listExercises() {
	console.log("\n📚 Available Exercises:\n")

	const levels = fs
		.readdirSync(EXERCISES_DIR)
		.filter((name) => fs.statSync(path.join(EXERCISES_DIR, name)).isDirectory())
		.sort()

	for (const level of levels) {
		const levelPath = path.join(EXERCISES_DIR, level)
		const exercises = fs
			.readdirSync(levelPath)
			.filter((name) =>
				fs.statSync(path.join(levelPath, name)).isDirectory(),
			)
			.sort()

		console.log(`\n${level.toUpperCase()}:`)
		for (const exercise of exercises) {
			const readmePath = path.join(levelPath, exercise, "README.md")
			if (fs.existsSync(readmePath)) {
				const readme = fs.readFileSync(readmePath, "utf-8")
				const titleMatch = readme.match(/^#\s+(.+)$/m)
				const title = titleMatch ? titleMatch[1] : exercise
				console.log(`  • ${exercise} - ${title}`)
			}
		}
	}
	console.log()
}

function showExercise(exercisePath: string) {
	const fullPath = path.join(EXERCISES_DIR, exercisePath, "README.md")

	if (!fs.existsSync(fullPath)) {
		console.error(`❌ Exercise not found: ${exercisePath}`)
		process.exit(1)
	}

	const readme = fs.readFileSync(fullPath, "utf-8")
	console.log(readme)
}

function runTests(exercisePath: string) {
	const fullPath = path.join(EXERCISES_DIR, exercisePath)

	if (!fs.existsSync(fullPath)) {
		console.error(`❌ Exercise not found: ${exercisePath}`)
		process.exit(1)
	}

	console.log(`\n🧪 Running tests for ${exercisePath}...\n`)

	try {
		execSync(`npm test ${fullPath}`, {
			stdio: "inherit",
			cwd: process.cwd(),
		})
	} catch (error) {
		process.exit(1)
	}
}

function showSolution(exercisePath: string) {
	const fullPath = path.join(EXERCISES_DIR, exercisePath, "solution.ts")

	if (!fs.existsSync(fullPath)) {
		console.error(`❌ Solution not found: ${exercisePath}`)
		process.exit(1)
	}

	const solution = fs.readFileSync(fullPath, "utf-8")
	console.log("\n📝 Solution:\n")
	console.log(solution)
}

function verifySolution(exercisePath: string) {
	console.log(`\n✅ Verifying solution for ${exercisePath}...\n`)
	runTests(exercisePath)
	console.log("\n✨ Great job! Your solution passes all tests!\n")
}

// Main
switch (command) {
	case "list":
		listExercises()
		break
	case "show":
		if (!exercisePath) {
			console.error("❌ Please provide an exercise path")
			showHelp()
			process.exit(1)
		}
		showExercise(exercisePath)
		break
	case "test":
		if (!exercisePath) {
			console.error("❌ Please provide an exercise path")
			showHelp()
			process.exit(1)
		}
		runTests(exercisePath)
		break
	case "solution":
		if (!exercisePath) {
			console.error("❌ Please provide an exercise path")
			showHelp()
			process.exit(1)
		}
		showSolution(exercisePath)
		break
	case "verify":
		if (!exercisePath) {
			console.error("❌ Please provide an exercise path")
			showHelp()
			process.exit(1)
		}
		verifySolution(exercisePath)
		break
	case "help":
	default:
		showHelp()
		break
}
