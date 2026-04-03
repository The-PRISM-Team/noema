let controllerConnected = false;
let lastInput = 'keyboard';
let connectedGamepads = [];
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
let currentControllerMapping = 'default';
function changeControllerMapping(mapping) {
	if (!(mapping in controllerMaps)) throw new Error(`The controller mapping "${mapping}" does not exist.`);
	
}
gameControl.on('connect', gamepad => {
	connectedGamepads = navigator.getGamepads().filter(g=>g);
	controllerConnected = true;
	const pressed = {};
	const mapping = controllerMaps[currentControllerMap];
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