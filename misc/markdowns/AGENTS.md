# AGENTS.md

## Changelog Sync Rule
- `/src/assets/scripts/changelog.js` reads changelog content from `/src/assets/misc/CHANGELOG.md`.
- When `/misc/markdowns/CHANGELOG.md` changes, update `/src/assets/misc/CHANGELOG.md` in the same change.

## Git operations
- After completing code, run `git push origin main` then `git pull origin main`
