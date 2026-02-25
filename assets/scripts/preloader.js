async function loadScripts(cb) {
    const scripts = [
        {
            src: '/assets/scripts/modules/color.global.js'
        },
        {
            src: '/assets/scripts/modules/jquery-3.7.1.js'
        },
        {
            src: '/assets/scripts/modules/gamecontroller.js'
        },
        {
            src: '/assets/scripts/modules/gapless5.js',
            language: 'JavaScript',
            type: 'text/javascript'
        },
        {
            src: '/assets/scripts/modules/crc32.js',
            lang: 'javascript'
        },
        {
            src: '/assets/scripts/modules/controller_input.js'
        },
        {
            src: '/assets/scripts/modules/protoplus.js'
        },
        {
            src: '/assets/scripts/modules/bgFormat.js'
        },
        {
            src: '/assets/scripts/modules/URLutil.js'
        },
        {
            src: '/assets/scripts/modules/file.js'
        },
        {
            src: '/assets/scripts/modules/util.js'
        },
        {
            src: '/assets/scripts/modules/version.js'
        },
        {
            src: '/assets/scripts/error.js'
        },
        {
            src: '/assets/scripts/power.js'
        },
        {
            src: '/assets/scripts/game.js'
        },
        {
            src: '/assets/scripts/controller.js'
        },
        {
            src: '/assets/scripts/changelog.js'
        },
        {
            src: '/assets/scripts/bg.js'
        },
        {
            src: '/assets/scripts/ui.js'
        },
        {
            src: '/assets/scripts/user.js'
        },
        {
            src: '/assets/scripts/info.js'
        },
        {
            src: '/assets/scripts/sounds.js'
        },
        {
            src: '/assets/scripts/base.js'
        }
    ];

    for (let i = 0; i < scripts.length; i++) {
        let scriptObj = scripts[i];
        document.getElementById('loading-progress').style.width = `${(i / (scripts.length + 1)) * 100}%`;

        if (document.querySelector(`script[src="${scriptObj.src}"]`))
            continue; // skip script if there is a script with the same src

        const script = document.createElement('script');
        if (!isDefined(scriptObj.async)) script.async = false;
        await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            for (const [property, value] of Object.entries(scriptObj)) {
                script[property] = value;
            }

            document.body.appendChild(script);
            cb(i, scripts.length, script);
        });
    }
}
