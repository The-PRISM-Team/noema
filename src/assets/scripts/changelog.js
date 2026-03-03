const changelogMarkdownPath = '/assets/misc/CHANGELOG.md';
const fallbackChangelog = `# Changelog for Noema v0.0.0
- Failed to load \`${changelogMarkdownPath}\`.`;

async function loadChangelogMarkdown() {
    try {
        if (typeof fetchText === 'function') {
            return await fetchText(changelogMarkdownPath);
        }

        const res = await fetch(changelogMarkdownPath);
        return await res.text();
    } catch {
        return fallbackChangelog;
    }
}

async function showChangelog() {
    let changelog = await loadChangelogMarkdown();

    let changelogParts = changelog.split('---');
    if (changelogParts.length >= 3) {
        changelogParts[1].split('\n').forEach(line => {
            const symbolRegex = /\*\*(.+)\*\*/;
            const symbol = line.match(symbolRegex) ? line.match(symbolRegex)[1] : null;
            if (isDefined(symbol)) {
                changelogParts[2] = changelogParts[2].replaceAll(`${symbol} `, '');
                changelogParts[2] = changelogParts[2].replaceAll(symbol, '');
            }
        });
    }

    const semverRegex = /# Changelog for Noema v?((\d+)\.(\d+)\.(\d+)(?:-(.+\.?)+)?)/gm;
    const semverMatch = [...(semverRegex.exec(changelog) ?? [null, '0.0.0-not.found', '0', '0', '0', 'not.found'])].slice(1);
    const semver = semverMatch[0];
    /*
    const changelogVersion = {
        major: semver[1],
        minor: semver[2],
        patch: semver[3]
    };*/

    const changelogHash = md5(changelog);
    if (changelogHash !== localStorage.lastChangelogHash) {
        localStorage.lastChangelogHash = changelogHash;
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
}
