# Getting Started with Effect Learning Exercises

Welcome to the Effect learning course! 🎉

## What's Created

✅ **47 learning exercises** divided into **15 levels**
✅ Complete directory structure for all exercises
✅ Testing utilities (`test-utils.ts`)
✅ CLI for managing exercises
✅ Documentation and guides

## Project Structure

```
exercises/
├── 01-basics/              ✅ Level 1 (3 exercises) - FULLY READY
│   ├── 01-creating-effects/
│   ├── 02-running-effects/
│   └── 03-transforming-effects/
├── 02-error-handling/      ✅ Level 2 (3 exercises) - FULLY READY
├── 03-control-flow/        ✅ Level 3 (3 exercises) - FULLY READY
├── 04-concurrency/         📝 Level 4 (3 exercises) - basic structure
├── 05-resource-management/ 📝 Level 5 (2 exercises) - basic structure
├── 06-services/            📝 Level 6 (3 exercises) - basic structure
├── 07-state-management/    📝 Level 7 (3 exercises) - basic structure
├── 08-advanced-concurrency/📝 Level 8 (4 exercises) - basic structure
├── 09-streams/             📝 Level 9 (4 exercises) - basic structure
├── 10-sink/                📝 Level 10 (2 exercises) - basic structure
├── 11-scheduling-caching/  📝 Level 11 (3 exercises) - basic structure
├── 12-batching-requests/   📝 Level 12 (2 exercises) - basic structure
├── 13-observability/       📝 Level 13 (3 exercises) - basic structure
├── 14-configuration-runtime/📝 Level 14 (3 exercises) - basic structure
└── 15-advanced-patterns/   📝 Level 15 (3 exercises) - basic structure
```

## Quick Start

### 1. Start with Level 1

Level 1 (Basics) is fully ready with detailed descriptions, examples, and tests:

```bash
cd exercises/01-basics/01-creating-effects
cat README.md
```

### 2. Implement the Exercise

Open `exercise.ts` and implement the functions:

```typescript
export const createSuccessEffect = (): Effect.Effect<number> => {
  // TODO: Your code here
  return Effect.succeed(42) // Replace with correct implementation
}
```

### 3. Run Tests

```bash
npm test exercises/01-basics/01-creating-effects
```

### 4. Compare with Solution

If you're stuck:

```bash
cat solution.ts
```

## Available Commands

### Testing

```bash
# All tests
npm test

# Specific exercise
npm test exercises/01-basics/01-creating-effects

# Watch mode
npm test -- --watch

# Coverage
npm run coverage
```

### CLI

```bash
# List all exercises
npm run exercise list

# Show exercise
npm run exercise show 01-basics/01-creating-effects

# Run tests
npm run exercise test 01-basics/01-creating-effects

# Show solution
npm run exercise solution 01-basics/01-creating-effects

# Verify solution
npm run exercise verify 01-basics/01-creating-effects
```

### Type Checking

```bash
npm run check
```

## What's Next?

### For Beginners

1. **Complete Level 1** - this will give you a basic understanding of Effect
2. **Read the documentation** - [Effect Docs](https://effect.website/docs/)
3. **Experiment** - change the code and see what happens

### For Intermediate

1. **Fill in the details** - improve descriptions in README.md for Levels 4-15
2. **Add examples** - create realistic examples for each exercise
3. **Write tests** - add more edge cases

### For Advanced

1. **Create your own exercises** - add new concepts
2. **Optimize** - improve performance of solutions
3. **Share** - help others in Discord

## Exercise Structure

Each exercise contains 4 files:

### `README.md`
- **Concept** - what we're learning
- **Assignment** - what needs to be done
- **Examples** - how to use it
- **Hints** - links and tips
- **Bonus** - additional challenges

### `exercise.ts`
- Template with TODO comments
- Types and interfaces
- Functions to implement

### `solution.ts`
- Reference solution
- Comments on complex parts
- Best practices

### `exercise.test.ts`
- Automated tests
- Correctness checks
- Edge cases

## Current Status

### ✅ Fully Ready

- **Level 1: Basics** (3 exercises)
  - Creating Effects - detailed description, examples, tests
  - Running Effects - detailed description, examples, tests
  - Transforming Effects - detailed description, examples, tests

- **Level 2: Error Handling** (3 exercises)
  - Expected Errors - detailed description, examples, tests
  - Catching Errors - detailed description, examples, tests
  - Fallback Strategies - detailed description, examples, tests

- **Level 3: Control Flow** (3 exercises)
  - Conditional Logic - detailed description, examples, tests
  - Looping - detailed description, examples, tests
  - Combining Effects - detailed description, examples, tests

### 📝 Basic Structure (ready to fill)

- **Levels 4-15** (38 exercises)
  - Directories created
  - Placeholder files created
  - Ready for details

## How to Fill Remaining Exercises

For each exercise in Levels 4-15:

1. **Update README.md**
   - Add detailed concept description
   - Provide concrete examples
   - Add links to documentation

2. **Update exercise.ts**
   - Add specific functions to implement
   - Add types and interfaces
   - Add TODO comments

3. **Create solution.ts**
   - Implement reference solution
   - Add comments
   - Show best practices

4. **Update exercise.test.ts**
   - Add specific tests
   - Check edge cases
   - Ensure solution passes tests

## Useful Resources

- 📚 [Effect Documentation](https://effect.website/docs/)
- 💬 [Effect Discord](https://discord.gg/effect-ts)
- 🐙 [Effect GitHub](https://github.com/Effect-TS/effect)
- 📝 [Effect Blog](https://effect.website/blog/)
- 🎥 [Effect YouTube](https://youtube.com/@effect-ts)

## Support

If you have questions:

1. Check `GUIDE.md` - usage guide
2. See `EXERCISES.md` - list of all exercises
3. Ask in [Discord](https://discord.gg/effect-ts)

---

**Good luck learning Effect!** 🚀

Start with `cd exercises/01-basics/01-creating-effects` and `cat README.md`
