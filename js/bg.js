const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}

window.addEventListener("resize", resize);
resize();

// spaghetti
let t = Math.PI,
    t2 = t, // spaghetti up/down shift
    t3 = t; // spaghetti left/right shift

if (!isDefined(localStorage.spaghettiDensity)) {
    if (navigator.deviceMemory < 2)
        localStorage.spaghettiDensity = '0';
    else if (navigator.deviceMemory < 4)
        localStorage.spaghettiDensity = '15';
    else if (navigator.deviceMemory <= 4)
        localStorage.spaghettiDensity = '35';
    else if (navigator.deviceMemory <= 16)
        localStorage.spaghettiDensity = '50';
    else if (navigator.deviceMemory >= 32)
        localStorage.spaghettiDensity = '75';
}
let density = parseInt(localStorage.spaghettiDensity); // how many sines are drawn
let spaghettiColor = "rgba(255, 255, 255, 0)";
let calcY = function (x, canvasHeight, wave) {
    return canvasHeight / 2 - wave +
        Math.sin(x / 200 + t + wave / (density * t) + ((Math.cos(t) + -Math.cos(t3))) * .75) * 40 +
        Math.cos(wave + t) * 40
        + (Math.cos(t) + -Math.cos(t2)) * 30;
};
function drawSpaghetti(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    let step = (() => {
        if (density === 0) return Infinity;

        const BASE_WIDTH = 1920;
        const BASE_DENSITY = 50;
        const BASE_STEP = 10;

        const scale =
            (canvas.width / BASE_WIDTH) *
            (density / BASE_DENSITY);

        return Math.min(
            12,
            Math.max(1, Math.round(BASE_STEP * scale))
        );
    })();
    for (let wave = 0; wave < density; wave++) {
        ctx.strokeStyle = spaghettiColor;
        ctx.beginPath();

        for (let x = 0; x < canvas.width; x += step) {
            const y = calcY(x, canvas.height, wave);
            ctx.lineTo(x, y);
        }
        const y = calcY(canvas.width, canvas.height, wave);
        ctx.lineTo(canvas.width, y);

        ctx.stroke();
    }

    t += .01;
    t2 += .015;
    t3 += .025;

    requestAnimationFrame(drawSpaghetti);
}

// background gradient
let colors = {
    "charcoal": {
        "top": "#222",
        "bottom": "#888",
        "accentColor": "#444"
    },
    "ash": {
        "top": "#ddd",
        "bottom": "#888",
        "accentColor": "#aaa"
    },
    "amethyst": {
        "top": "#a0c",
        "bottom": "#c0c",
        "accentColor": "#f0f"
    },
    "ember": {
        "top": "#f88",
        "bottom": "#d00",
        "accentColor": "#f00"
    },
    "cobalt": {
        "top": "#00d",
        "bottom": "#48d",
        "accentColor": "#00f"
    },
    "neonflux": {
        "top": "#f0f",
        "bottom": "#fb0",
        "accentColor": "#0ff"
    },
    "meadow": {
        "top": "#96D470",
        "bottom": "#F2EE8F"
    },
    "shore": {
        "top": "#34AE9E",
        "bottom": "#F2AC44",
        "accentColor": "#f01a45"
    },
    "noema": {
        "top": "#0000ff",
        "bottom": "#ff00ff",
        "accentColor": "#ff40ff"
    },
    "PRISM": {
        "top": "#13aef9",
        "bottom": "#17f842",
        "accentColor": "#17f1de"
    },
    "sprite": {
        "top": "#204795",
        "bottom": "#02A04C",
        "accentColor": "#F7D704"
    },
    "watermelon sugar": {
        "top": "#ff0080",
        "bottom": "#00ff80",
        "accentColor": "#ff0080"
    },
    "bisexual flag": {
        "top": "#D60270",
        "bottom": "#0038A8",
        "accentColor": "#9B4F96"
    },
    "lesbian flag": {
        "top": "#E95D27",
        "bottom": "#CB4F9A",
        "accentColor": "#C0162D"
    },
    "gay flag": {
        "top": "#4FD7B2",
        "bottom": "#6476D6",
        "accentColor": "#55BDBC"
    }
};

if (!isDefined(localStorage.bgColor) || !Object.keys(colors).includes(localStorage.bgColor)) localStorage.bgColor = 'noema';
let currentColor = {
    top: "#000",
    bottom: "#000"
};
let accentColor = currentColor.accentColor ?? currentColor.bottom;
document.body.style.accentColor = currentColor;

let bgTop = 5;
let bgBrightness = 1;
let bgBottom = 100;
let changingBG = false;
let queued;
function changeBGColor(colorName, easing = .075, topColor = colors[colorName].top, bottomColor = colors[colorName].bottom, AccentColor = colors[colorName]?.accentColor ?? bottomColor, brightness = bgBrightness) {
    let color = colors[colorName];
    if (!color && topColor && bottomColor) color = { top: topColor, bottom: bottomColor, accentColor: AccentColor };
    if (changingBG) {
        queued = [color, easing, topColor, bottomColor, AccentColor];
        return;
    }
    if (Object.keys(colors).includes(colorName))
        localStorage.bgColor = colorName;

    if (localStorage.noTransitions === 'true') {
        document.body.style.background = formatBGGradient(bgTop, 100, topColor, bottomColor);
        document.body.style.accentColor = accentColor = AccentColor;
    } else {
        changingBG = true;
        let t = 0;
        function anim() {
            if (t > 1) {
                currentColor = color;
                changingBG = false;
                document.body.style.background = formatBGGradient(bgTop, 100, topColor, bottomColor);
                document.body.style.accentColor = accentColor = AccentColor;
                if (queued) {
                    changeBGColor(...queued);
                    queued = undefined;
                }
                return;
            }

            let topColor1 = new Color(currentColor.top);
            let topColor2 = new Color(color.top);
            let topLerp = topColor1.range(topColor2);

            let botColor1 = new Color(currentColor.bottom);
            let botColor2 = new Color(color.bottom);
            let botLerp = botColor1.range(botColor2);

            let accColor1 = new Color(accentColor);
            let accColor2 = new Color(AccentColor);
            let accLerp = accColor1.range(accColor2);


            t += easing;
            document.body.style.background = formatBGGradient(bgTop, bgBottom,
                topLerp(t).toString({ format: 'hex' }),
                botLerp(t).toString({ format: 'hex' })
            );
            document.body.style.accentColor = accentColor = accLerp(t).toString({ format: 'hex' }) ?? botLerp(t).toString({ format: 'hex' });

            requestAnimationFrame(anim);
        }
        anim();
    }
}

// prismflakes
let prismflakeDiv = null,
prismflakes = {},
prismflakesStarted = false;
function addFlake() {
    if (!prismflakesStarted) return;
    let id = `flake${Math.random()}`;
    let pos = prismflakes[id] = {
        'x': 0,
        'startingX': Math.floor(Math.random() * window.innerWidth),
        'y': -64,
        'r': 0,
        'xvel': 0,
        'yvel': Math.random() * 4 + 1,
        'rvel': Math.random() * 90 - 45
    };
    let flake = document.createElement('img');
    flake.id = id;
    flake.src = localStorage.coloredFavicon === 'true' ? './prism_logo_color.png' : './prism_logo_white.png';
    flake.height = '32';
    flake.style.position = 'fixed';
    flake.style.left = `${pos.x}px`;
    flake.style.top = `${pos.y}px`;
    flake.style.transform = `rotate(${pos.r}deg)`;
    prismflakeDiv.append(flake);
}
function updateFlakes() {
    for (let i = 0; i < Object.keys(prismflakes).length; i++) {
        if (!focused) continue;
        let id = Object.keys(prismflakes)[i];
        let pos = Object.values(prismflakes)[i];
        let flake = document.getElementById(id);
        pos.r += pos.rvel;
        pos.y += pos.yvel;
        pos.x += pos.xvel;
        pos.x = pos.startingX + (Math.sin(pos.y / 100) * (10 - pos.yvel) * 10);
        flake.style.left = `${pos.x}px`;
        flake.style.top = `${pos.y}px`;
        flake.style.transform = `rotate(${pos.r}deg)`;
        if (pos.y > window.innerHeight + 64) {
            flake.remove();
            if (!prismflakesStarted) {
                if (Object.keys(prismflakes).length === 1) {
                    prismflakeDiv.remove();
                    prismflakeDiv = null;
                    return;
                }
            }
            delete prismflakes[id];
        }
    }
    requestAnimationFrame(updateFlakes);
}
function startFlakes() {
    if (prismflakesStarted) {
        throw new Error('PRISMflakes already started!');
    }
    prismflakeDiv = document.createElement('div');
    prismflakeDiv.style.position = 'fixed';
    prismflakeDiv.style.zIndex = '-100';
    prismflakeDiv.style.top = '0px';
    prismflakeDiv.style.left = '0px';
    prismflakeDiv.style.width = '100vw';
    prismflakeDiv.style.height = '100vh';
    document.body.append(prismflakeDiv);
    prismflakesStarted = true;

    updateFlakes();
    let int = setInterval(() => {
        if (!prismflakesStarted) {
            clearInterval(int);
            return;
        }
        if (focused) {
            requestAnimationFrame(() => {
                for (let i = 0; i < Math.floor(Math.random() * 10 + 5); i++) {
                    addFlake();
                }
            });
        }
    }, 1.5e3);
}
function stopFlakes() {
    if (!prismflakesStarted) {
        throw new Error('PRISMflakes already stopped!');
    }
    prismflakesStarted = false;
}