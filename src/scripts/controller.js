// helpers
let controllerConnected = false;
let lastInput = 'keyboard';
let connectedGamepads = [];
// controller maps
const controllerMaps = {
	"ui": {
		'button0': 'Enter',
		'button1': 'Escape',
		'button3': 'Shift',
		'button14': 'ArrowLeft',
		'button15': 'ArrowRight',
		'button12': 'ArrowUp',
		'button13': 'ArrowDown',
		'left0': 'ArrowLeft',
		'right0': 'ArrowRight',
		'up0': 'ArrowUp',
		'down0': 'ArrowDown',
		'button4': 'q',
		'button5': 'e',
	},
	"default": {
		'button0': ' ',
		'button1': 'Escape',
		'left0': 'ArrowLeft',
		'right0': 'ArrowRight',
		'up0': 'ArrowUp',
		'down0': 'ArrowDown',
		'button14': 'ArrowLeft',
		'button15': 'ArrowRight',
		'button12': 'ArrowUp',
		'button13': 'ArrowDown'
	}
}
let currentControllerMapping = 'ui';
function changeControllerMapping(mapping) {
	if (!(mapping in controllerMaps)) throw new Error(`The controller mapping "${mapping}" does not exist.`);
	currentControllerMapping = mapping;
}
// input handling
gameControl.on('connect', gamepad => {
	connectedGamepads = navigator.getGamepads().filter(g=>g);
	controllerConnected = true;
	const pressed = {};
	for (let i = 0; i <= 16; i++) {
		// register buttons
		const button = 'button' + i;
		let pressedOn = 0;
		let lastRepeat = 0;
		pressed[button] = false;
		gamepad
		.on(button, () => {
			// repeat
			if (Date.now() - pressedOn < .5e3) return;
			if (Date.now() - lastRepeat < 100) return;
			const mapping = controllerMaps[currentControllerMapping];
			if (!mapping[button]) return;
			lastRepeat = Date.now();
			document.dispatchEvent(new KeyboardEvent('keydown', {
				repeat: true,
				shiftKey: pressed.button3,
				key: mapping[button],
				bubbles: true
			}));
			lastInput = 'gamepad';
		})
		.before(button, () => {
			// pressed
			const mapping = controllerMaps[currentControllerMapping];
			if (!mapping[button]) return;
			pressed[button] = true;

			document.dispatchEvent(new KeyboardEvent('keydown', {
				repeat: false,
				shiftKey: pressed.button3,
				key: mapping[button],
				bubbles: true
			}));
			lastInput = 'gamepad';
			pressedOn = Date.now();
		})
		.after(button, () => {
			// released
			const mapping = controllerMaps[currentControllerMapping];
			if (!mapping[button]) return;
			pressed[button] = false;

			document.dispatchEvent(new KeyboardEvent('keyup', {
				key: mapping[button],
				bubbles: true
			}));
			lastInput = 'gamepad';
		});
	}
});
gameControl.on('disconnect', ()=>{
	connectedGamepads = navigator.getGamepads().filter(g=>g);
	if (navigator.getGamepads().length < 1) controllerConnected = false;
});

// APIs
function hapticFeedback(strength = 1, duration = 100) {
	let strengthModifier = parseFloat(localStorage.hapticStrength);
	const gamepads = navigator.getGamepads();
	for (let gp of gamepads) {
		if (gp && gp.vibrationActuator) {
			gp.vibrationActuator.playEffect('dual-rumble', {
				startDelay: 0,
				duration: duration,
				weakMagnitude: strength*strengthModifier,
				strongMagnitude: strength*strengthModifier
			});
		}
	}
}