# Changelog for Noema v0.16.0
*(may have missing or inaccurate information)*

*(Note: minor internal changes, cleanups and insignificant details aren't (and won't be) included in changelogs.)*


*Symbols used:*
---
**𝑛** — Number

**𝑠** — String

**𝑏** — Boolean

**𝘢** — Array

**𝘰** — Object

**𝑓** — Function

**𝑐** — Class

**⁇** — Undefined (`undefined`, `null`, `NaN`)

**𝑝** — Property name, for example: `backdrop-filter` (CSS) or `src` (HTML attribute)

**𝘦** — Event name, for example: `onerror` of `window.onerror`, or `keyup`

**?** — Deterministic (can be or act like multiple types)

**⋮** — Non-type / miscellaneous (e.g., a filename)

---


# Milestone: Games!
- working on it :/


## UI Changes
- Made changelog text a bit more interactive

- Code blocks now work properly in the changelog dialog

- The startup logo and favicon now use Noema's new (conceptual) logo

- Made UI background more "blurry" (when effects are turned on)

- Added a battery indicator to the bottom left of the screen

- Added a `⋮ Set UI sound volume` to the `⋮ Preferences` tab to change UI sound volume

- Added `⋮ Open Project Noema's GitHub repo` and `⋮ Report an issue on GitHub` selections to the help tab


## API Changes
- Added `𝑓 startsWithAmount` and `𝑓 endsWithAmount` to `𝘰 String.prototype`

- Added `𝑓 last` to `𝘰 HTMLCollection.prototype` and `String.prototype`

- Added `𝑓 playSound` API


## Bugfixes
- Fixed bug where toggling the favicon from colored to monochrome would always make the favicon default to black        

- Heading sizes now properly work on the changelog dialog

- Added (previously missing) punctuation handler to changelog


## Misc.
- Added Noema logo (conceptual) to source code

- Added new `⋮ Noema` theme (will change if Noema's logo changes)

- Moved `⋮ Watermelon Sugar` theme up on the theme list for separation between flag-based themes and non-flag-based themes

- Added environment checks and warnings

- Reworked sound engine