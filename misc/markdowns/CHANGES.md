# Change Log (Engineering)

## 2026-02-16
- Added foundational semantic version helpers in `js/modules/version.js`:
  - `parseSemver(value, fallback)`
  - `compareSemver(a, b)`
- Updated loader order in `js/preloader.js` to include `js/modules/version.js` before runtime scripts that can use semantic version checks.
- Fixed changelog version-gating logic in `js/changelog.js`:
  - Replaced fragile field-wise string comparison with semantic comparison.
  - Added safe fallbacks if helper functions are unavailable.
  - Removed debug console logging and added empty-line guard in text rendering.
- Fixed Battery API compatibility bug in `js/base.js`:
  - Guarded `navigator.getBattery()` listener registration so unsupported browsers do not throw.
  - Preserved existing battery behavior where the API is available.
- Synced changelog content between `CHANGELOG.md` and `js/changelog.js` (with escaped backticks in JS template literal).

## Validation Performed
- Ran syntax checks across all JavaScript files with `node --check`.
- Re-ran syntax checks after edits to confirm no parse regressions.
- Verified `CHANGELOG.md` and unescaped `js/changelog.js` content match exactly.
