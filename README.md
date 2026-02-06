# Effect Learning Exercises

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Effect](https://img.shields.io/badge/Effect-3.0+-purple.svg)](https://effect.website/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A progressive, hands-on course for learning Effect from basic concepts to advanced patterns, inspired by Exercism.

## 🎯 What is This?

This project contains **47 learning exercises** divided into **15 levels**, covering all core Effect concepts through practical, test-driven assignments.

Unlike tutorials or documentation, this is a **structured learning path** where you:
- ✅ Write real code, not just read examples
- ✅ Get instant feedback from automated tests
- ✅ Compare your solutions with reference implementations
- ✅ Progress from basics to advanced patterns systematically

## 📚 What You'll Learn

- ✅ **Basics** - creating, running, transforming Effects
- ✅ **Error Handling** - typed errors, catching, fallback strategies
- ✅ **Control Flow** - conditionals, loops, combining effects
- ✅ **Concurrency** - Fibers, racing, parallel execution
- ✅ **Resource Management** - Scope, acquire/release patterns
- ✅ **Services & Layers** - Dependency Injection the Effect way
- ✅ **State Management** - Ref, SynchronizedRef, SubscriptionRef
- ✅ **Advanced Concurrency** - Deferred, Queue, PubSub, Semaphore
- ✅ **Streams & Sink** - processing data streams
- ✅ **Scheduling & Caching** - retry policies, caching strategies
- ✅ **Batching & Requests** - optimizing request patterns
- ✅ **Observability** - Logging, Metrics, Tracing
- ✅ **Configuration & Runtime** - managing app configuration
- ✅ **Advanced Patterns** - Interruption, Supervision, Effect.gen

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/effect-learn.git
cd effect-learn

# Install dependencies
npm install
# or
pnpm install
# or
bun install
```

### Your First Exercise

1. **Read the guide**:
```bash
cat exercises/GUIDE.md
```

2. **Start with Level 1**:
```bash
cd exercises/01-basics/01-creating-effects
cat README.md
```

3. **Implement the functions** in `exercise.ts`

4. **Run the tests**:
```bash
npm test exercises/01-basics/01-creating-effects
```

5. **Compare with solution** if stuck:
```bash
cat solution.ts
```

## 📖 Structure

```
exercises/
├── 01-basics/              # Level 1: Basics (3 exercises)
├── 02-error-handling/      # Level 2: Error Handling (3 exercises)
├── 03-control-flow/        # Level 3: Control Flow (3 exercises)
├── 04-concurrency/         # Level 4: Concurrency (3 exercises)
├── 05-resource-management/ # Level 5: Resource Management (2 exercises)
├── 06-services/            # Level 6: Services (3 exercises)
├── 07-state-management/    # Level 7: State Management (3 exercises)
├── 08-advanced-concurrency/# Level 8: Advanced Concurrency (4 exercises)
├── 09-streams/             # Level 9: Streams (4 exercises)
├── 10-sink/                # Level 10: Sink (2 exercises)
├── 11-scheduling-caching/  # Level 11: Scheduling & Caching (3 exercises)
├── 12-batching-requests/   # Level 12: Batching (2 exercises)
├── 13-observability/       # Level 13: Observability (3 exercises)
├── 14-configuration-runtime/# Level 14: Configuration (3 exercises)
├── 15-advanced-patterns/   # Level 15: Advanced Patterns (3 exercises)
├── EXERCISES.md            # Complete list of exercises
├── GUIDE.md                # Usage guide
└── test-utils.ts           # Testing utilities
```

### Each Exercise Contains:
- 📝 `README.md` - concept explanation and assignment
- 💻 `exercise.ts` - your solution file
- ✅ `solution.ts` - reference solution
- 🧪 `exercise.test.ts` - automated tests

## 🧪 Commands

```bash
# Run all tests
npm test

# Run specific exercise tests
npm test exercises/01-basics/01-creating-effects

# Watch mode
npm test -- --watch

# Coverage report
npm run coverage

# Type checking
npm run check

# Build
npm run build
```

## 📝 How to Work with Exercises

1. **Read README.md** - understand the concept
2. **Implement exercise.ts** - write your code
3. **Run tests** - verify your solution
4. **Compare with solution.ts** - if you're stuck
5. **Track progress** - mark completed in EXERCISES.md

## 🎯 Recommended Learning Path

Exercises are organized by increasing difficulty:

1. **Beginners**: Levels 1-3 (Basics, Errors, Control Flow) - ✅ **Fully Ready**
2. **Intermediate**: Levels 4-6 (Concurrency, Resources, Services)
3. **Advanced**: Levels 7-15 (State, Streams, Observability, etc.)

## 🌟 Features

- 🎯 **Progressive Learning** - from simple to complex
- 📝 **Detailed Explanations** - concept + examples + hints
- ✅ **Automated Tests** - instant feedback
- 🎓 **Reference Solutions** - learn best practices
- 🛠️ **CLI Tools** - convenient exercise management
- 📚 **Complete Documentation** - guides and resources

## 📊 Current Status

- ✅ **Levels 1-3**: Fully ready with detailed content (9 exercises)
- 📝 **Levels 4-15**: Basic structure ready to fill (38 exercises)

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for details.

## 📚 Additional Resources

- 📖 [Effect Documentation](https://effect.website/docs/) - official docs
- 💬 [Effect Discord](https://discord.gg/effect-ts) - community chat
- 🐙 [Effect GitHub](https://github.com/Effect-TS/effect) - source code
- 📝 [Effect Blog](https://effect.website/blog/) - articles and tutorials
- 🎥 [Effect YouTube](https://youtube.com/@effect-ts) - video content

## 🤝 Contributing

Found a bug or want to improve an exercise? Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📄 License

MIT © [Your Name]

---

**Happy learning Effect!** 🚀

If you find this useful, please ⭐ star the repository and share it with others!
