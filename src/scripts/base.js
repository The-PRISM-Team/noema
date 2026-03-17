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

const fpsCounter = document.getElementById('fps');

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
	if (started) bgMusic.resume();
});
window.addEventListener('blur', () =>{
	focused = false;
	if (started && localStorage.pauseMusic === 'true') bgMusic.pause();
});

const fpses = [];
function updateFps() {
	const now = performance.now();
	deltaTime = (now - _lastTime) / 1e3;
	_lastTime = now;
	fps = 1 / deltaTime;
	fps = Math.floor(fps);

	if (focused) { // fps can be VERY inaccurate when the tab is unfocused
		if (fpses.length > 0) {
			let fpsTotal = 0;
			for (let i = 0; i < fpses.length; i++) {
				fpsTotal += fpses[i];
			}
			avgfps = Math.round(fpsTotal / fpses.length);
		} else {
			avgfps = fps;
		}

		if (avgfps === 0 && focused) avgfps = fps;
	}
	fpses.push(fps);
	if (fpses.length > 120) {
		fpses.shift();
	}

	requestAnimationFrame(updateFps);
}
updateFps();
setInterval(() => {
	fpsCounter.textContent = `${getLocaleStr('debug.estfps')} ${fps} | ${getLocaleStr('debug.avgfps')} ${avgfps}`;
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

function startTimeRuntime() {
	const date = new AdvDate();
	const timeText = document.getElementById('time');
	const hourHand = document.getElementById('hourhand');
	const minHand = document.getElementById('minhand');
	const secHand = document.getElementById('sechand');
	const secHandLine = document.getElementById('sechand-line');
	function updateTime() {
		const time = getLocaleTimeStr('time') + ' ' + getLocaleTimeStr('date');
		timeText.textContent = time;
		hourHand.style.transform = `rotateZ(${360 * (date.hours() % 12) / 12}deg)`;
		minHand.style.transform = `rotateZ(${360 * date.minutes() / 60}deg)`;
		secHand.style.transform = `rotateZ(${360 * date.seconds() / 60}deg)`;
		secHandLine.setAttribute('stroke', accentColor);
		requestAnimationFrame(updateTime);
	}
	updateTime();
}
function fadeInBackgroundMusic() {
	const volume = parseFloat(localStorage.musicVolume).clamp(0, 1);
	let t = 0;
	const int = setInterval(() => {
		if (t >= volume) {
			bgMusic.volume = volume * masterVolume;
			clearInterval(int);
			return;
		}
		t += 0.01;
		bgMusic.volume = t.clamp(0, volume * masterVolume);
	}, 1e3 / 30);
}
function applyVisualPreferenceOverrides() {
	if (localStorage.noShaders === 'true')
		traverseDOM(document.body, (element) => {
			element.style.backdropFilter = 'none';
		});

	if (localStorage.noTransitions === 'true')
		traverseDOM(document.body, (element) => {
			element.style.transition = 'none';
			element.style.animation = 'none';
		});
}
function loadDefaultScripts() {
	localStorage?.defaultScripts?.split('|')?.forEach(url => {
		if (!isDefined(url)) return;
		if (!isURL(url)) return;
		if (document.getElementById('script-' + url)) return;
		const script = document.createElement('script');
		script.src = url;
		script.id = 'script-' + url;
		document.body.appendChild(script);
	});
}
function startBootRuntime() {
	if (new Date().getMonth() === 11) startFlakes();
	loadDefaultScripts();
	showChangelog();
	const evtn = new CustomEvent('noemaStarted');
	document.dispatchEvent(evtn);
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

	initUI();
	runtimeModules.time.start();
	fadeInBackgroundMusic();
	applyVisualPreferenceOverrides();
	runtimeModules.idle.start();
	runtimeModules.boot.start();
}

let battery, batteryWarned = false;
let batteryInitialized = false;
const batteryDiv = document.getElementById('battery-div');
const batteryBar = document.getElementById('battery-bar');
const batteryText = document.getElementById('battery-text');
async function updateBattery() {
	if (!('getBattery' in navigator)) {
		battery = {};
		return battery;
	}

	if (!batteryInitialized) {
		battery = await navigator.getBattery();
		battery.lowBatteryThresh = 0.25;
		battery.addEventListener('chargingchange', function () {
			if (!battery.charging && battery.level <= battery.lowBatteryThresh) {
				notify('Battery low!', `Battery is at ${decimalToPercentage(battery.level)}%, please reconnect the charger!`);
			}
		});
		batteryInitialized = true;
	}

	battery.hasBattery = !(
		battery.level === 1 &&
		battery.charging === true &&
		battery.dischargingTime === Infinity ||
		!('onlevelchange' in battery)
	);

	// hide battery indicator if device likely has no battery
	batteryDiv.style.display = battery.hasBattery ? 'flex' : 'none';

	const batteryPercent = decimalToTruncPercentage(battery.level);
	batteryBar.style.width = `${batteryPercent}%`;
	batteryText.textContent = `${batteryPercent}%${battery.charging ? ' 🗲' : ''}`;

	if (battery.level >= 0.75)
		batteryBar.style.backgroundColor = '#0f0';
	else if (battery.level > 0.5)
		batteryBar.style.backgroundColor = '#8f0';
	else if (battery.level > 0.5 - battery.lowBatteryThresh / 2)
		batteryBar.style.backgroundColor = '#ff0';
	else if (battery.level > battery.lowBatteryThresh)
		batteryBar.style.backgroundColor = '#fa0';
	else if (battery.level <= battery.lowBatteryThresh)
		batteryBar.style.backgroundColor = '#f00';

	if (battery.charging)
		batteryBar.style.backgroundColor = '#2f2';

	requestAnimationFrame(updateBattery);

	return battery;
}

const darkenOverlay = document.getElementById('darken');

async function updateLoop(timestamp) {
	const now = Date.now();
	const inactivityMs = now - lastActivity;

	if (inactivityMs > 60e3 * 1.5) {
		ui.classList.add('inactive');
	} else {
		const suboptions = document.getElementById(`ui-content${selectedOption}`).querySelectorAll('.ui-suboption');
		if (inactivityMs > 9e3) {
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

	const spaghettiDensity = parseInt(localStorage.spaghettiDensity);
	if (inactivityMs < 10 * 60e3) {
		density = spaghettiDensity;
		darkenOverlay.style.opacity = '';
	} else if (inactivityMs < 30 * 60e3) {
		if (spaghettiDensity > 50) density = 50;
		darkenOverlay.style.opacity = '25%';
	} else {
		if (spaghettiDensity > 30) density = 30;
		darkenOverlay.style.opacity = '90%';
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

const runtimeModules = {
	time: {
		started: false,
		start() {
			if (this.started) return;
			this.started = true;
			startTimeRuntime();
		}
	},
	battery: {
		started: false,
		start() {
			if (this.started) return;
			this.started = true;
			updateBattery();
		}
	},
	idle: {
		started: false,
		start() {
			if (this.started) return;
			this.started = true;
			document.addEventListener('keydown', handleInput);
			document.addEventListener('keyup', handleInput);
			updateLoop();
		}
	},
	boot: {
		started: false,
		start() {
			if (this.started) return;
			this.started = true;
			startBootRuntime();
		}
	}
};
runtimeModules.battery.start();
