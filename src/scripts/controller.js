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
	}
}
let currentControllerMapping = 'ui';
function changeControllerMapping(mapping) {
	if (!(mapping in controllerMaps)) throw new Error(`The controller mapping "${mapping}" does not exist.`);
}
// input handling
gameControl.on('connect', gamepad => {
	connectedGamepads = navigator.getGamepads().filter(g=>g);
	controllerConnected = true;
	const pressed = {};
	const mapping = controllerMaps[currentControllerMapping];
	JSON.iterate(mapping, (button, key)=>{
		pressed[button] = false;
		console.log(button);
		let pressedOn = 0;
		let lastRepeat = 0;
		gamepad
		.on(button, () => {
			if (Date.now() - pressedOn < .5e3) return;
			if (Date.now() - lastRepeat < 100) return;
			lastRepeat = Date.now();
			document.dispatchEvent(new KeyboardEvent('keydown', {
				repeat: true,
				shiftKey: pressed.button3,
				key: key,
				bubbles: true
			}));
			lastInput = 'gamepad';
		})
		.before(button, () => {
			console.log(button, 'pressed');
			pressed[button] = true;

			document.dispatchEvent(new KeyboardEvent('keydown', {
				repeat: false,
				shiftKey: pressed.button3,
				key: key,
				bubbles: true
			}));
			lastInput = 'gamepad';
			pressedOn = Date.now();
		})
		.after(button, () => {
			pressed[button] = false;
			console.log(button, 'released');

			document.dispatchEvent(new KeyboardEvent('keyup', {
				key: key,
				bubbles: true
			}));
			lastInput = 'gamepad';
		});
	});
});
gameControl.on('disconnect', ()=>{
	connectedGamepads = navigator.getGamepads().filter(g=>g);
	if (navigator.getGamepads().length < 1) controllerConnected = false;
});

// APIs
function hapticFeedback(strength = 1, duration = 100) {
	const gamepads = navigator.getGamepads();
	for (let gp of gamepads) {
		if (gp && gp.vibrationActuator) {
			gp.vibrationActuator.playEffect('dual-rumble', {
				startDelay: 0,
				duration: duration,
				weakMagnitude: strength,
				strongMagnitude: strength
			});
		}
	}
}