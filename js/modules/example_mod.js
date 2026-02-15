function startMod() {
    if (started) {
        changeBGColor(null, undefined, "#000", "#000", "#fff");
        spaghettiColor = "#0000";
        bgMusic.pause();
        lastActivity = Date.now();

        setTimeout(() => {
            notify('Example mod loaded!', null, 'star');
            // mod preinit
            let modthemes = window.modthemes = {
                "default": {
                    "desc": "default theme",
                    "top": "#048",
                    "bottom": "#204",
                    "accent": "#20c"
                },
                "black": {
                    "desc": "not really",
                    "top": "#111",
                    "bottom": "#111",
                    "accent": "#666"
                }
            };
            window.setTheme = function (theme) {
                if (theme in modthemes) {
                    localStorage.ccjtmodTheme = theme;
                    changeBGColor(null, undefined, modthemes[theme].top, modthemes[theme].bottom, modthemes[theme].accent);
                }
            };

            version.more = ['example', 'mod'];
            document.getElementById('version-number').textContent = formatVersion();

            // mod init
            if (!localStorage.ccjtmodTheme) localStorage.ccjtmodTheme = 'default';
            if (!localStorage.ccjtmodMenuMusic) localStorage.ccjtmodMenuMusic = 'https://file.garden/aHFDYCLeNBLSceNi/scizzie%20-%20aquatic%20ambience.mp3';
            
            bgMusic.src = localStorage.ccjtmodMenuMusic;
            if (localStorage.muteBGMusic !== 'true') bgMusic.play();

            setTheme(localStorage.ccjtmodTheme);
            removeOption(3);

            labels = ['example mod loaded'];

            density = 35;
            calcY = function (x, canvasHeight, wave) {
                const value = wave % 2 ? -Math.tan(t / 4 + wave + x / canvas.width) * canvasHeight : Math.tan(t / 2 + wave + x / canvas.width) * canvasHeight;

                if (!Number.isFinite(value) || Math.abs(value) > canvasHeight) return value > 0 ? Infinity : -Infinity;
                return value;
            };
            spaghettiColor = "#fff";

            if (new Date().getMonth() !== 11) startFlakes();

            // mod thingy
            let modprefId = createOption('mod preferences');
            let modthemesId = createOption('mod themes');
            let modsillyId = createOption('flashbang');

            createSuboption(modprefId, 'set bg music', 'sets the bg music source to any url', `
                promptDialog((url)=>{
                    bgMusic.src = url
                    changeBGColor(null, undefined, "#000", "#000")
                    localStorage.ccjtmodMenuMusic = bgMusic.src
                    setTimeout(()=>{
                        setTheme(localStorage.ccjtmodTheme)
                        if (localStorage.muteBGMusic !== 'true') bgMusic.play()
                    },.5e3)
                }, 'enter a (valid) url...', 'I LOVE MING I LOVE MING I LOVE MING I LOVE MING I LOVE MING I LOVE MING')
            `, 'wrench');
            createSuboption(modprefId, 'reset bg music (mod)', 'sets the bg music to the mod\'s default menu music', `
                bgMusic.src = 'https://file.garden/aHFDYCLeNBLSceNi/scizzie%20-%20aquatic%20ambience.mp3'
                changeBGColor(null, undefined, "#000", "#000")
                localStorage.ccjtmodMenuMusic = bgMusic.src
                setTimeout(()=>{
                    setTheme(localStorage.ccjtmodTheme)
                    if (localStorage.muteBGMusic !== 'true') bgMusic.play()
                },.5e3)
            `, 'wrench', 'power');
            createSuboption(modprefId, 'reset bg music (vanilla)', 'sets the bg music to the vanilla menu music', `
                bgMusic.src = './menu_music.flac'
                changeBGColor(null, undefined, "#000", "#000")
                localStorage.ccjtmodMenuMusic = bgMusic.src
                setTimeout(()=>{
                    setTheme(localStorage.ccjtmodTheme)
                    if (localStorage.muteBGMusic !== 'true') bgMusic.play()
                },.5e3)
            `, 'wrench', 'power');

            createSuboption(modsillyId, 'flashbang', 'why did i make this', `
                let flashbang = new Audio('https://file.garden/aHFDYCLeNBLSceNi/flashbang.mp3')
                let flash = document.createElement('div')
                flash.style.backgroundColor = '#fff'
                flash.style.transition = 'opacity 10s linear'
                flash.style.position = 'fixed'
                flash.style.top = '0px'
                flash.style.left = '0px'
                flash.style.width = '100vw'
                flash.style.height = '100vh'
                flash.style.zIndex = 'calc(infinity)'
                notify("WATCH OUT!!!")
                setTimeout(()=>{
                    flashbang.play()
                    selectUIOption(${modsillyId - 1})
                    requestAnimationFrame(()=>{
                        removeOption(${modsillyId})
                    })
                    document.body.appendChild(flash)
                    setTimeout(()=>{
                        notify("told you...")
                    }, 3e3)
                    setTimeout(()=>{
                        flash.style.opacity = '0%'
                        setTimeout(()=>{
                            flash.remove()
                        }, 10e3)
                    }, .5e3)
                }, .5e3)
            `);

            for (let i = 0; i < Object.keys(modthemes).length; i++) {
                createSuboption(modthemesId, Object.keys(modthemes)[i], modthemes[Object.keys(modthemes)[i]].desc, `
                    setTheme("${Object.keys(modthemes)[i]}")
                `, 'image');
            }
            createSuboption(modthemesId, '---more coming soon---', null, null, null);

            for (let i = 0; i < document.getElementById('ui-options').querySelectorAll('a').length; i++) {
                selectedSuboptions[i] = 0;
            }
            selectedSuboptions[0] = 1;
        }, .5e3);
    }
}
createSuboption(1, 'enable example mod', null, `startMod(); selectUIOption(0); removeSuboption(1, document.getElementById('ui-content1').querySelectorAll('.ui-suboption').length - 1)`, 'star', 'power');