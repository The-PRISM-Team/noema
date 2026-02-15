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


        ## API Changes
        - Added \`𝑓 startsWithAmount\` and \`𝑓 endsWithAmount\` to \`𝘰 String.prototype\`

        - Added \`𝑓 last\` to \`𝘰 HTMLCollection.prototype\` and \`String.prototype\`

        - Reworked sound engine


        ## Bugfixes
        - Fixed bug where toggling the favicon from colored to monochrome would always make the favicon default to black        

        - Heading sizes now properly work on the changelog dialog

        - Added (previously missing) punctuation handler to changelog


        ## Misc.
        - Added Noema logo (conceptual) to source code

        - Added new \`⋮ Noema\` theme (will change if Noema's logo changes)

        - Moved \`⋮ Watermelon Sugar\` theme up on the theme list for separation between flag-based themes and non-flag-based themes

        - Added environment checks and warnings
    `;
    let changelogParts = changelog.split('---');
    changelogParts[1].split("\n").forEach(line => {
        const symbolRegex = /\*\*(.+)\*\*/;
        const symbol = line.match(symbolRegex) ? line.match(symbolRegex)[1] : null;
        if (isDefined(symbol)) {
            changelogParts[2] = changelogParts[2].replaceAll(`${symbol} `, '');
            changelogParts[2] = changelogParts[2].replaceAll(symbol, '');
        }
    });

    let versionRegex = /v(\d+.\d+.\d+)/;
    let changelogVersion = versionRegex.exec(changelogParts[0])[1];
    changelogVersion = {
        major: changelogVersion.split('.')[0],
        minor: changelogVersion.split('.')[1],
        patch: changelogVersion.split('.')[2]
    };

    let lastVersion = localStorage?.lastVersion;
    if (!isDefined(lastVersion)) lastVersion = '0.0.0';
    lastVersion = {
        major: lastVersion.split('.')[0],
        minor: lastVersion.split('.')[1],
        patch: lastVersion.split('.')[2]
    };

    if (
        (changelogVersion.major > lastVersion.major) ||
        (changelogVersion.minor > lastVersion.minor) ||
        (changelogVersion.patch > lastVersion.patch)
    ) {
        bandDialog(`v${Object.values(changelogVersion).join('.')} Changelog`, '', (dialog) => {
            dialog.style.pointerEvents = 'auto';
            let change = document.createElement('h1');
            change.style.cssText = "color: #fff; font-family: 'Manrope', monospace;";
            dialog.appendChild(change);
            const text = changelogParts.last().split('\n');
            text.forEach(textline => {
                const line = textline.trim(' ');
                console.log(line);
                if (line.length < 1) return;
                if (line.startsWith("#")) {
                    if (dialog.children.last() !== change) dialog.appendChild(document.createElement('br'));

                    let header = document.createElement(`h${Math.min(6, line.startsWithAmount("#"))}`);
                    header.textContent = line.trimStart('#', ' ');
                    header.style.cssText = `
                        color: #fff;
                        font-family: 'Manrope', monospace;
                        font-weight: bolder;
                        transition: text-shadow .5s ease;
                    `;
                    header.onmouseenter = ()=>{
                        header.style.textShadow = `0px 0px ${10 / Math.min(6, line.startsWithAmount("#")).floor()}px #fff`;
                    };
                    header.onmouseout = ()=>{
                        header.style.textShadow = "0px 0px 0px #fff";
                    };

                    dialog.appendChild(header);
                } else {
                    let changeSpan = document.createElement('span');
                    changeSpan.style.cssText = `
                        text-shadow: 0px 0px 0px #fff;
                        transition: text-shadow .25s ease;
                    `;
                    changeSpan.onmouseenter = () => {
                        changeSpan.style.textShadow = "0px 0px 5px #fff";
                    };
                    changeSpan.onmouseleave = () => {
                        changeSpan.style.textShadow = "0px 0px 0px #fff";
                    };
                    /*
                    changeSpan.onmouseup = async () => {
                        await navigator.clipboard.writeText(changeSpan.textContent.substring(1).trim(' '))
                        let popup = document.createElement('div')
                        popup.style.cssText = `
                            background-color: #111;
                            outline: solid 2px #333;
                            text-shadow: none;
                            border-radius: 15px;
                            padding: 5px;
                            position: fixed;
                            left: 50%;
                            top: 50%;
                            transform: translate(-50%, -50%) translateY(125%);
                            opacity: 0%;
                            transition: opacity .5s ease;
                            width: fit-content;
                            height: fit-content;
                        `
                        dialog.appendChild(popup)
                        let text = document.createElement('a')
                        text.textContent = 'Copied! (click to hide)'
                        text.style.cssText = `
                            color: #fff;
                            font-family: 'Manrope', monospace;
                        `
                        popup.appendChild(text)
                        requestAnimationFrame(()=>popup.style.opacity = "100%")
                        let removeTimeout = setTimeout(()=>{
                            popup.style.transition = "opacity 1.5s ease"
                            popup.style.opacity = "0%"
                            setTimeout(()=>{
                                popup.remove()
                            }, 1.5e3)
                        }, 500 + 5e3)
                        popup.onmousedown = () => {
                            clearTimeout(removeTimeout)
                            popup.style.transition = "opacity .25s ease"
                            popup.style.opacity = "0%"
                            setTimeout(()=>{
                                popup.remove()
                            }, .25e3)
                        }
                    }*/
                    dialog.appendChild(changeSpan);
                    let text = line
                    .trimStart('-')
                    .trim(' ')
                    .replaceAll('``', '`')
                    .replaceAll('```', '`|');
                    if (!isDefined(text)) return;
                    let finalText = `• ${text}${/[\w"'`\)]/.test(text.last()) ?  "." : ''}`;

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
                            change.onmouseenter = ()=> {
                                change.style.backgroundColor = "#282030";
                            };
                            change.onmouseleave = ()=> {
                                change.style.backgroundColor = "#141020";
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

    localStorage.lastVersion = [version.major, version.minor, version.patch].join('.');
}
