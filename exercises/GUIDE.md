# Effect Learning Guide

A guide to using Effect learning exercises.

## Project Structure

```
exercises/
├── 01-basics/              # Basic concepts
├── 02-error-handling/      # Error handling
├── 03-control-flow/        # Control flow
├── 04-concurrency/         # Concurrency
├── 05-resource-management/ # Resource management
├── 06-services/            # Services and DI
├── 07-state-management/    # State management
├── 08-advanced-concurrency/# Advanced concurrency
├── 09-streams/             # Data streams
├── 10-sink/                # Sinks for streams
├── 11-scheduling-caching/  # Scheduling and caching
├── 12-batching-requests/   # Request batching
├── 13-observability/       # Observability
├── 14-configuration-runtime/# Configuration and Runtime
└── 15-advanced-patterns/   # Advanced patterns
```

## Exercise Structure

Each exercise contains 4 files:

### `README.md`
Exercise description:
- **Concept** - explanation of the concept being learned
- **Assignment** - what needs to be implemented
- **Examples** - usage examples
- **Hints** - useful links and tips
- **Bonus** - additional challenges

### `exercise.ts`
Code template:
- Types and interfaces
- TODO comments
- Function stubs to implement

### `solution.ts`
Reference solution:
- Complete implementation
- Comments on complex parts
- Best practices

### `exercise.test.ts`
Automated tests:
- Solution correctness checks
- Uses `@effect/vitest`
- Covers edge cases

## How to Work with Exercises

### 1. Choose an Exercise

Start with Level 1 and progress sequentially:

```bash
cd exercises/01-basics/01-creating-effects
```

### 2. Read the Exercise

Open `README.md` and carefully read:
- The concept
- Exercise requirements
- Examples

### 3. Implementation

Open `exercise.ts` and implement the functions:

```typescript
// Find TODO comments
export const createSuccessEffect = (): Effect.Effect<number> => {
  // TODO: Your code here
  return Effect.succeed(42)
}
```

### 4. Run Tests

Check your solution:

```bash
# From project root
npm run test exercises/01-basics/01-creating-effects

# Or in watch mode
npm run test -- --watch exercises/01-basics/01-creating-effects
```

### 5. Compare with Solution

If stuck, check `solution.ts`:

```bash
cat solution.ts
```

### 6. Track Progress

Mark completed exercises in `EXERCISES.md`:

```markdown
- [x] **01-creating-effects** - Creating Effects
```

## Commands

### Running Tests

```bash
# All tests
npm test

# Specific exercise
npm test exercises/01-basics/01-creating-effects

# Watch mode
npm test -- --watch

# With coverage
npm run coverage
```

### Type Checking

```bash
npm run check
```

### Formatting

```bash
# Check
npm run lint

# Auto-fix (if configured)
npm run format
```

## Learning Tips

### For Beginners

1. **Don't rush** - study concepts sequentially
2. **Experiment** - change code and see what happens
3. **Read errors** - TypeScript will tell you what's wrong
4. **Use REPL** - try code interactively

### For Intermediate

1. **Study types** - pay attention to types in signatures
2. **Read source code** - Effect is open source, you can check implementation
3. **Solve bonuses** - additional challenges for deeper understanding
4. **Write your own tests** - add edge cases

### For Advanced

1. **Optimize** - find more efficient solutions
2. **Refactor** - improve readability and reusability
3. **Create abstractions** - generalize patterns
4. **Share knowledge** - help others in Discord

## Common Issues

### Tests Don't Pass

1. Check types - `npm run check`
2. Read error message
3. Compare with `solution.ts`
4. Check edge cases in tests

### Don't Understand the Concept

1. Re-read `README.md`
2. Study examples
3. Read [Effect documentation](https://effect.website/docs/)
4. Ask in [Discord](https://discord.gg/effect-ts)

### TypeScript Errors

1. Check imports
2. Make sure you're using correct types
3. Look at function signatures in documentation
4. Use IDE hints (hover)

## Additional Resources

### Documentation

- [Effect Documentation](https://effect.website/docs/) - official documentation
- [API Reference](https://effect-ts.github.io/effect/) - API reference
- [Effect Blog](https://effect.website/blog/) - articles and tutorials

### Community

- [Discord](https://discord.gg/effect-ts) - community chat
- [GitHub](https://github.com/Effect-TS/effect) - source code
- [Twitter](https://twitter.com/EffectTS_) - news

### Videos

- [Effect YouTube](https://youtube.com/@effect-ts) - official channel
- [Effect Talks](https://effect.website/events/) - conferences and meetups

## Next Steps

After completing all exercises:

1. **Create your own project** - apply knowledge in practice
2. **Explore the ecosystem** - `@effect/platform`, `@effect/schema`, `@effect/cli`
3. **Contribute** - help improve Effect
4. **Share experience** - write an article or give a talk

Good luck learning Effect! 🚀
