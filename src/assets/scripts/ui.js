let ui = document.getElementById('ui');

let transitioning = false;
async function transition() {
    if (transitioning) throw new Error("Transition already in progress!");
    transitioning = true; // congrats!! :kekw:
    ui.style.width = "0px";
    ui.style.height = "50vh";
    setTimeout(() => {
        ui.style.width = "";
        ui.style.height = "";
        transitioning = false;
    }, 1.5e3);
}

function focusUIOption(id) {
    let optionDiv = document.getElementById('ui-options');

    requestAnimationFrame(() => {
        // alignment
        let target = document.getElementById(`ui-option${id}`);
        let targetRect = target.getBoundingClientRect();

        let uiRect = document.getElementById('ui').getBoundingClientRect();

        let targetCenter = targetRect.left + targetRect.width / 2;
        let desiredCenter = uiRect.left + uiRect.width / 2;

        let delta = desiredCenter - targetCenter;

        optionDiv.style.left = `${optionDiv.offsetLeft + delta}px`;

        // more-arrow shit
        let optionDivRect = optionDiv.getBoundingClientRect();

        let leftArrow = document.getElementById('more-left');
        let rightArrow = document.getElementById('more-right');

        if (optionDivRect.left < uiRect.left)
            leftArrow.style.opacity = "100%";
        else
            leftArrow.style.opacity = "0%";

        if (optionDivRect.right > uiRect.right)
            rightArrow.style.opacity = "100%";
        else
            rightArrow.style.opacity = "0%";
    });
}

let selectedOption = 0;
let selectedSuboption = 0;
let selectedSuboptions = {};
const uiSuboptionActions = {};
function normalizeActionId(value = '') {
    return value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'action';
}
function registerUISuboptionAction(action, actionIdBase = 'action') {
    if (!isDefined(action)) return null;
    let handler = action;
    if (typeof handler === 'string') {
        // Backward-compatible path for existing string actions.
        handler = new Function(handler);
    }
    if (typeof handler !== 'function') {
        throw new TypeError('Suboption action must be a function or string.');
    }
    const base = normalizeActionId(actionIdBase);
    let actionId = base;
    let suffix = 1;
    while (isDefined(uiSuboptionActions[actionId])) {
        suffix++;
        actionId = `${base}-${suffix}`;
    }
    uiSuboptionActions[actionId] = handler;
    return actionId;
}
function selectUIOption(id) {
    let optionDiv = document.getElementById('ui-options');
    let options = optionDiv.querySelectorAll('a');
    let contents = document.getElementById('ui-contents').querySelectorAll('div');

    document.getElementById('more-left').style.opacity = "0%";
    document.getElementById('more-right').style.opacity = "0%";
    requestAnimationFrame(() => {
        options.forEach(option => option.classList.remove('selected'));
        contents.forEach(content => content.classList.remove('selected'));

        if (id === 0)
            document.getElementById('more-left').style.opacity = "0%";
        if (id === options.length - 1)
            document.getElementById('more-right').style.opacity = "0%";

        document.getElementById(`ui-content${id}`).style.display = 'revert';
        requestAnimationFrame(() => {
            document.getElementById(`ui-content${id}`).classList.add('selected');
        });
        document.getElementById(`ui-option${id}`).classList.add('selected');
        if (isNaN(selectedSuboptions[id]) || !selectedSuboptions[id]) {
            selectedSuboptions[id] = 0;
        }
        focusUIOption(id);
        if (prismflakesStarted) {
        }
    });

    selectedOption = id;
    selectUISuboption(selectedSuboptions[id]);
}
function selectUISuboption(id) {
    requestAnimationFrame(() => {
        selectedSuboption = id;
        let suboptions = document.getElementById(`ui-content${selectedOption}`).querySelectorAll('.ui-suboption');
        selectedSuboptions[selectedOption] = id;
        suboptions.forEach((suboption, i) => {
            suboption.style.top = `${20 + (-31 * (id - 3))}px`;
            let icon = suboption.querySelector('.ui-suboption-icon');
            if (i === id) {
                suboption.classList.add('selected');
                suboption.querySelector('.ui-suboption-text').style.display = '';
            } else {
                suboption.classList.remove('selected');
                suboption.querySelector('.ui-suboption-text').style.display = 'none';
                if (isDefined(icon))
                    icon.classList.remove('selected');
            }
            traverseDOM(suboption, (el) => {
                if (suboption.classList.contains('selected'))
                    el.classList.add('selected');
                else
                    el.classList.remove('selected');
            });
        });
    });
}
function executeUISuboption() {
    let suboption = document.getElementById(`ui-content${selectedOption}`).querySelector(`#ui-suboption${selectedSuboption}`);
    const actionId = suboption.dataset.action;
    if (isDefined(actionId) && isDefined(uiSuboptionActions[actionId])) {
        uiSuboptionActions[actionId]();
        if (isDefined(suboption.dataset.sound))
            playSound(suboption.dataset.sound);
        else
            playSound('confirm');
    }
}


// mommy pls fix
function createOption(name) {
    let uiOptions = document.getElementById('ui-options');
    let uiSuboptions = document.getElementById('ui-contents');
    let tab = document.createElement('a');
    tab.id = 'ui-option' + uiOptions.children.length;
    tab.className = 'ui-option';
    tab.innerText = name;
    uiOptions.appendChild(tab);
    let suboptions = document.createElement('div');
    suboptions.id = 'ui-content' + uiSuboptions.children.length;
    suboptions.className = 'ui-content';
    uiSuboptions.appendChild(suboptions);
    if (localStorage.noTransitions === 'true') {
        tab.style.transition = 'none';
        suboptions.style.transition = 'none';
    }
    return uiOptions.children.length - 1;
}
function createSuboption(optionId, title, desc = '', exec = null, icon, sound = "confirm") {
    if ((!optionId && optionId !== 0) || !title) throw new Error('Please specify a valid option ID and title.');
    let suboptions = document.getElementById(`ui-content${optionId}`);
    let suboption = document.createElement('div');
    suboption.id = 'ui-suboption' + suboptions.children.length;
    suboption.className = 'ui-suboption';
    if (isDefined(exec)) {
        const actionId = registerUISuboptionAction(exec, `${optionId}-${title}`);
        suboption.dataset.action = actionId;
    }
    if (isDefined(sound)) suboption.dataset.sound = sound;
    suboption.style.top = `${20 + (-31 * (selectedSuboptions[optionId] - 3))}px`;

    let suboptionTitle = document.createElement('a');
    suboptionTitle.className = 'ui-suboption-title';
    suboptionTitle.innerText = title;
    suboption.append(suboptionTitle);
    suboption.appendChild(document.createElement('br'));
    let suboptionDesc = document.createElement('a');
    suboptionDesc.className = 'ui-suboption-text';
    suboptionDesc.innerText = desc;
    suboptionDesc.style.display = 'none';
    suboption.append(suboptionDesc);
    if (isDefined(icon)) {
        let urltester = new RegExp("([a-zA-Z0-9]+:)?//([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+");
        let suboptionIcon = document.createElement('img');
        if (urltester.test(icon)) {
            suboptionIcon.src = icon;
        } else {
            suboptionIcon.src = `/assets/icons/${icon}.png`;
        }
        suboptionIcon.className = 'ui-suboption-icon';
        suboption.prepend(suboptionIcon);
    }
    if (localStorage.noTransitions === 'true') {
        suboption.style.transition = 'none';
    }
    
    suboptions.appendChild(suboption);
    return suboptions.children.length - 1;
}

function removeOption(optionId) {
    document.getElementById(`ui-option${optionId}`).remove();
    document.getElementById(`ui-content${optionId}`).remove();
    document.getElementById('ui-options').querySelectorAll('.ui-option').forEach((el, id)=>{
        el.id = `ui-option${id}`;
    });
    document.getElementById('ui-contents').querySelectorAll('.ui-content').forEach((el, id)=>{
        el.id = `ui-content${id}`;
    });
}
function removeSuboption(optionId, suboptionId) {
    document.getElementById(`ui-content${optionId}`).querySelector(`#ui-suboption${suboptionId}`).remove();
    
    document.getElementById(`ui-content${optionId}`).querySelectorAll('.ui-suboption').forEach((el, id)=>{
        el.id = `ui-suboption${id}`;
    });
}

function setOption(optionId, text) {
    document.getElementById(`ui-option${optionId}`).innerText = text;
}
function setSuboption(optionId, suboptionId, title, desc, icon, exec, sound) {
    let suboption = document.getElementById(`ui-content${optionId}`).querySelector(`#ui-suboption${suboptionId}`);
    if (isDefined(title)) suboption.querySelector('.ui-suboption-title').innerText = title;
    if (isDefined(desc)) suboption.querySelector('.ui-suboption-text').innerText = desc;
    if (isDefined(icon)) suboption.querySelector('.ui-suboption-icon').src = `/assets/icons/${icon}.png`;
    if (isDefined(exec)) {
        const actionId = registerUISuboptionAction(exec, `${optionId}-${title ?? suboption.querySelector('.ui-suboption-title')?.innerText ?? suboptionId}`);
        suboption.dataset.action = actionId;
    }
    if (isDefined(sound)) suboption.dataset.sound = sound;
}

function clearUI() {
    const uiOptions = document.getElementById('ui-options');
    const uiContents = document.getElementById('ui-contents');
    if (isDefined(uiOptions)) uiOptions.innerHTML = '';
    if (isDefined(uiContents)) uiContents.innerHTML = '';

    selectedOption = 0;
    selectedSuboption = 0;
    selectedSuboptions = {};

    Object.keys(uiSuboptionActions).forEach((key) => {
        delete uiSuboptionActions[key];
    });
}
function initUI() {
    clearUI();

    // init default options
    const powerTab = createOption('Power Options');
    const prefTab = createOption('Preferences');
    const audioTab = createOption('Audio');
    const graphTab = createOption('Graphics');
    const themeTab = createOption('Themes');
    const waveTab = createOption('Wave Amount');
    const helpTab = createOption('Help');
    const debugTab = createOption('Debug');
    const uiOptionCount = document.getElementById('ui-options').querySelectorAll('a').length;
    for (let i = 0; i < uiOptionCount; i++) {
        selectedSuboptions[i] = 0;
    }

    // init suboptions
    createSuboption(powerTab, 'Power Off', 'Shuts down the system and closes the tab (if possible).', () => {
        confirmDialog(shutdown);
    }, 'power', 'power');
    createSuboption(powerTab, 'Reboot', 'Restarts the system with the latest version of the system files.', () => {
        confirmDialog(reboot);
    }, 'power', 'power');
    createSuboption(powerTab, 'Fast Reboot', 'Restarts and skips startup animation once on the next boot.', () => {
        confirmDialog(fastReboot);
    }, 'power', 'power');
    selectedSuboptions[0] = 1;

    createSuboption(prefTab, 'Set Username', `Username currently set to "${username}".`, () => {
        promptDialog((name) => {
            if (!isDefined(name)) name = _defaultUsername;
            setUsername(name);
            updateLabel();
            setSuboption(selectedOption, selectedSuboption, null, `Username currently set to "${username}".`);
        }, 'Enter a username...', `default username is ${_defaultUsername}`);
    }, 'user');
    createSuboption(prefTab, 'Toggle monochrome favicon',
        localStorage.coloredFavicon === 'true'
            ? 'Favicon is currently colored.\nSelect to switch to a monochromatic favicon.'
            : 'Favicon is currently monochromatic.\nSelect to switch to a colored favicon.',
        () => {
            localStorage.coloredFavicon = localStorage.coloredFavicon === 'true' ? 'false' : 'true';
            icon();
            if (localStorage.coloredFavicon === 'true') {
                setSuboption(selectedOption, selectedSuboption, 'Toggle monochrome favicon', 'Favicon is currently colored.\\nSelect to switch to a monochromatic favicon.');
            } else {
                setSuboption(selectedOption, selectedSuboption, 'Toggle monochrome favicon', 'Favicon is currently monochromatic.\\nSelect to switch to a colored favicon.');
            }
        }, 'image');
    createSuboption(prefTab, 'Toggle open UI',
        localStorage.openUI === 'true' ? 'UI is currently open.\nSelect to close it.' : 'UI is currently closed.\nSelect to open it.',
        () => {
            localStorage.openUI = localStorage.openUI === 'true' ? 'false' : 'true';
            if (localStorage.openUI === 'true') {
                ui.classList.add('open');
                setSuboption(selectedOption, selectedSuboption, 'Toggle open UI', 'UI is currently open.\\nSelect to close it.');
            } else {
                ui.classList.remove('open');
                setSuboption(selectedOption, selectedSuboption, 'Toggle open UI', 'UI is currently closed.\\nSelect to open it.');
            }
        },
        'wrench'
    );
    createSuboption(prefTab, 'Toggle startup animation',
        localStorage.startup === 'true' ? 'Startup animation is currently enabled.\nSelect to disable it.' : 'Startup animation is currently disabled.\nSelect to enable it.',
        () => {
            localStorage.startup = localStorage.startup === 'true' ? 'false' : 'true';
            if (localStorage.startup === 'true') {
                setSuboption(selectedOption, selectedSuboption, 'Toggle startup animation', 'Startup animation is currently enabled.\\nSelect to disable it.');
            } else {
                setSuboption(selectedOption, selectedSuboption, 'Toggle startup animation', 'Startup animation is currently disabled.\\nSelect to enable it.');
            }
        },
        'wrench'
    );
    createSuboption(prefTab, 'Fast boot by default',
        localStorage.fastBootDefault === 'true'
            ? 'Fast boot is currently enabled by default.\nStartup animation only plays when Reboot is used.\nSelect to disable this.'
            : 'Fast boot is currently disabled by default.\nSelect to enable this and only show startup animation on Reboot.',
        () => {
            localStorage.fastBootDefault = localStorage.fastBootDefault === 'true' ? 'false' : 'true';
            if (localStorage.fastBootDefault === 'true') {
                setSuboption(selectedOption, selectedSuboption, 'Fast boot by default', 'Fast boot is currently enabled by default.\\nStartup animation only plays when Reboot is used.\\nSelect to disable this.');
            } else {
                setSuboption(selectedOption, selectedSuboption, 'Fast boot by default', 'Fast boot is currently disabled by default.\\nSelect to enable this and only show startup animation on Reboot.');
            }
        },
        'wrench'
    );

    createSuboption(prefTab, 'Save preferences', 'Select to download a file with your preferences to load them later.', () => {
        confirmDialog(() => {
            downloadFileWithContent(
                `Noema Preferences Backup -- ${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')} ${new Date().getHours()}-${new Date().getMinutes().toString().padStart(2, '0')}-${new Date().getSeconds().toString().padStart(2, '0')}.nsf`,
                (() => {
                    let settings = JSON.parse(JSON.stringify(localStorage));
                    settings.exportDate = Date.now();
                    settings.format = 'NSF2.1';
                    delete settings.lastChangelogHash;
                    delete settings.lastVersion;
                    delete settings.defaultScripts;
                    return JSON.stringify(settings);
                })()
            );
        }, 'Are you sure?', "Just making sure this wasn't pressed by accident.");
    }, 'wrench');
    createSuboption(prefTab, 'Load preferences', 'Select to load a file with your saved preferences.', () => {
        let importbtn = document.createElement('input');
        importbtn.type = 'file';
        importbtn.multiple = 'false';
        importbtn.style.display = 'none';
        importbtn.addEventListener('change', (event) => {
            const file = event.target.files[0];

            if (isDefined(file)) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    let content = e.target.result;
                    content = JSON.parse(content);
                    const formats = ['NSF1.0', 'NSF2.0', 'NSF2.1'];

                    if (formats.includes(content?.format)) {
                        if (content.format === 'NSF1.0') {
                            notify(
                                'That save file might be unsafe.',
                                "We didn't load it because the format of that save file has a known security issue.",
                                'warning'
                            );
                            setTimeout(() => {
                                notify(
                                    'Still want to recover your data?',
                                    'We have a site that can safely convert the file and remove potentially unsafe data.\\nFind it in the "Help" tab.'
                                );
                            }, 2.5e3);
                            return;
                        }
                        if (content.format === 'NSF2.0') {
                            localStorage.clear();

                            for (let i = 0; i < Object.keys(content).length; i++) {
                                const key = Object.keys(content)[i];
                                const value = Object.values(content)[i];
                                if (key === 'format' || key === 'exportDate' || key === 'lastVersion') continue;
                                localStorage.setItem(key, value);
                            }
                        }
                        if (content.format === 'NSF2.1') {
                            localStorage.clear();

                            for (let i = 0; i < Object.keys(content).length; i++) {
                                const key = Object.keys(content)[i];
                                const value = Object.values(content)[i];
                                if (key === 'format' || key === 'exportDate' || key === 'lastChangelogHash') continue;
                                localStorage.setItem(key, value);
                            }

                            localStorage.lastChangelogHash = '0';
                        }
                        notify('Preferences file loaded successfully!');
                        setTimeout(() => {
                            notify('The system will reboot in 3 seconds to properly apply every setting.', '(to set absent settings to their defaults and to apply settings that need a reboot to fully apply)');
                            setTimeout(() => {
                                reboot();
                            }, 3e3);
                        }, 2e3);
                    } else {
                        throw new TypeError('Unsupported, invalid or absent format! Please use a valid preferences file.');
                    }
                    importbtn.remove();
                };
                reader.readAsText(file);
            }
        });
        document.body.appendChild(importbtn);
        importbtn.click();
    }, 'wrench');
    createSuboption(prefTab, 'Reset preferences', 'This wipes EVERY preference (Background color, username, spaghetti density, etc).\nDo not use this unless you know what you\'re doing and haven\'t saved your preferences.\nOnce you reset your preferences, this process is IRREVERSIBLE.',
        () => {
            confirmDialog(() => {
                setTimeout(() => {
                    confirmDialog(() => {
                        localStorage.clear();
                        reboot();
                    }, 'Are you absolutely sure?', '');
                }, .5e3);
            },
            'Are you sure?',
            'Do not accept unless you know what you\'re doing.\\nOnce you reset your preferences, this process is IRREVERSIBLE, so make sure to save your preferences before resetting.\\n\\nThe system will restart after resetting to apply the default settings.');
        },
        'bin'
    );

    createSuboption(audioTab, 'Toggle pausing background music on unfocus',
        localStorage.pauseMusic === 'true' ? 'Background music currently gets paused on unfocus.\nSelect to not mute it on unfocus.' : 'Background music currently doesn\'t get muted on unfocus.\nSelect to mute it on unfocus.',
        () => {
            localStorage.pauseMusic = localStorage.pauseMusic === 'true' ? 'false' : 'true';
            if (localStorage.pauseMusic === 'true') {
                setSuboption(selectedOption, selectedSuboption, 'Toggle pausing background music on unfocus', 'Background music currently gets paused on unfocus.\\nSelect to not mute it on unfocus.');
            } else {
                bgMusic.play();
                setSuboption(selectedOption, selectedSuboption, 'Toggle pausing background music on unfocus', 'Background music currently doesn\\\'t get muted on unfocus.\\nSelect to enable that.');
            }
        },
        'wrench'
    );
    createSuboption(audioTab, 'Set master volume', `Master volume is currently at ${decimalStrToPercentage(localStorage.masterVolume)}% volume.`, () => {
        inputDialog('Set master volume', null, decimalStrToPercentage(localStorage.masterVolume), 0, 100, 1, '{value}%', (volume) => {
            setMasterVolume(percentageToDecimal(volume));
            setSuboption(selectedOption, selectedSuboption, 'Set master volume', `Master volume is currently at ${decimalStrToPercentage(localStorage.masterVolume)}% volume.`);
        });
    }, 'wrench');
    createSuboption(audioTab, 'Set background music volume', `Background music is currently at ${decimalStrToPercentage(localStorage.musicVolume)}% volume.`, () => {
        inputDialog('Set background music volume', null, decimalStrToPercentage(localStorage.musicVolume), 0, 100, 1, '{value}%', (volume) => {
            localStorage.musicVolume = percentageToDecimal(volume);
            bgMusic.volume = parseFloat(localStorage.musicVolume).clamp(0, 1) * masterVolume;
            setSuboption(selectedOption, selectedSuboption, 'Set background music volume', `Background music is currently at ${decimalStrToPercentage(localStorage.musicVolume)}% volume.`);
        });
    }, 'wrench');
    createSuboption(audioTab, 'Set UI sound volume', `UI sounds are currently at ${decimalStrToPercentage(localStorage.uiSoundVolume)}% volume.`, () => {
        inputDialog('Set UI sound volume', null, decimalStrToPercentage(localStorage.uiSoundVolume), 0, 100, 1, '{value}%', (volume) => {
            localStorage.uiSoundVolume = percentageToDecimal(volume);
            setSuboption(selectedOption, selectedSuboption, 'Set UI sound volume', `UI sounds are currently at ${decimalStrToPercentage(localStorage.uiSoundVolume)}% volume.`);
        });
    }, 'wrench');

    createSuboption(graphTab, 'Toggle effects',
        localStorage.noShaders === 'true' ? 'Effects are currently disabled.\nSelect to turn them on.' : 'Effects are currently enabled.\nSelect to turn them off.',
        () => {
            localStorage.noShaders = localStorage.noShaders === 'true' ? 'false' : 'true';
            if (localStorage.noShaders === 'true') {
                setSuboption(selectedOption, selectedSuboption, 'Toggle effects', 'Effects are currently disabled.\\nSelect to turn them on.');
                traverseDOM(document.body, (element) => {
                    element.style.backdropFilter = 'none';
                });
            } else {
                setSuboption(selectedOption, selectedSuboption, 'Toggle effects', 'Effects are currently enabled.\\nSelect to turn them off.');
                traverseDOM(document.body, (element) => {
                    element.style.backdropFilter = '';
                });
            }
        },
        'wrench'
    );
    createSuboption(graphTab, 'Toggle animations',
        localStorage.noTransitions === 'true' ? 'Animations are currently disabled.\nSelect to turn them on.' : 'Animations are currently enabled.\nSelect to turn them off.',
        () => {
            localStorage.noTransitions = localStorage.noTransitions === 'true' ? 'false' : 'true';
            if (localStorage.noTransitions === 'true') {
                setSuboption(selectedOption, selectedSuboption, 'Toggle animations', 'Animations are currently disabled.\\nSelect to turn them on.');
                traverseDOM(document.body, (element) => {
                    element.style.transition = 'none';
                    element.style.animation = 'none';
                });
            } else {
                setSuboption(selectedOption, selectedSuboption, 'Toggle animations', 'Animations are currently enabled.\\nSelect to turn them off.');
                traverseDOM(document.body, (element) => {
                    element.style.transition = '';
                    element.style.animation = '';
                });
            }
        },
        'wrench'
    );

    Object.keys(bgColors).forEach((color, i) => {
        createSuboption(themeTab, color.toTitleCase(), `Select to set the theme to "${color.toTitleCase()}".`, () => {
            changeBGColor({ colorName: color });
        }, 'image');
        if (color === localStorage.bgColor) selectedSuboptions[themeTab] = i;
    });

    for (const [label, data] of Object.entries(densities)) {
        createSuboption(
            waveTab,
            label.toTitleCase(),
            data.desc,
            () => {
                localStorage.spaghettiDensity = density = data.value;
            },
            'wrench'
        );
    }

    createSuboption(helpTab, 'Convert Save File', null, () => {
        const width = window.innerWidth / 2;
        const height = window.innerHeight / 2;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const newWindow = window.open(
            './subpages/convertsave/index.html',
            'convert',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        if (isDefined(newWindow.focus)) newWindow.focus();
    }, 'wrench');
    createSuboption(helpTab, "Open Project Noema's GitHub repo", null, () => {
        window.open('https://github.com/sophb-ccjt/noema', '_blank');
    }, 'open-external');
    createSuboption(helpTab, 'Report an issue on GitHub', null, () => {
        window.open('https://github.com/sophb-ccjt/noema/issues/new', '_blank');
    }, 'open-external');

    createSuboption(debugTab, 'Toggle debugging UI', localStorage.debugUI === 'true' ? 'Debug UI is currently on.\nSelect to turn it off.' : 'Debug UI is currently off.\nSelect to turn it on.', () => {
        localStorage.debugUI = localStorage.debugUI === 'true' ? 'false' : 'true';
        if (localStorage.debugUI === 'true') {
            document.getElementById('debug-ui').style.display = 'block';
            setSuboption(selectedOption, selectedSuboption, 'Toggle debugging UI', 'Debug UI is currently on.\\nSelect to turn it off.');
        } else {
            document.getElementById('debug-ui').style.display = 'none';
            setSuboption(selectedOption, selectedSuboption, 'Toggle debugging UI', 'Debug UI is currently off.\\nSelect to turn it on.');
        }
    }, 'star');
    createSuboption(debugTab, 'Clear Errors', null, () => {
        errors = 0;
        errorList = [];
        document.getElementById('errors').innerText = `Errors: ${errors}`;
    }, 'star');
    createSuboption(debugTab, 'Load Script', null, () => {
        promptDialog((url) => {
            if (!url) return;
            if (!isURL(url)) throw new TypeError("Script URL provided isn't even a URL.");
            if (document.getElementById('script-' + url)) throw new Error('Script already loaded!');
            let script = document.createElement('script');
            script.src = url;
            script.id = 'script-' + url;
            document.body.appendChild(script);
        }, 'Enter a script URL...');
    }, 'star');

    selectUIOption(1);
}
function getOption(optionId) {
    return {
        label: document.getElementById(`ui-option${optionId}`).textContent,
        element: document.getElementById(`ui-option${optionId}`)
    };
}
function getSuboption(optionId, suboptionId) {
    let suboption = document.getElementById(`ui-content${optionId}`).querySelector(`#ui-suboption${suboptionId}`);
    return {
        title: suboption.querySelector('.ui-suboption-title').textContent,
        description: suboption.querySelector('.ui-suboption-text')?.textContent,
        icon: suboption.querySelector('.ui-suboption-icon').src.trimEnd('.png'),
        element: suboption
    };
}

function bandDialog(title, subtitle = '', setupFunc, confirmFunc, usesEnterKey = true) {
    document.getElementById('custom-title').textContent = title;
    document.getElementById('custom-items').innerHTML = '';
    document.getElementById('custom-items').style.cssText = '';

    if (!isDefined(setupFunc)) {
        document.getElementById('custom-items').style.display = 'none';
    } else {
        document.getElementById('custom-items').style.display = 'revert';
        setupFunc(document.getElementById('custom-items'));
    }
    if (!isDefined(confirmFunc)) confirmFunc = ()=>{};
    document.getElementById('custom-subtitle').style.display = 'none';

    if (isDefined(subtitle)) {
        if (subtitle.replace(/\s/g, '').length > 0) {
            document.getElementById('custom-subtitle').style.display = 'revert';
            document.getElementById('custom-subtitle-text').textContent = subtitle;
        }
    }
    let hasInput = false;
    traverseDOM(document.getElementById('custom-dialog'), (el) => {
        if (el.tagName === 'INPUT') {
            if (
                el.type === 'text' ||
                el.type === 'email' ||
                el.type === 'password' ||
                el.type === 'search' ||
                el.type === 'tel' ||
                el.type === 'url'
            ) {
                hasInput = true;
            } else if (el.type === 'checkbox') {
                usesEnterKey = false;
            }
        } else if (el.tagName === 'TEXTAREA') {
            hasInput = true;
        }
    });
    if (lastInput === 'gamepad') {
        if (usesEnterKey) {
            document.getElementById('custom-controls').textContent = "Press ✕/Ⓐ to confirm, and ⭘/Ⓑ to cancel.";
        } else {
            document.getElementById('custom-controls').textContent = "Press ⭘/Ⓑ to exit.";
        }
    } else {
        if (usesEnterKey) {
            if (hasInput) {
                document.getElementById('custom-controls').textContent = "Press Enter to confirm, and Escape to cancel.";
            } else {
                document.getElementById('custom-controls').textContent = "Press Enter or Space to confirm, and Escape to cancel.";
            }
        } else {
            document.getElementById('custom-controls').textContent = "Press Escape to exit.";
        }
    }

    let handler = (event) => {
        const key = event.key.toLowerCase();
        function blur() {
            traverseDOM(document.getElementById('custom-dialog'), (el)=>{
                if (document.activeElement === el) {
                    el.onblur = null;
                    requestAnimationFrame(()=>{
                        el.blur();
                    });
                }
            });
        }
        if ((key === 'enter' || (key === ' ' && !hasInput))&& usesEnterKey) {
            if (usesEnterKey) {
                confirmFunc();
                playSound('confirm');
            }
            blur();
            document.getElementById('custom-dialog').style.opacity = '0';
            document.removeEventListener('keyup', handler);
        } else if (key === 'escape') {
            playSound('back');
            blur();
            document.getElementById('custom-dialog').style.opacity = '0';
            document.removeEventListener('keyup', handler);
        }
    };
    document.getElementById('custom-dialog').style.opacity = '100%';
    document.addEventListener('keyup', handler);
}
function inputDialog(title = 'Select a value...', subtitle, startingValue, min, max, step = 1, formatStr, updFunc = ()=>{}) {
    if (!formatStr && typeof formatStr !== 'string') console.warn('formatStr (7th argument): Every instance of the substring "{value}" will be replaced with the slider\'s current value.\nSet this parameter to an empty string to avoid this warning.');
    bandDialog(title, subtitle, (dialog) => {
        let slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min.toString();
        slider.max = max.toString();
        slider.step = step.toString();
        slider.value = startingValue.toString();
        dialog.appendChild(slider);
        let slidertext = document.createElement('a');
        slidertext.textContent = ` ${formatStr.replaceAll("{value}", slider.value.toString())}`;
        slidertext.style.color = '#fff';
        slidertext.style.fontFamily = "'Manrope', monospace";
        dialog.appendChild(slidertext);
        let handler = () => {
            updFunc(slider.value);
            slidertext.textContent = ` ${formatStr.replaceAll("{value}", slider.value.toString())}`;
        };
        slider.addEventListener('input', handler);
        slider.onblur = () => slider.removeEventListener('input', handler);

        dialog.appendChild(document.createElement('br'));
        slider.focus();
        slider.onblur = slider.focus;
        slider.style.outline = '0';
    }, null, false);
}
function confirmDialog(func = () => {}, title = 'Are you sure?', subtitle = '') {
    bandDialog(title, subtitle, null, func, true);
}
function promptDialog(func = (() => { }), title = 'Enter some text...', placeholder = '') {
    bandDialog(title, '', (dialog)=>{
        let input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholder;
        input.id = 'custom-input';
        input.onblur = ()=>input.focus();

        dialog.appendChild(input);
        input.focus();
        input.style.outline = `solid 1px ${accentColor}`;
        input.style.boxShadow = `0px 0px 7px ${accentColor}`;
        input.style.borderRadius = `10px`;
    }, ()=>{
        func(document.getElementById('custom-input').value);
    }, true);
}
function checkboxDialog(title, subtitle, label, toggleFunc = ()=>{}) {
    bandDialog(title, subtitle, (dialog) => {
        let text = document.createElement('a');
        text.textContent = `${label} `;
        text.style.cssText = "color: #fff; font-family: 'Manrope', monospace";

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.onblur = () => checkbox.focus();
        checkbox.addEventListener('input', () => {
            toggleFunc(checkbox.checked);
        });

        dialog.appendChild(text);
        dialog.appendChild(checkbox);
        dialog.appendChild(document.createElement('br'));
        dialog.appendChild(document.createElement('br'));

        checkbox.focus();
    }, null, true);
}
let notifElements = {};
let queuedNotifs = [];
let notifCount = 0;
function notify(title, text, icon) {
    let notifDiv = document.createElement('span');
    notifDiv.className = 'notif';
    notifDiv.id = `notif-${Math.random()}`;
    function notifHandler() {
        if (localStorage.noShaders === 'true') notifDiv.style.backdropFilter = 'none';
        if (localStorage.noTransitions === 'true') notifDiv.style.transition = 'none';
        document.getElementById('notif-div').appendChild(notifDiv);
        
        let notifContent = document.createElement('span');
        notifContent.style.padding = '5px';
        notifDiv.appendChild(notifContent);

        let notifTitle = document.createElement('a');
        notifTitle.textContent = title;
        notifTitle.className = 'notif-title';
        notifContent.appendChild(notifTitle);

        if (isDefined(text)) {
            notifContent.appendChild(document.createElement('br'));
            let notifText = document.createElement('a');
            notifText.textContent = text;
            notifText.className = "notif-text";
            notifContent.appendChild(notifText);
        }

        if (isDefined(icon)) {
            let notifIcon = document.createElement('img');
            notifIcon.src = `/assets/icons/${icon}.png`;
            notifIcon.className = "notif-icon";
            notifDiv.appendChild(notifIcon);
        }

        let snd = playSound('notif', null, {
            preservesPitch: false,
            playbackRate: 1 + notifCount / 25
        });

        notifElements[notifDiv.id] = notifDiv;
        notifCount++;
        requestAnimationFrame(()=>{
            notifDiv.style.transform = 'translateX(1px)';
            notifDiv.style.opacity = '100%';
        });
        setTimeout(()=>{
            notifDiv.style.transform = 'translateX(100%)';
            notifDiv.style.opacity = '0';
            if (notifElements[notifDiv.id]) {
                delete notifElements[notifDiv.id];
                notifCount--;
            }
            setTimeout(()=>{notifDiv.remove();}, .25e3);
        },10e3);
    }
    if (notifCount >= 6 || !started || !document.hasFocus()) {
        if (queuedNotifs.length < 24) {
            queuedNotifs.push({id: notifDiv.id, when: Date.now()});
            const checkInterval = setInterval(() => {
                if (notifCount < 6 && started && document.hasFocus()) {
                    if (queuedNotifs[0]?.id === notifDiv.id) {
                        if (Date.now() - queuedNotifs[0]?.when <= 60e3) notifHandler();
                        queuedNotifs.shift();
                        clearInterval(checkInterval);
                    }
                }
            }, 100);
        } else {
            console.error("Too many notifications are queued up!");
            return;
        }
    } else {
        notifHandler();
    }
    
}

let keyPressed = null;
let pressedTime = null;
let lastActivity = Date.now();
function handleInput(event) {
    const keyup = event.type === 'keyup';

    if (!started) return;
    if (event.repeat) {
        if (Date.now() - lastActivity < 75) {
            return;
        }
    } else {
        if (Date.now() - lastActivity < 50) {
            return;
        }
    }
    lastActivity = Date.now();
    const uiOptions = document.getElementById('ui-options');
    const optionCount = uiOptions.querySelectorAll('.ui-option').length;
    const selectedContent = document.getElementById(`ui-content${selectedOption}`);
    const suboptionCount = selectedContent?.querySelectorAll('.ui-suboption').length ?? 0;

    function left() {
        if (optionCount < 2) return;
        if (keyup) return;
        if (selectedOption <= 0) {
            if (event.repeat) return;
            selectedOption = optionCount - 1;
        }
        else
            selectedOption--;
        selectUIOption(selectedOption);
        playSound('select');
    }
    function right() {
        if (optionCount < 2) return;
        if (keyup) return;
        if (selectedOption >= optionCount - 1) {
            if (event.repeat) return;
            selectedOption = 0;
        }
        else
            selectedOption++;
        selectUIOption(selectedOption);
        playSound('select');
    }
    function up() {
        if (suboptionCount < 2) return;
        if (keyup) return;
        if (selectedSuboption <= 0) {
            if (event.repeat) return;
            else
                selectUISuboption(suboptionCount - 1);
    
            playSound('select');
            return;
        }

        selectedSuboption--;
        selectUISuboption(selectedSuboption);
        playSound('select');
    }
    function down() {
        if (suboptionCount < 2) return;
        if (keyup) return;
        if (selectedSuboption >= suboptionCount - 1) {
            if (event.repeat) return;
            else
                selectUISuboption(0);

            playSound('select');
            return;
        }

        selectedSuboption++;
        selectUISuboption(selectedSuboption);
        playSound('select');
    }
    function back() {
        if (!keyup) return;
        let playBackSound = false;
        document.activeElement.blur();
        document.body.querySelectorAll('.band-dialog').forEach(dialog => {
            if (window.getComputedStyle(dialog).opacity !== '0') {
                dialog.style.opacity = "0%";
                playBackSound = true;
            }
        });
        if (playBackSound) playSound('back');
        return;
    }


    if (event.isTrusted) {
        lastInput = 'keyboard';
    }
    let key = event.key.toLowerCase();
    // console.log('key press:', key)

    // input handler, make it JSON later?
    // ⤷ idk sis you might need to spend a lot of time
    /*if (key === 'escape') {
        if (!event.repeat)
            back();
    }*/
    let outOfMenu = false;
    document.body.querySelectorAll('.band-dialog').forEach(dialog => {
        if (window.getComputedStyle(dialog).opacity !== '0')
            outOfMenu = true;
    });
    if (outOfMenu) {
        if ((key === 'a' || key === 'arrowleft') && !keyup) {
            if (document.activeElement.tagName === 'INPUT' && document.activeElement?.type === 'range') {
                event.preventDefault();
                if (parseFloat(document.activeElement.value) > parseFloat(document.activeElement.min)) {
                    document.activeElement.value = parseFloat(document.activeElement.value) - parseFloat(document.activeElement.step || '1') * (event.shiftKey ? 10 : 1);

                    const evtn = new Event('input', { bubbles: true });
                    document.activeElement.dispatchEvent(evtn);
                    const evtn2 = new Event('change', { bubbles: true });
                    document.activeElement.dispatchEvent(evtn2);
                }
            }
        }
        if ((key === 'd' || key === 'arrowright') && !keyup) {
            if (document.activeElement.tagName === 'INPUT' && document.activeElement?.type === 'range') {
                event.preventDefault();
                if (parseFloat(document.activeElement.value) < parseFloat(document.activeElement.max)) {
                    document.activeElement.value = parseFloat(document.activeElement.value) + parseFloat(document.activeElement.step || '1') * (event.shiftKey ? 10 : 1);

                    const evtn = new Event('input', { bubbles: true });
                    document.activeElement.dispatchEvent(evtn);
                    const evtn2 = new Event('change', { bubbles: true });
                    document.activeElement.dispatchEvent(evtn2);
                }
            }
        }
        if ((key === 'w' || key === 'arrowup') && !keyup) {
            if (document.activeElement.tagName === 'INPUT' && document.activeElement?.type === 'number') {
                event.preventDefault();
                if (parseFloat(document.activeElement.value) < parseFloat(document.activeElement.max)) {
                    document.activeElement.value = parseFloat(document.activeElement.value) + parseFloat(document.activeElement.step || '1') * (event.shiftKey ? 10 : 1);

                    const evtn = new Event('input', { bubbles: true });
                    document.activeElement.dispatchEvent(evtn);
                    const evtn2 = new Event('change', { bubbles: true });
                    document.activeElement.dispatchEvent(evtn2);
                }
            }
        }
        if ((key === 'a' || key === 'arrowleft') && !keyup) {
            if (document.activeElement.tagName === 'INPUT' && document.activeElement?.type === 'number') {
                event.preventDefault();
                if (parseFloat(document.activeElement.value) > parseFloat(document.activeElement.min)) {
                    document.activeElement.value = parseFloat(document.activeElement.value) - parseFloat(document.activeElement.step || '1') * (event.shiftKey ? 10 : 1);

                    const evtn = new Event('input', { bubbles: true });
                    document.activeElement.dispatchEvent(evtn);
                    const evtn2 = new Event('change', { bubbles: true });
                    document.activeElement.dispatchEvent(evtn2);
                }
            }
        }
        if ((key === 'enter' || key === ' ') && !keyup) {
            if (document.activeElement.tagName === 'INPUT' && document.activeElement?.type === 'checkbox') {
                event.preventDefault();
                document.activeElement.checked = !document.activeElement.checked;

                const evtn = new Event('input', { bubbles: true });
                document.activeElement.dispatchEvent(evtn);
                const evtn2 = new Event('change', { bubbles: true });
                document.activeElement.dispatchEvent(evtn2);
            }
        }
    } else {
        if (key === 'a' || key === 'arrowleft') {
            left();
        }
        if (key === 'd' || key === 'arrowright') {
            right();
        }
        if (key === 'w' || key === 'arrowup') {
            up();
        }
        if (key === 's' || key === 'arrowdown') {
            down();
        }
        if (key === 'enter' || key === ' ') {
            if (!event.repeat && keyup)
                executeUISuboption();
        }
        if (key === 'q') {
            if (!keyup && selectedOption !== 0) {
                selectUIOption(0);
                playSound('select');
            }
        }
        if (key === 'e') {
            if (!keyup && selectedOption !== optionCount - 1) {
                selectUIOption(optionCount - 1);
                playSound('select');
            }
        }
    }
}
