const scripts = [
    {
        src: 'https://colorjs.io/dist/color.global.js'
    },
    {
        src: 'https://code.jquery.com/jquery-3.7.1.js',
        crossorigin: 'anonymous',
        integrity: "sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4="
    },
    {
        src: './js/modules/gamecontroller.min.js'
    },
    {
        src: './js/modules/gapless5.js',
        language: 'JavaScript',
        type: 'text/javascript'
    },
    {
        src: './js/modules/controller_input.js'
    },
    {
        src: './js/modules/protoplus.js'
    },
    {
        src: './js/modules/bgFormat.js'
    },
    {
        src: './js/modules/URLutil.js'
    },
    {
        src: './js/modules/file.js'
    },
    {
        src: './js/base.js'
    },
    {
        src: './js/error.js'
    },
    {
        src: './js/power'
    },
    {
        src: './js/game.js'
    },
    {
        src: './js/controller.js'
    },
    {
        src: './js/changelog.js'
    },
    {
        src: './js/bg.js'
    },
    {
        src: './js/ui.js'
    },
    {
        src: './js/user.js'
    },
    {
        src: './js/info.js'
    }
];

for (let scriptObj of scripts) {
    const script = document.createElement('script');
    for (const [property, value] of Object.entries(scriptObj)) {
        try {
            script[property] = value;
        } catch {
            continue; // skip script if it errors
        }
    }

    document.body.appendChild(script);
}