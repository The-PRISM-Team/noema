const version = {
    major: 0,
    minor: 16,
    patch: 0,
    more: 'open dev beta'.split(' ')
};
function formatVersion(versionObj = version, separator = '.', startChar = 'v', moreJoiner = '-') {
    return `${startChar}${[versionObj.major, versionObj.minor, versionObj.patch].join(separator)}${versionObj.more ? `${moreJoiner}${versionObj.more.join(separator)}` : ""}`;
}
document.getElementById('version-number').textContent = formatVersion();

let fpsCounter = document.getElementById('fps');

let fps = 60, // assume 60 fps before check since that's a safe FPS
    avgfps = fps,
    deltaTime = 1 / fps;
let _lastTime = performance.now();

function traverseDOM(element, callback = console.log) {
    callback(element);

    for (let i = 0; i < element.children.length; i++) {
        traverseDOM(element.children[i], callback);
    }
}

let focused = true;
window.addEventListener('focus', () =>{
    focused = true;
    if (started && localStorage.pauseMusic === 'true') bgMusic.resume();
});
window.addEventListener('blur', () =>{
    focused = false;
    if (started && localStorage.pauseMusic === 'true') bgMusic.pause();
});

let _fpses = [];
function updateFps() {
    deltaTime = performance.now() - _lastTime;
    deltaTime /= 1e3;
    _lastTime = performance.now();
    fps = 1 / deltaTime;
    fps = Math.floor(fps);

    if (focused) { // fps can be VERY inaccurate when the tab is unfocused
        if (_fpses.length > 0) {
            avgfps = 0;
            _fpses.forEach(fps => {
                avgfps += fps;
            });
            avgfps /= _fpses.length;
            avgfps = Math.round(avgfps);
        } else {
            avgfps = fps;
        }

        if (avgfps === 0 && focused) avgfps = fps;
    }
    _fpses.push(fps);
    if (_fpses.length > 120) {
        _fpses.shift();
    }

    requestAnimationFrame(updateFps);
}
updateFps();
setInterval(() => {
    fpsCounter.innerHTML = `FPS: ${fps} | Avg. FPS: ${avgfps}`;
    if (fps >= 45) {
        fpsCounter.style.color = "#fff";
    } else if (fps >= 30) {
        fpsCounter.style.color = "#ffa";
    } else if (fps >= 20) {
        fpsCounter.style.color = "#ff4";
    } else {
        fpsCounter.style.color = "#f44";
    }
}, .25e3);


function icon(
    darkmode = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null
) {
    if (started) {
        if (localStorage.coloredFavicon === 'true') {
            favicon.href = '/assets/logos/noema/color.png';
        } else {
            if (darkmode) {
                favicon.href = '/assets/logos/noema/white.png';
            } else {
                favicon.href = '/assets/logos/noema/black.png';
            }
        }
    } else {
        if (localStorage.coloredFavicon === 'true') {
            favicon.href = '/assets/logos/prism/color.png';
        } else {
            if (darkmode) {
                favicon.href = '/assets/logos/prism/white.png';
            } else {
                favicon.href = '/assets/logos/prism/black.png';
            }
        }
    }
}
if (isDefined(window.matchMedia)) {
    const match = window.matchMedia('(prefers-color-scheme: dark)');

    match.addEventListener('change', () => {
        icon(match.matches);
    });
}

async function init() {
    if (started) return;
    if (warmupSounds.length === 0) soundWarmup();
    delete localStorage.fromreboot;
    delete localStorage.fromRefresh;
    delete localStorage.fastBoot;
    const clickToStart = document.getElementById('clicktostart');
    bgMusic.loop = true;
    bgMusic.volume = 0;
    try {
        await bgMusic.play();
    } catch (error) {
        console.warn('Background music failed to play.', error);
        await new Promise((resolve) => {
            setCursor('pointer');
            clickToStart.style.display = 'revert';
            clickToStart.style.opacity = '100%';
            clickToStart.innerHTML = localStorage.startup === 'true' ? 'click or press enter to start' : 'click or press enter to go to menu';

            const continueBoot = async () => {
                document.onclick = document.onkeydown = null;
                try {
                    await bgMusic.play();
                } catch (playError) {
                    console.warn('Background music still failed after user interaction.', playError);
                }
                resolve();
            };

            document.onclick = continueBoot;
            document.onkeydown = (event) => {
                if (event.key.toLowerCase() === 'enter') continueBoot();
            };
        });
    }
    started = true;
    lastActivity = Date.now();

    clickToStart.style.display = 'none';
    spaghettiColor = `#fff8`;
    ui.style.top = "50%";
    if (localStorage.openUI === 'true')
        ui.classList.add('open');

    document.getElementById('outer-ui').style.display = 'block';
    requestAnimationFrame(()=>document.body.querySelector('.time-bar').style.transform = 'translate(-50%, 0%)');

    if (localStorage.debugUI === 'true')
        document.getElementById('debug-ui').style.display = 'inline';

    changeBGColor({
        colorName: localStorage.bgColor,
        easing: .025
    });

    icon();

    setCursor('auto');

    // init default options
    const powerTab = createOption('Power Options');
    const prefTab = createOption('Preferences');
    const audioTab = createOption('Audio');
    const graphTab = createOption('Graphics');
    const themeTab = createOption('Themes');
    const waveTab = createOption('Wave Amount');
    const helpTab = createOption('Help');
    const debugTab = createOption('Debug');
    for (let i = 0; i < document.getElementById('ui-options').querySelectorAll('a').length; i++) {
        selectedSuboptions[i] = 0;
    }

    // init suboptions
    createSuboption(powerTab, 'Power Off', 'Shuts down the system and closes the tab (if possible).', `confirmDialog(shutdown)`, 'power', 'power');
    createSuboption(powerTab, 'Reboot', 'Restarts the system with the latest version of the system files.', `confirmDialog(reboot)`, 'power', 'power');
    createSuboption(powerTab, 'Fast Reboot', 'Restarts and skips startup animation once on the next boot.', `confirmDialog(fastReboot)`, 'power', 'power');
    selectedSuboptions[0] = 1;

    createSuboption(prefTab, 'Set Username', `Username currently set to "${username}".`, `
        promptDialog((name)=>{
            if (!isDefined(name)) name = '${_defaultUsername}';
            setUsername(name)
            updateLabel()
            setSuboption(selectedOption, selectedSuboption, null, \`Username currently set to "\${username}".\`)
        }, 'Enter a username...', 'default username is ${_defaultUsername}')
    `, 'user');
    createSuboption(prefTab, 'Toggle monochrome favicon',
        localStorage.coloredFavicon === 'true' ?
            'Favicon is currently colored.\nSelect to switch to a monochromatic favicon.'
            :
            'Favicon is currently monochromatic.\nSelect to switch to a colored favicon.',
        `
        localStorage.coloredFavicon = localStorage.coloredFavicon === 'true' ? 'false' : 'true';
        icon();
        if (localStorage.coloredFavicon === 'true') {
            setSuboption(selectedOption, selectedSuboption, 'Toggle monochrome favicon', 'Favicon is currently colored.\\nSelect to switch to a monochromatic favicon.');
        } else {
            setSuboption(selectedOption, selectedSuboption, 'Toggle monochrome favicon', 'Favicon is currently monochromatic.\\nSelect to switch to a colored favicon.');
        }`, 'image');
    createSuboption(prefTab, 'Toggle open UI',
        localStorage.openUI === 'true' ? 'UI is currently open.\nSelect to close it.' : 'UI is currently closed.\nSelect to open it.', `
        localStorage.openUI = localStorage.openUI === 'true' ? 'false' : 'true';
        if (localStorage.openUI === 'true') {
            ui.classList.add('open');
            setSuboption(selectedOption, selectedSuboption, 'Toggle open UI', 'UI is currently open.\\nSelect to close it.');
        } else {
            ui.classList.remove('open');
            setSuboption(selectedOption, selectedSuboption, 'Toggle open UI', 'UI is currently closed.\\nSelect to open it.');
        }`, 'wrench');
    createSuboption(prefTab, 'Toggle startup animation',
        localStorage.startup === 'true' ? 'Startup animation is currently enabled.\nSelect to disable it.' : 'Startup animation is currently disabled.\nSelect to enable it.', `
        localStorage.startup = localStorage.startup === 'true' ? 'false' : 'true';
        if (localStorage.startup === 'true') {
            setSuboption(selectedOption, selectedSuboption, 'Toggle startup animation', 'Startup animation is currently enabled.\\nSelect to disable it.');
        } else {
            setSuboption(selectedOption, selectedSuboption, 'Toggle startup animation', 'Startup animation is currently disabled.\\nSelect to enable it.');
        }`,
        'wrench');
    createSuboption(prefTab, 'Fast boot by default',
        localStorage.fastBootDefault === 'true'
            ? 'Fast boot is currently enabled by default.\nStartup animation only plays when Reboot is used.\nSelect to disable this.'
            : 'Fast boot is currently disabled by default.\nSelect to enable this and only show startup animation on Reboot.',
        `
        localStorage.fastBootDefault = localStorage.fastBootDefault === 'true' ? 'false' : 'true';
        if (localStorage.fastBootDefault === 'true') {
            setSuboption(selectedOption, selectedSuboption, 'Fast boot by default', 'Fast boot is currently enabled by default.\\nStartup animation only plays when Reboot is used.\\nSelect to disable this.');
        } else {
            setSuboption(selectedOption, selectedSuboption, 'Fast boot by default', 'Fast boot is currently disabled by default.\\nSelect to enable this and only show startup animation on Reboot.');
        }`,
        'wrench');

    createSuboption(prefTab, 'Save preferences', 'Select to download a file with your preferences to load them later.', `
        confirmDialog(()=>{
            downloadFileWithContent(
            \`Noema Preferences Backup -- \${new Date().getFullYear()}-\${(new Date().getMonth() + 1).toString().padStart(2, '0')}-\${new Date().getDate().toString().padStart(2, '0')} \${new Date().getHours()}-\${new Date().getMinutes().toString().padStart(2, '0')}-\${new Date().getSeconds().toString().padStart(2, '0')}.nsf\`
            , (()=>{
                let settings = JSON.parse(JSON.stringify(localStorage))
                settings.exportDate = Date.now()
                settings.format = 'NSF2.1'
                delete settings.lastChangelogHash
                delete settings.lastVersion
                delete settings.defaultScripts
                return JSON.stringify(settings)
            })())
        }, 'Are you sure?', "Just making sure this wasn't pressed by accident.")
        `, 'wrench');
    createSuboption(prefTab, 'Load preferences', 'Select to load a file with your saved preferences.', `
        let importbtn = document.createElement('input');
        importbtn.type = 'file';
        importbtn.multiple = 'false';
        importbtn.style.display = 'none';
        importbtn.addEventListener('change', (event) => {
            const file = event.target.files[0];

            if (isDefined(file)) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    let content = e.target.result;
                    content = JSON.parse(content);
                    const formats = ['NSF1.0', 'NSF2.0', 'NSF2.1'];

                    if (formats.includes(content?.format)) {
                        if (content.format === 'NSF1.0') {
                            notify(
                                'That save file might be unsafe.',
                                "We didn't load it because the format of that save file has a known security issue.",
                            'warning');
                            setTimeout(()=>{
                                notify(
                                    'Still want to recover your data?',
                                    'We have a site that can safely convert the file and remove potentially unsafe data.\\nFind it in the "Help" tab.'
                                );
                            }, 2.5e3);
                            return;
                        }
                        if (content.format === 'NSF2.0') {
                            localStorage.clear(); // clear storage to avoid any conflicts

                            for (let i = 0; i < Object.keys(content).length; i++) {
                                const key = Object.keys(content)[i];
                                const value = Object.values(content)[i];
                                if (key === 'format' || key === 'exportDate' || key === 'lastVersion') continue;
                                localStorage.setItem(key, value);
                            }
                        }
                        if (content.format === 'NSF2.1') {
                            localStorage.clear(); // clear storage to avoid any conflicts

                            for (let i = 0; i < Object.keys(content).length; i++) {
                                const key = Object.keys(content)[i];
                                const value = Object.values(content)[i];
                                if (key === 'format' || key === 'exportDate' || key === 'lastChangelogHash') continue;
                                localStorage.setItem(key, value);
                            }

                            localStorage.lastChangelogHash = '0';
                        }
                        notify('Preferences file loaded successfully!');
                        setTimeout(()=>{
                            notify('The system will reboot in 3 seconds to properly apply every setting.', '(to set absent settings to their defaults and to apply settings that need a reboot to fully apply)');
                            setTimeout(()=>{
                                reboot();
                            }, 3e3)
                        }, 2e3)
                    } else {
                        throw new TypeError("Unsupported, invalid or absent format! Please use a valid preferences file.")
                    }
                    importbtn.remove();
                };
                reader.readAsText(file);
            }
        });
        document.body.appendChild(importbtn);
        importbtn.click();
        `, 'wrench');
    createSuboption(prefTab, 'Reset preferences', 'This wipes EVERY preference (Background color, username, spaghetti density, etc).\nDo not use this unless you know what you\'re doing and haven\'t saved your preferences.\nOnce you reset your preferences, this process is IRREVERSIBLE.',
        `confirmDialog(()=>{
            setTimeout(()=>{
                confirmDialog(()=>{
                    localStorage.clear(); reboot()
                },
                "Are you absolutely sure?", '')
            },.5e3)
        },
        "Are you sure?",
        "Do not accept unless you know what you're doing.\\nOnce you reset your preferences, this process is IRREVERSIBLE, so make sure to save your preferences before resetting.\\n\\nThe system will restart after resetting to apply the default settings.")`,
        'bin');
    createSuboption(audioTab, 'Toggle pausing background music on unfocus',
        localStorage.pauseMusic === 'true' ? 'Background music currently gets paused on unfocus.\nSelect to not mute it on unfocus.' : 'Background music currently doesn\'t get muted on unfocus.\nSelect to mute it on unfocus.', `
        localStorage.pauseMusic = localStorage.pauseMusic === 'true' ? 'false' : 'true';
        if (localStorage.pauseMusic === 'true') {
            setSuboption(selectedOption, selectedSuboption, 'Toggle pausing background music on unfocus', 'Background music currently gets paused on unfocus.\\nSelect to not mute it on unfocus.');
        } else {
            bgMusic.play()
            setSuboption(selectedOption, selectedSuboption, 'Toggle pausing background music on unfocus', 'Background music currently doesn\\'t get muted on unfocus.\\nSelect to enable that.');
        }`, 'wrench');
    createSuboption(audioTab, 'Set master volume', `Master volume is currently at ${decimalStrToPercentage(localStorage.masterVolume)}% volume.`, `
        inputDialog('Set master volume', null, decimalStrToPercentage(localStorage.masterVolume), 0, 100, 1, '{value}%', (volume)=>{
            setMasterVolume(percentageToDecimal(volume));
            setSuboption(selectedOption, selectedSuboption, 'Set master volume', \`Master volume is currently at \${decimalStrToPercentage(localStorage.masterVolume)}% volume.\`);
        });
    `, 'wrench');
    createSuboption(audioTab, 'Set background music volume', `Background music is currently at ${decimalStrToPercentage(localStorage.musicVolume)}% volume.`, `
        inputDialog('Set background music volume', null, decimalStrToPercentage(localStorage.musicVolume), 0, 100, 1, '{value}%', (volume)=>{
            localStorage.musicVolume = percentageToDecimal(volume);
            bgMusic.volume = parseFloat(localStorage.musicVolume).clamp(0, 1) * masterVolume;
            setSuboption(selectedOption, selectedSuboption, 'Set background music volume', \`Background music is currently at \${decimalStrToPercentage(localStorage.musicVolume)}% volume.\`);
        });
    `, 'wrench');
    createSuboption(audioTab, 'Set UI sound volume', `UI sounds are currently at ${decimalStrToPercentage(localStorage.uiSoundVolume)}% volume.`, `
        inputDialog('Set UI sound volume', null, decimalStrToPercentage(localStorage.uiSoundVolume), 0, 100, 1, '{value}%', (volume)=>{
            localStorage.uiSoundVolume = percentageToDecimal(volume);
            setSuboption(selectedOption, selectedSuboption, 'Set UI sound volume', \`UI sounds are currently at \${decimalStrToPercentage(localStorage.uiSoundVolume)}% volume.\`);
        });
    `, 'wrench');

    createSuboption(graphTab, 'Toggle effects',
        localStorage.noShaders === 'true' ? 'Effects are currently disabled.\nSelect to turn them on.' : 'Effects are currently enabled.\nSelect to turn them off.', `
        localStorage.noShaders = localStorage.noShaders === 'true' ? 'false' : 'true';
        if (localStorage.noShaders === 'true') {
            setSuboption(selectedOption, selectedSuboption, 'Toggle effects', 'Effects are currently disabled.\\nSelect to turn them on.');
            traverseDOM(document.body, (element) => {
                element.style.backdropFilter = 'none'
            });
        } else {
            setSuboption(selectedOption, selectedSuboption, 'Toggle effects', 'Effects are currently enabled.\\nSelect to turn them off.');
            traverseDOM(document.body, (element) => {
                element.style.backdropFilter = ''
            });
        }`,
        'wrench'
    );
    createSuboption(graphTab, 'Toggle animations',
        localStorage.noTransitions === 'true' ? 'Animations are currently disabled.\nSelect to turn them on.' : 'Animations are currently enabled.\nSelect to turn them off.', `
        localStorage.noTransitions = localStorage.noTransitions === 'true' ? 'false' : 'true';
        if (localStorage.noTransitions === 'true') {
            setSuboption(selectedOption, selectedSuboption, 'Toggle animations', 'Animations are currently disabled.\\nSelect to turn them on.');
            traverseDOM(document.body, (element) => {
                element.style.transition = 'none'
                element.style.animation = 'none'
            });
        } else {
            setSuboption(selectedOption, selectedSuboption, 'Toggle animations', 'Animations are currently enabled.\\nSelect to turn them off.');
            traverseDOM(document.body, (element) => {
                element.style.transition = ''
                element.style.animation = ''
            });
        }`,
        'wrench'
    );

    Object.keys(bgColors).forEach((color, i) => {
        createSuboption(themeTab, color.toTitleCase(), `Select to set the theme to "${color.toTitleCase()}".`, `changeBGColor({colorName: "${color}"})`, 'image');
        if (color === localStorage.bgColor)
            selectedSuboptions[themeTab] = i;
    });

    createSuboption(waveTab, 'None', 'Disables the wave entirely, best for low-end devices.', 'density = 0; localStorage.spaghettiDensity = density', 'wrench');
    createSuboption(waveTab, 'Lowest', 'Least detail, the fastest option if you want a background wave and more performance.', 'density = 15; localStorage.spaghettiDensity = density', 'wrench');
    createSuboption(waveTab, 'Low', 'Less detail, a better option if you want a denser background wave and have a lower-end device.', 'density = 35; localStorage.spaghettiDensity = density', 'wrench');
    createSuboption(waveTab, 'Medium', 'More detail, recommended for mid-range devices with good enough performance.', 'density = 50; localStorage.spaghettiDensity = density', 'wrench');
    createSuboption(waveTab, 'High', "High detail, recommended for computers with a good CPU (or GPU, if supported).\nNot recommended for lower-end devices, since they could have slowdowns or overheat.", 'density = 75; localStorage.spaghettiDensity = density', 'wrench');

    createSuboption(helpTab, 'Convert Save File', null, `
        const width = window.innerWidth / 2;
        const height = window.innerHeight / 2;

        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const newWindow = window.open(
            './subpages/convertsave/index.html',
            'convert',
            \`width=${width},height=${height},left=${left},top=${top}\`
        );

        if (isDefined(newWindow.focus)) newWindow.focus();
    `, 'wrench');
    createSuboption(helpTab, "Open Project Noema's GitHub repo", null, `
        window.open('https://github.com/sophb-ccjt/noema', '_blank')
    `, 'open-external');
    createSuboption(helpTab, "Report an issue on GitHub", null, `
        window.open('https://github.com/sophb-ccjt/noema/issues/new', '_blank')
    `, 'open-external');

    createSuboption(debugTab, 'Toggle debugging UI', localStorage.debugUI === 'true' ? 'Debug UI is currently on.\nSelect to turn it off.' : 'Debug UI is currently off.\nSelect to turn it on.', `
        localStorage.debugUI = localStorage.debugUI === 'true' ? 'false' : 'true';
        if (localStorage.debugUI === 'true') {
            document.getElementById('debug-ui').style.display = 'block';
            setSuboption(selectedOption, selectedSuboption, 'Toggle debugging UI', 'Debug UI is currently on.\\nSelect to turn it off.');
        } else {
            document.getElementById('debug-ui').style.display = 'none';
            setSuboption(selectedOption, selectedSuboption, 'Toggle debugging UI', 'Debug UI is currently off.\\nSelect to turn it on.');
        }`,
        'star');
    createSuboption(debugTab, 'Clear Errors', null, 'errors = 0; errorList = []; document.getElementById(\'errors\').innerText = `Errors: ${errors}`', 'star');
    createSuboption(debugTab, 'Load Script', null, `
        promptDialog((url)=>{
            if (!url) return
            if (!isURL(url)) throw new TypeError("Script URL provided isn't even a URL.");
            if (document.getElementById('script-' + url)) throw new Error('Script already loaded!')
            let script = document.createElement('script')
            script.src = url
            script.id = 'script-' + url
            document.body.appendChild(script)
        }, 'Enter a script URL...')
    `, 'star');

    selectUIOption(1);

    let date = new AdvDate();
    function updateTime() {
        let time = date.getDateString({
            trimWeek: true,
            showWeek: false,
            monthFirst: true,
            timeFirst: true
        });
        document.getElementById('time').innerText = time;
        document.getElementById('hourhand').style.transform = `rotateZ(${360 * (date.hours() % 12) / 12}deg)`;
        document.getElementById('minhand').style.transform = `rotateZ(${360 * date.minutes() / 60}deg)`;
        document.getElementById('sechand').style.transform = `rotateZ(${360 * date.seconds() / 60}deg)`;
        document.getElementById('sechand-line').setAttribute('stroke', accentColor);
        requestAnimationFrame(updateTime);
    }
    updateTime();

    let volume = parseFloat(localStorage.musicVolume).clamp(0, 1);
    let fadeIn = () => {
        let t = 0;
        let int = setInterval(() => {
            if (t >= volume) {
                bgMusic.volume = volume * masterVolume;
                clearInterval(int);
                return;
            }
            t += 0.01;
            bgMusic.volume = t.clamp(0, volume * masterVolume);
        }, 1e3 / 30);
    };
    fadeIn();

    if (localStorage.noShaders === 'true')
        traverseDOM(document.body, (element) => {
            element.style.backdropFilter = 'none';
        });

    if (localStorage.noTransitions === 'true')
        traverseDOM(document.body, (element) => {
            element.style.transition = 'none';
            element.style.animation = 'none';
        });


    // setInterval(navigator.internet.testConnection, 30e3)

    document.addEventListener('keydown', handleInput);
    document.addEventListener('keyup', handleInput);
    updateLoop();
    if (new Date().getMonth() === 11) startFlakes();

    localStorage?.defaultScripts?.split('|')?.forEach(url => {
        if (!isDefined(url)) return;
        if (!isURL(url)) return;
        if (document.getElementById('script-' + url)) return;
        let script = document.createElement('script');
        script.src = url;
        script.id = 'script-' + url;
        document.body.appendChild(script);
    });

    showChangelog();
    let evtn = new CustomEvent('noemaStarted');
    document.dispatchEvent(evtn);
}

let battery, batteryWarned = false;
async function updateBattery() {
    if ('getBattery' in navigator) {
        battery = await navigator.getBattery();
        battery.lowBatteryThresh = 0.25;
        battery.hasBattery = !(
            battery.level === 1 &&
            battery.charging === true &&
            battery.dischargingTime === Infinity ||
            !('onlevelchange' in battery)
        );

        // hide battery indicator if device likely has no battery
        document.getElementById('battery-div').style.display = battery.hasBattery ? 'flex' : 'none';

        const batteryPercent = decimalToTruncPercentage(battery.level);
        document.getElementById('battery-bar').style.width = `${batteryPercent}%`;
        document.getElementById('battery-text').textContent = `${batteryPercent}%${battery.charging ? ' 🗲' : ''}`;

        if (battery.level >= 0.75)
            document.getElementById('battery-bar').style.backgroundColor = '#0f0';

        else if (battery.level > 0.5)
            document.getElementById('battery-bar').style.backgroundColor = '#8f0';

        else if (battery.level > 0.5 - battery.lowBatteryThresh / 2)
            document.getElementById('battery-bar').style.backgroundColor = '#fa0';

        else if (battery.level > battery.lowBatteryThresh)
            document.getElementById('battery-bar').style.backgroundColor = '#ff0';

        else if (battery.level <= battery.lowBatteryThresh)
            document.getElementById('battery-bar').style.backgroundColor = '#f00';

        if (battery.charging)
            document.getElementById('battery-bar').style.backgroundColor = '#2f2';

        requestAnimationFrame(updateBattery);

        return battery;
    } else {
        battery = {};
    }
}

updateBattery();
if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
        battery.lowBatteryThresh = 0.25;
        battery.addEventListener('chargingchange', function () {
            if (!battery.charging && battery.level <= battery.lowBatteryThresh) {
                notify('Battery low!', `Battery is at ${decimalToPercentage(battery.level)}%, please reconnect the charger!`);
            }
        });
    });
}

async function updateLoop(timestamp) {
    if (Date.now() - lastActivity > 60e3 * 1.5) {
        ui.classList.add('inactive');
    } else {
        let suboptions = document.getElementById(`ui-content${selectedOption}`).querySelectorAll('.ui-suboption');
        if (Date.now() - lastActivity > 9e3) {
            suboptions.forEach(suboption => {
                suboption.classList.add('inactive');
            });
        } else {
            suboptions.forEach(suboption => {
                suboption.classList.remove('inactive');
            });
        }
        ui.classList.remove('inactive');
    }

    if (Date.now() - lastActivity < 10 * 60e3) {
        density = parseInt(localStorage.spaghettiDensity);
        document.getElementById('darken').style.opacity = '';
    } else if (Date.now() - lastActivity < 30 * 60e3) {
        if (parseInt(localStorage.spaghettiDensity) > 50) density = 50;
        document.getElementById('darken').style.opacity = '25%';
    } else {
        if (parseInt(localStorage.spaghettiDensity) > 30) density = 30;
        document.getElementById('darken').style.opacity = '90%';
    }

    if (started) {
        focusUIOption(selectedOption);
    }

    if (battery?.level <= battery?.lowBatteryThresh && !batteryWarned) {
        batteryWarned = true;
        if (!battery.charging) {
            notify('Battery low!', `Battery level is at ${decimalToPercentage(battery.level)}%. Please charge your device.`);
        }
    } else if (battery?.level > battery?.lowBatteryThresh && batteryWarned) {
        batteryWarned = false;
    }

    requestAnimationFrame(updateLoop);
}
