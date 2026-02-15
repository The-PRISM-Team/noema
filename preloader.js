async function loadScripts() {
    const scripts = [
        {
            src: '/js/modules/color.global.js'
        },
        {
            src: '/js/modules/jquery-3.7.1.js'
        },
        {
            src: '/js/modules/gamecontroller.js'
        },
        {
            src: '/js/modules/gapless5.js',
            language: 'JavaScript',
            type: 'text/javascript'
        },
        {
            src: '/js/modules/controller_input.js'
        },
        {
            src: '/js/modules/protoplus.js'
        },
        {
            src: '/js/modules/bgFormat.js'
        },
        {
            src: '/js/modules/URLutil.js'
        },
        {
            src: '/js/modules/file.js'
        },
        {
            src: '/js/modules/util.js'
        },
        {
            src: '/js/error.js'
        },
        {
            src: '/js/power.js'
        },
        {
            src: '/js/game.js'
        },
        {
            src: '/js/controller.js'
        },
        {
            src: '/js/changelog.js'
        },
        {
            src: '/js/bg.js'
        },
        {
            src: '/js/ui.js'
        },
        {
            src: '/js/user.js'
        },
        {
            src: '/js/info.js'
        },
        {
            src: '/js/base.js'
        }
    ];

    for (let scriptObj of scripts) {
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
        });
    }
}
