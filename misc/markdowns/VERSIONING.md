# PRISM Project Versioning System Documentation 
- Written in January of 2026

This is a spec document defining how PRISM Project's versioning should be formatted.

*(Note: this spec is prone to changes in the future, since PRISM is just starting out and as it evolves, everything related to it does too.
Since the spec will most likely change, this spec could become outdated in the future, so always make sure to switch to a newer versioning system when one is available.)*

## Keyword definitions
"Project": An independent system with a (public) codename, e.g.: Project Noema.

"MAJOR": An update that significantly changes how the Project looks, works or feels.

"MINOR": An update that brings new content, no matter if it's mostly bugfixes. If the update fundamentally changes how the Project works, looks or feels, it is instead classified as MAJOR, not MINOR nor PATCH.

"PATCH": An update that fixes (or patches) a handful or many bugs. If any of the bugfixes solve a critical issue of the Project, it is instead classified as MINOR, not PATCH nor MAJOR. Patches could also include styling changes, but if the style changes too much, it's classified as MINOR, not MAJOR nor PATCH.

"Alpha" or "alpha": The first phase of development of a Project. Every alpha update should contain updates related to one specific focus or topic, and treated as a stone added to form a foundation that beta and release versions can stand on top of.

"Beta" or "beta": The second phase of development of a Project. Every beta update can contain a few changes to a lot of changes, and they act as the final layer until release, polishing up what the alpha builds added and defining what the Project will eventually end up as.

"Release" or "release": The final phase of development of a Project. This is where the Project will stand for the most of its lifespan, and every release update will add more content that the beta versions couldn't provide, and add more features to keep up with its userbase and add more highly-requested features if there are any.

"Archived" or "archived": The end of the lifespan of a Project. A Project should if the userbase becomes extemely low (0-10 users), a legal issue arrives, or something that blocks further development. There should be only 1 archived version, no more, no less, and archived versions should not be updated, since that defeats the point of archival. Projects that haven't reached release could also be archived, if development doesn't succeed or goes badly.

"sub-number": A number inside a version number that defines the value for either MAJOR, MINOR or PATCH.

"bumped up": Short for "increased by one". Strictly used when talking about a sub-number of a version number.


# Versioning Spec

## Alpha versioning
- Formatting: ``v0.<CHANGE>-test.<DESCRIPTION>``

  - `<CHANGE>`: A number that gets bumped up with every update made to the code, no matter if it's MAJOR, MINOR or PATCH. In short, it denotes the number of changes made.
  - `<DESCRIPTION>`: A short description of the content in the update, with words separated by dots, required to be 0-3 words long at maximum. It shouldn't be too descriptive, but it should convey the meaning of what it adds/changes. Notable examples include "`spaghetti`", "`power.bugfix`" and "`ui.suboptions.labels`", all taken from Project Noema.

### Additional notes:
- The first alpha version number is always `v0.0-test.<DESCRIPTION>`. `<DESCRIPTION>` follows the same definition provided above.
- Alpha versions shouldn't contain too much content, compared to a beta or release version, more so like small first steps. Updates should follow a consistent theme, and that theme should follow what the `<DESCRIPTION>` is describing.


## Beta versioning
- Formatting: ``v0.<CONTENT>.<PATCH>``

  - `<CONTENT>`: This number strictly gets bumped up only if the change is classified as MAJOR or MINOR, and never PATCH.
  - `<PATCH>`: This number strictly gets bumped up only if the update is classified as PATCH, not MAJOR nor MINOR.

### Additional notes:
- The initial value of `<CONTENT>` is the last value of `<CHANGE>` from the alpha version number, but bumped up.

  - For example: if the last alpha version number was `v0.7-test.finalizing`, then the first beta version number should be `v0.8.0`.
- The initial value of `<PATCH>` is always `0`.


## Release versioning
- Formatting: ``v<MAJOR>.<MINOR>.<PATCH>``

  - `<MAJOR>`: This number strictly gets bumped up only if the change is classified as MAJOR, not MINOR nor PATCH.
  - `<MINOR>`: This number strictly gets bumped up only if the change is classified as MINOR, not MAJOR nor PATCH.
  - `<PATCH>`: This number strictly gets bumped up only if the update is classified as PATCH, not MAJOR nor MINOR.

### Additional notes:
- The first release version number is always `v1.0.0`, regardless of the last beta version number.


## Archived versioning
- Formatting: ``v<MAJOR>.<MINOR>-archived.<YEAR>.<MONTH>.<TIMESTAMP>``

  - `<MAJOR>`: Either the value of `<MAJOR>` if the last version was in release, the value of `<CONTENT>` if the last version version was in beta, or `0` if the last version was in alpha.
  - `<MINOR>`: Either the value of `<MINOR>` if the last version was in release, the value of `<PATCH>` if the last version was in beta, the value of `<CHANGE>` if the last version was in alpha.
  - `<YEAR>`: The year when the Project was archived.
  - `<MONTH>`: The month of the year (as a number from 1 to 12) when the Project was archived.
  - `<TIMESTAMP>`: The unix timestamp of the date\* on which the version number was written. (*Can have up to 15 seconds of error.)