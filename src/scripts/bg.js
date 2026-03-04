const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
}

window.addEventListener("resize", resize);
resize();

// spaghetti
let t = Math.PI, // spaghetti phase
	t2 = t, // spaghetti up/down shift
	t3 = t; // spaghetti left/right shift

const densities = {
	none: {
		desc: 'Disables the wave entirely, best for low-end devices.',
		value: 0,
		memFunc: (mem) => mem < 2
	},
	lowest: {
		desc: 'Least detail, the fastest option if you want a background wave and more performance.',
		value: 15,
		memFunc: (mem) => mem < 4
	},
	low: {
		desc: 'Less detail, a better option if you want a denser background wave and have a lower-end device.',
		value: 35,
		memFunc: (mem) => mem < 16
	},
	medium: {
		desc: 'More detail, recommended for mid-range devices with good enough performance.',
		value: 50,
		memFunc: (mem) => mem < 24
	},
	high: {
		desc: 'High detail, recommended for computers with a good CPU (or GPU, if supported).\nNot recommended for lower-end devices, since they could have slowdowns or overheat.',
		value: 75,
		memFunc: (mem) => mem >= 24
	}
}
// const densityArray = Object.entries(densities).map(v => v[1].value);

if (!isDefined(localStorage.spaghettiDensity)) {
	const mem = navigator.deviceMemory;

	for (const data of Object.entries(densities).map(v => v[1])) {
		if (data.memFunc(mem)) {
			localStorage.spaghettiDensity = data.value;
			break;
		}
	}
}

let density = parseInt(localStorage.spaghettiDensity); // how many sines are drawn
let spaghettiColor = "#fff8";
let calcY = function (x, canvasHeight, wave) {
	return canvasHeight / 2 - wave +
		Math.sin(x / 200 + t + wave / (density * t) + ((Math.cos(t) + -Math.cos(t3))) * .75) * 40 +
		Math.cos(wave + t) * 40
		+ (Math.cos(t) + -Math.cos(t2)) * 30;
};
function drawSpaghetti(time) {
	if (!focused) {
		requestAnimationFrame(drawSpaghetti);
		return;
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	let step;
	if (density === 0) {
		step = Infinity;
	} else {
		const BASE_WIDTH = 1920;
		const BASE_DENSITY = 50;
		const BASE_STEP = 10;
		const scale = (canvas.width / BASE_WIDTH) * (density / BASE_DENSITY);
		step = Math.min(12, Math.max(1, Math.round(BASE_STEP * scale)));
	}
	ctx.strokeStyle = spaghettiColor;
	for (let wave = 0; wave < density; wave++) {
		ctx.beginPath();

		for (let x = 0; x < canvas.width; x += step) {
			const y = calcY(x, canvas.height, wave);
			ctx.lineTo(x, y);
		}
		const y = calcY(canvas.width, canvas.height, wave);
		ctx.lineTo(canvas.width, y);

		ctx.stroke();
	}

	t += .01 * 60/avgfps;
	t2 += .015 * 60/avgfps;
	t3 += .025 * 60/avgfps;

	requestAnimationFrame(drawSpaghetti);
}

// background gradient
const bgColors = {
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
	"frogleaf": {
		"top": "#14881d",
		"bottom": '#42ff2a',
		"accentColor": "#52ff4c"
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
	"cherry": {
		"top": "#ff0080",
		"bottom": "#ff80ff",
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
	},
	"trans flag": {
		"top": "#5BCEFA",
		"bottom": "#F5A9B8",
		"accentColor": "#AFBAD6"
	}
};
if (!isDefined(localStorage.bgColor) || !Object.keys(bgColors).includes(localStorage.bgColor)) localStorage.bgColor = 'noema';
if (!isDefined(localStorage.bgBrightness)) localStorage.bgBrightness = '1';
let currentColor = {
	top: "#000",
	bottom: "#000"
};
let accentColor = currentColor.accentColor ?? currentColor.bottom;
document.body.style.accentColor = currentColor;

let bgTop = 5;
let bgBrightness = parseFloat(localStorage.bgBrightness) || 1;
let bgBottom = 100;
let changingBG = false;
let queued;
function changeBGColor({
	colorName = null,
	easing = .075,
	topColor = bgColors[colorName].top,
	bottomColor = bgColors[colorName].bottom,
	AccentColor = bgColors[colorName]?.accentColor ?? bottomColor,
	waveColor = bgColors[colorName]?.waveColor ?? "#fff",
	brightness = bgBrightness
} = {}) {
	const paramsPassed = {
		colorName,
		easing,
		topColor,
		bottomColor,
		AccentColor,
		waveColor,
		brightness
	};

	let color = bgColors[colorName];

	if (!isDefined(color) && topColor && bottomColor) color = { top: topColor, bottom: bottomColor, accentColor: AccentColor };
	if (changingBG) {
		queued = paramsPassed;
		return;
	}

	if (Object.keys(bgColors).includes(colorName))
		localStorage.bgColor = colorName;

	function applyBrightness(colorInput, brightnessVal) {
		const c = Color.get(colorInput);
		try {
			const lch = c.lch.slice();
			lch[0] = Math.max(0, Math.min(100, lch[0] * brightnessVal));
			return new Color('lch', lch, c.alpha).toString({ format: 'hex' });
		} catch (e) {
			return c.toString({ format: 'hex' });
		}
	}

	if (localStorage.noTransitions === 'true') {
		const topFinal = applyBrightness(topColor, brightness);
		const bottomFinal = applyBrightness(bottomColor, brightness);
		document.body.style.background = formatBGGradient(bgTop, 100, topFinal, bottomFinal);
		document.body.style.accentColor = accentColor = AccentColor;
		spaghettiColor = `rgba(255,255,255,${Math.min(0.8, 0.12 * brightness)})`;
	} else {
		changingBG = true;
		let t = 0;
		function anim() {
			if (t > 1) {
				currentColor = color;
				changingBG = false;
				const topFinal = applyBrightness(topColor, brightness);
				const bottomFinal = applyBrightness(bottomColor, brightness);
				document.body.style.background = formatBGGradient(bgTop, 100, topFinal, bottomFinal);
				document.body.style.accentColor = accentColor = AccentColor;
				spaghettiColor = `rgba(255,255,255,${Math.min(0.8, 0.12 * brightness)})`;
				if (queued) {
					changeBGColor(queued);
					queued = undefined;
				}
				return;
			}

			const topColor1 = new Color(currentColor.top);
			const topColor2 = new Color(color.top);
			const topLerp = topColor1.range(topColor2);

			const botColor1 = new Color(currentColor.bottom);
			const botColor2 = new Color(color.bottom);
			const botLerp = botColor1.range(botColor2);

			const accColor1 = new Color(accentColor);
			const accColor2 = new Color(AccentColor);
			const accLerp = accColor1.range(accColor2);


			t += easing;
			const topHex = applyBrightness(topLerp(t).toString({ format: 'hex' }), brightness);
			const botHex = applyBrightness(botLerp(t).toString({ format: 'hex' }), brightness);
			document.body.style.background = formatBGGradient(bgTop, bgBottom, topHex, botHex);
			document.body.style.accentColor = accentColor = accLerp(t).toString({ format: 'hex' }) ?? botLerp(t).toString({ format: 'hex' });

			spaghettiColor = `rgba(255,255,255,${Math.min(0.8, 0.12 * (1 + t * (brightness - 1)))})`;

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
	const id = `flake${Math.random()}`;
	const pos = prismflakes[id] = {
		'x': 0,
		'startingX': Math.floor(Math.random() * window.innerWidth),
		'y': -64,
		'r': 0,
		'xvel': 0,
		'yvel': Math.random() * 4 + 1,
		'rvel': Math.random() * 90 - 45
	};
	const flake = document.createElement('img');
	flake.id = id;
	flake.src = localStorage.coloredFavicon === 'true' ? '/assets/logos/prism/color.png' : '/assets/logos/prism/white.png';
	flake.height = '32';
	flake.style.position = 'fixed';
	flake.style.left = `${pos.x}px`;
	flake.style.top = `${pos.y}px`;
	flake.style.transform = `rotate(${pos.r}deg)`;
	prismflakeDiv.append(flake);
}
function updateFlakes() {
	for (const id in prismflakes) {
		if (!focused) continue;
		const pos = prismflakes[id];
		const flake = document.getElementById(id);
		if (!flake) {
			delete prismflakes[id];
			continue;
		}
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
				if (Object.keys(prismflakes).length <= 1) {
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
	const int = setInterval(() => {
		if (!prismflakesStarted) {
			clearInterval(int);
			return;
		}
		if (focused) {
			requestAnimationFrame(() => {
				for (let i = 0; i < randomIntFromRange(1, 5); i++) {
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
