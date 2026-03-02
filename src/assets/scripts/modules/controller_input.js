class controllerHandler extends EventTarget {
    constructor() {
        super();
    }

    triggerEvent(eventName, data) {
        const event = new CustomEvent(eventName, {
            detail: data
        });
        this.dispatchEvent(event);
    }

    gamepads = [];
}

const gamepadHandler = new controllerHandler();
const gamepads = gamepadHandler.gamepads;

window.addEventListener('gamepadconnected', (event)=>{
    gamepads.push(event.gamepad);
});
window.addEventListener('gamepaddisconnected', (event)=>{
    gamepads.splice(gamepads.indexOf(event.gamepad), 1);
});
