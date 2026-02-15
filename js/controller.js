let controllerConnected = false;
let lastInput = 'keyboard';
gameControl.on('connect', (gamepad) => {
    controllerConnected = true;
    const mapping = {
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
        'button4': 'Control',
        'button5': 'Alt',
    };
    let pressed = {};
    JSON.iterate(mapping, (button, key)=>{
        pressed[button] = false;
        console.log(button);
        let pressedOn = 0;
        let lastRepeat = 0;
        gamepad
        .on(button, () => {
            if (button === 'button3') return;
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

            if (button === 'button3') return;
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

            if (button === 'button3') return;
            document.dispatchEvent(new KeyboardEvent('keyup', {
                key: key,
                bubbles: true
            }));
            lastInput = 'gamepad';
        });
    });
});
gameControl.on('disconnect', ()=>{
    if (navigator.getGamepads().length < 1) controllerConnected = false;
});