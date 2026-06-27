# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-06-27
### Added
- Migrated codebase to modular **React + TypeScript + Vite** stack.
- Structured project layout for folders: `components`, `features`, `hooks`, `services`, `types`.
- Created custom React hooks `useRoiCalculator` and `useAeroSimulator` to cleanly separate business calculations from component renders.
- Added Vitest unit test suites for verification of mathematical formulas and markdown parser sanitization.
- Integrated multi-stage Docker build configs serving minified bundles over secure non-root Nginx proxies.
- Added CI/CD GitHub Action workflows, issue templates, and dependabot configurations.

### Changed
- Refined HTML5 Canvas particle physics rendering to display smooth side-flow confining air lines and particle charge capture animations.

## [1.0.0] - 2026-06-27
### Added
- Initial release of the single-page prototype containing the interactive GIS map, 2D simulation loop, cost calculators, and technical engineering design report.
