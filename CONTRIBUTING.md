# Contributing to ReviewMind

We welcome contributions to ReviewMind! Whether you're adding new LLM providers, writing new rules, or fixing bugs, your help is appreciated.

## Getting Started

1. Fork the repository
2. Install dependencies (e.g. `npm install`)
3. Check the `docs/` folder for architectural guides

## Adding a New Provider

If you'd like to add support for a new LLM provider, please add a new adapter in the `providers/` directory implementing the `base-provider` interface.

## Adding Custom Rules

Language and framework-specific rules can be found in `rules/languages/` and `rules/frameworks/`. If you find a common edge case or bug pattern, feel free to submit a PR to add it!

## Submitting a Pull Request

- Keep PRs focused on a single feature or bug.
- Ensure all tests pass.
- By submitting a PR, you agree that your contributions will be licensed under the project's open-source license.
