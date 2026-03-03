# AGENTS.md

## Changelog Sync Rule
- `/src/assets/scripts/changelog.js` reads changelog content from `/src/assets/misc/CHANGELOG.md`.
- When `/misc/markdowns/CHANGELOG.md` changes, update `/src/assets/misc/CHANGELOG.md` in the same change.

## Post-feature Implementation Git Operations
- After completing a new feature, run `git push origin main` then `git pull origin main`.
- This rule still applies when the codespace is not clean (there are modified or untracked files).
