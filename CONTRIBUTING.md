# Contributing to AeroDust-Shield

First off, thank you for taking the time to contribute! We welcome contributions to improve the dust mitigation algorithms, UI designs, calculations, or documentation.

## Code of Conduct
This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs
* Check the existing issues database before filing a new one.
* Use the **Bug Report Template** when submitting an issue.
* Provide steps to reproduce, OS/browser specifications, and console logs.

### Feature Suggestions
* Submit ideas via the **Feature Request Template**.
* Provide mockups or mathematical details where applicable.

### Pull Requests
1. Fork the repo and create your branch from `main`:
   ```bash
   git checkout -b feature/amazing-feature
   ```
2. Write clean code adhering to the styling rules:
   * Keep components modular and reusable.
   * Write comprehensive unit tests for mathematical models inside `tests/unit`.
   * Enforce strict typing on TypeScript declarations.
3. Ensure the test suite passes locally:
   ```bash
   npm run test
   ```
4. Verify build succeeds:
   ```bash
   npm run build
   ```
5. Push to your branch and open a Pull Request using the Pull Request template.

## Coding Standards
* **Formatting**: Run `npm run format` (Prettier) before pushing.
* **Typing**: Use strict TypeScript compiler properties. No `any` declarations.
* **Commit Messages**: We enforce Conventional Commits:
  * `feat: add district GIS hover details`
  * `fix: repair canvas frame width sizing`
  * `docs: update installation instructions`
  * `test: append calculation suite testcases`
