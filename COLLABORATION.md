# Collaboration Guidelines

This document explains how contributors can work with the Noema codebase. Since the repository is relatively simple and lacks formal tooling, these guidelines are intentionally lightweight but are designed to keep the project orderly and approachable.

## Getting involved

1. **Fork the repository** (if you do not have write access) and open a pull request (PR) against `main`.
2. If you are a member of the core team you may work directly on `main`, but feature branches are encouraged.
3. PRs should include a brief description of what was changed and, if relevant, how to exercise the new behaviour in the browser.
4. All contributions must be licensed under the project's existing license (see `LICENSE`).

## Branching and commits

* Use feature branches named like `feature/description` or `fix/description`.
* Rebase or merge `main` frequently to keep your branch up to date.
* Commit messages should be short (50 characters or less) with a more detailed body if necessary.
* Squash fixup commits before merging to keep history clean.

## Code structure and style

* JavaScript files live in `src/assets/scripts`. Helper modules are placed in `src/assets/scripts/modules` and are typically loaded with `include.js` or by the core engine.
* When adding new JS files, update `preinit.js` or `start.js` if they need to be loaded automatically.
* Follow the existing style: spaces for indentation, `camelCase` for identifiers, and minimal global state. Comments are appreciated when logic is non‑obvious.
* No transpilation or minification is performed; write code that works in modern browsers (ES6+).

## Testing and validation

* There are no automated tests at present. Manual testing in a browser is expected for every change.
* Verify that your changes work both via `file://` and when served over HTTP (e.g., with `npx serve` or any simple static server).
* Check developer console for errors and warnings during operation.

## Pull requests and reviews

* Add screenshots or instructions when a change affects the UI.
* Reviewers will generally verify functionality and adherence to style.
* Be responsive to review comments and update your PR promptly.

## Communication

* Core discussions happen through GitHub issues and PR comments. Use those channels to propose large changes or ask questions.
* For quick informal chat, the maintainer has provided an email (`sophb.code@proton.me`) but it's preferable to keep conversations in the repository.

## Documenting work

* Update `misc/markdowns/TODO.md` or add new documentation files when you add significant features.
* If you modify the versioning behaviour, edit `misc/markdowns/VERSIONING.md` accordingly.

## Release management

* Releases follow the versioning spec in `misc/markdowns/VERSIONING.md`. Tag the repository appropriately when a new version is ready.
* Minor/patch updates may be merged directly by a maintainer; major features should be discussed beforehand.

### Notes for maintainers

* A basic linter/formatter already runs on every commit, but you may still consider adding a package manager or test framework if the project expands. Guidelines can be revised as needed.

* The `ACRONYMS.md` file lists project abbreviations such as **PO** (plain object) and should be consulted when unfamiliar terms appear.
* The repository is intentionally minimal. Keep dependencies to a minimum and avoid introducing build steps unless absolutely necessary.

Thanks for contributing to Noema. Every pull request and suggestion helps the project grow.
