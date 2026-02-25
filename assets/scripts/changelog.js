function showChangelog() {
    let changelog = `
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

        **𝑃** — Promise

        **⁇** — Undefined (\`undefined\`, \`null\`, \`NaN\`)

        **𝑝** — Property name, for example: \`backdrop-filter\` (CSS) or \`src\` (HTML attribute)

        **𝘦** — Event name, for example: \`onerror\` of \`window.onerror\`, or \`keyup\`

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

        - Added a \`⋮ Set UI sound volume\` to the \`⋮ Preferences\` tab to change UI sound volume

        - Added \`⋮ Open Project Noema's GitHub repo\` and \`⋮ Report an issue on GitHub\` selections to the help tab

        - Holding the Meta key now "neuters" certain actions, such as pressing Ctrl or Alt in the main menu

        - Changelog is now hash-based, meaning that if the changelog updates without a version number change, the changelog now appears

        - Remapped Ctrl and Alt to Q and E, respectively.


        ## API Changes
        - Added \`𝑓 startsWithAmount\` and \`𝑓 endsWithAmount\` to \`𝘰 String.prototype\`

        - Added \`𝑓 last\` to \`𝘰 HTMLCollection.prototype\` and \`𝘰 String.prototype\`

        - Added \`𝑓 playSound\` API


        ## Bugfixes
        - Fixed bug where toggling the favicon from colored to monochrome would always make the favicon default to black

        - Heading sizes now properly work on the changelog dialog

        - Added (previously missing) punctuation handler to changelog

        - Fixed Battery API warning listener crash on browsers without \`𝑓 navigator.getBattery\`


        ## Misc.
        - Added Noema logo (conceptual) to source code

        - Added \`⋮ Noema\` theme (will change if Noema's logo changes)

        - Added \`⋮ Trans Flag\` theme

        - Added \`⋮ Frogleaf\` theme

        - Moved \`⋮ Watermelon Sugar\` theme up on the theme list for separation between flag-based themes and non-flag-based themes

        - Updated save file format

        - Added environment checks and warnings

        - Reworked sound engine

        - Reworked changelog logic
    `;

    let changelogParts = changelog.split('---');
    changelogParts[1].split('\n').forEach(line => {
        const symbolRegex = /\*\*(.+)\*\*/;
        const symbol = line.match(symbolRegex) ? line.match(symbolRegex)[1] : null;
        if (isDefined(symbol)) {
            changelogParts[2] = changelogParts[2].replaceAll(`${symbol} `, '');
            changelogParts[2] = changelogParts[2].replaceAll(symbol, '');
        }
    });

    const semverMatch = [.../# Changelog for Noema v?((\d+)\.(\d+)\.(\d+)(?:-(.+\.?)+)?)/gm.exec(changelog)].slice(1);
    const semver = semverMatch[0];
    const changelogVersion = {
        major: semver[1],
        minor: semver[2],
        patch: semver[3]
    };

    if (CRC32.str(changelog) !== localStorage.lastChangelogHash) {
        bandDialog(`v${semver} Changelog`, '', (dialog) => {
            dialog.style.pointerEvents = 'auto';
            let change = document.createElement('h1');
            change.style.cssText = "color: #fff; font-family: 'Manrope', monospace;";
            dialog.appendChild(change);
            const text = changelogParts.last().split('\n');
            text.forEach(textline => {
                const line = textline.trim(' ');
                if (line.length < 1) return;
                if (line.startsWith('#')) {
                    if (dialog.children.last() !== change) dialog.appendChild(document.createElement('br'));

                    let header = document.createElement(`h${Math.min(6, line.startsWithAmount('#'))}`);
                    header.textContent = line.trimStart('#', ' ');
                    header.style.cssText = `
                        color: #fff;
                        font-family: 'Manrope', monospace;
                        font-weight: bolder;
                        transition: text-shadow .5s ease;
                    `;
                    header.onmouseenter = () => {
                        header.style.textShadow = `0px 0px ${10 / Math.min(6, line.startsWithAmount('#')).floor()}px #fff`;
                    };
                    header.onmouseout = () => {
                        header.style.textShadow = '0px 0px 0px #fff';
                    };

                    dialog.appendChild(header);
                } else {
                    let changeSpan = document.createElement('span');
                    changeSpan.style.cssText = `
                        text-shadow: 0px 0px 0px #fff;
                        transition: text-shadow .25s ease;
                    `;
                    changeSpan.onmouseenter = () => {
                        changeSpan.style.textShadow = '0px 0px 5px #fff';
                    };
                    changeSpan.onmouseleave = () => {
                        changeSpan.style.textShadow = '0px 0px 0px #fff';
                    };
                    dialog.appendChild(changeSpan);
                    let text = line
                        .trimStart('-')
                        .trim(' ')
                        .replaceAll('``', '`')
                        .replaceAll('```', '`|');
                    if (!isDefined(text) || text.length < 1) return;
                    let finalText = `• ${text}${/[\w"'`\)]/.test(text.last()) ? '.' : ''}`;

                    finalText.split('`').forEach((subtext, i) => {
                        if (i % 2) {
                            let change = document.createElement('a');
                            change.textContent = subtext.trimStart('|');
                            change.style.cssText = `
                                color: #fff;
                                font-family: monospace;
                                font-weight: bold;
                                background-color: #141020;
                                border-radius: 5px;
                                padding: 4px;
                                text-shadow: none;
                                transition: background-color .5s ease;
                            `;
                            change.onmouseenter = () => {
                                change.style.backgroundColor = '#282030';
                            };
                            change.onmouseleave = () => {
                                change.style.backgroundColor = '#141020';
                            };
                            changeSpan.appendChild(change);
                        } else {
                            let change = document.createElement('a');
                            change.textContent = subtext;
                            change.style.cssText = "color: #fff; font-family: 'Manrope', monospace;";
                            changeSpan.appendChild(change);
                        }
                    });

                    dialog.appendChild(change);
                    dialog.appendChild(document.createElement('br'));
                }
            });
        }, null, false);
    }

    localStorage.lastChangelogHash = CRC32.str(changelog);
}
