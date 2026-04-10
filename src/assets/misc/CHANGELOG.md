# Changelog for Noema (toward v0.16.0)
*(may have missing or inaccurate information)*

*(Note: minor internal changes, cleanups and insignificant details aren't (and won't be) included in changelogs.)*

---

*Symbols used:*
---
**𝑛** — Number

**𝑠** — String

**𝑏** — Boolean

**𝘢** — Array

**𝘰** — Object

**𝑓** — Function

**𝑐** — Class

**𝑃** — Promise

**⁇** — Undefined (`undefined`, `null`, `NaN`)

**𝑝** — Property name, for example: `backdrop-filter` (CSS) or `src` (HTML attribute)

**𝘦** — Event name, for example: `onerror` of `window.onerror`, or `keyup`

**?** — Deterministic (can be or act like multiple types)

**⋮** — Non-type / miscellaneous (e.g. a filename)

---


# Milestone: Games!
- todo!


## UI Changes
- Added `⋮ Fast Reboot` to the `⋮ Power` tab to skip startup animation once on the next boot

- Added `⋮ Fast boot by default` to the `⋮ Preferences` tab so startup animation only plays on normal reboot

- Added `⋮ Set master volume` to the `⋮ Audio` tab

- Made changelog text a bit more interactive

- Code blocks now work properly in the changelog dialog

- The startup logo and favicon now use Noema's new (conceptual) logo

- Made closed UI background darker and more blurry

- Added a battery indicator to the bottom left of the screen

- Added a `⋮ Set UI sound volume` to the `⋮ Preferences` tab to change UI sound volume

- Added `⋮ Open Project Noema's GitHub repo` and `⋮ Report an issue on GitHub` selections to the help tab

- Changelog is now hash-based, meaning that if the changelog updates without a version number change, the changelog now appears

- Remapped Ctrl and Alt to Q and E respectively, due to input conflicts

- Added UI localization
  - Added `⋮ Language` tab
  - Added Right-to-Left UI support

- Revamped subpages

- Optimized UI

- Added haptic feedback to UI


## API Changes
- Moved UI properties to `𝘰 selected` object

- Added `𝑓 startsWithAmount` and `𝑓 endsWithAmount` to `𝘰 String.prototype`

- Added `𝑓 last` to `𝘰 HTMLCollection.prototype` and `𝘰 String.prototype`

- Added `𝑓 playSound` API

- Added locale APIs (`𝑓 getLocaleStr`, `𝑓 getLocaleTempStr`, `𝑓 getLocaleTimeStr`, `𝘰 locales`, `𝘰 locale`) to `⋮ lang.js`
  - Added `𝑠 localStorage.locale` property

- Added `𝑓 fastReboot` function

- Renamed `𝑓 drawSpaghetti` to `𝑓 animSpaghetti`

- Added `𝑓 drawSpaghettiFrame` function

- Added `𝑓 explodeSpaghetti` function

- Added `𝑓 hapticFeedback` API


## Bugfixes
- Added click/enter fallbacks when startup or background audio autoplay is blocked by the browser

- Fixed startup flow edge-cases around refresh/reboot state handling

- Fixed bug where toggling the favicon from colored to monochrome would always make the favicon default to black

- Heading sizes now properly work on the changelog dialog

- Added (previously missing) punctuation handler to changelog

- Fixed Battery API warning listener crash on browsers without `𝑓 navigator.getBattery`


## Misc.
- Added startup state flags used by fast-boot and reboot flows (`𝑏 fromRefresh`, `𝑏 fastBoot`, and `𝑏 fastBootDefault`)

- Added `⋮ Noema` theme (will change if Noema's logo changes)

- Added `⋮ Trans Flag` theme

- Added `⋮ Frogleaf` theme

- Moved `⋮ Watermelon Sugar` theme up on the theme list for separation between flag-based themes and non-flag-based themes

- Updated save file format

- Added environment checks and warnings

- Reworked sound engine

- Changelog now appears based on a hash (MD5) rather than the version number
