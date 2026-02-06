# Contributing to Effect Learning Exercises

Thank you for your interest in contributing! 🎉

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment (OS, Node version, etc.)

### Improving Exercises

You can help by:

1. **Fixing typos or errors** in README files
2. **Improving explanations** - make concepts clearer
3. **Adding better examples** - show real-world usage
4. **Enhancing tests** - add edge cases
5. **Completing Levels 4-15** - fill in placeholder exercises

### Adding New Exercises

When creating a new exercise:

1. Follow the existing structure:
   ```
   exercises/XX-topic/YY-exercise-name/
   ├── README.md
   ├── exercise.ts
   ├── solution.ts
   └── exercise.test.ts
   ```

2. **README.md** should include:
   - Concept explanation
   - Assignment description
   - Examples
   - Hints
   - Bonus challenges

3. **exercise.ts** should have:
   - Clear TODO comments
   - Type signatures
   - Function stubs

4. **solution.ts** should show:
   - Reference implementation
   - Comments on complex parts
   - Best practices

5. **exercise.test.ts** should cover:
   - Happy path
   - Edge cases
   - Error scenarios

### Pull Request Process

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/improve-error-handling
   ```
3. **Make your changes**
4. **Run tests**:
   ```bash
   npm test
   npm run check
   ```
5. **Commit** with clear messages:
   ```bash
   git commit -m "feat: add advanced error handling examples"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/improve-error-handling
   ```
7. **Create a Pull Request** with:
   - Description of changes
   - Why the change is needed
   - Any breaking changes

### Commit Convention

We use conventional commits:

- `feat:` - new feature or exercise
- `fix:` - bug fix
- `docs:` - documentation changes
- `test:` - test additions or fixes
- `refactor:` - code refactoring
- `chore:` - maintenance tasks

Examples:
```
feat: add Deferred exercise to advanced concurrency
fix: correct type signature in flatMap example
docs: improve explanation of Effect.gen
test: add edge cases for error handling
```

### Code Style

- Use TypeScript strict mode
- Follow existing code formatting
- Add comments for complex logic
- Keep functions focused and small
- Use descriptive variable names

### Testing

All exercises must have tests:

```typescript
import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("exercise-name", () => {
  it("should handle basic case", () => {
    const result = Effect.runSync(Exercise.myFunction(input))
    expect(result).toBe(expected)
  })

  it("should handle edge case", () => {
    // Test edge cases
  })

  it("should handle errors", () => {
    const exit = Effect.runSyncExit(Exercise.myFunction(badInput))
    expect(Exit.isFailure(exit)).toBe(true)
  })
})
```

### Documentation

When writing documentation:

- Use clear, simple language
- Provide practical examples
- Explain the "why", not just the "what"
- Link to official Effect docs when relevant
- Use code blocks with syntax highlighting

### Questions?

- Ask in [Effect Discord](https://discord.gg/effect-ts)
- Open a GitHub Discussion
- Tag maintainers in your PR

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/effect-learn.git
cd effect-learn

# Install dependencies
npm install

# Run tests
npm test

# Type check
npm run check

# Build
npm run build
```

## Project Structure

```
effect-learn/
├── exercises/          # All exercises
├── scripts/           # Helper scripts
├── test/              # Additional tests
├── README.md          # Main documentation
├── GUIDE.md           # User guide
├── CONTRIBUTING.md    # This file
└── PROJECT_STATUS.md  # Current status
```

## Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Credited in commit history

Thank you for helping make Effect more accessible to everyone! 🚀
