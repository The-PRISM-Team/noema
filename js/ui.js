let ui = document.getElementById('ui');

let transitioning = false;
async function transition() {
    if (transitioning) throw new Error("Transition already in progress!");
    transitioning = true; // congrats!! :kekw:
    ui.style.width = "0px";
    ui.style.height = "50vh";
    setTimeout(() => {
        ui.style.width = "";
        ui.style.height = "";
        transitioning = false;
    }, 1.5e3);
}

function focusUIOption(id) {
    let optionDiv = document.getElementById('ui-options');

    requestAnimationFrame(() => {
        // alignment
        let target = document.getElementById(`ui-option${id}`);
        let targetRect = target.getBoundingClientRect();

        let uiRect = document.getElementById('ui').getBoundingClientRect();

        let targetCenter = targetRect.left + targetRect.width / 2;
        let desiredCenter = uiRect.left + uiRect.width / 2;

        let delta = desiredCenter - targetCenter;

        optionDiv.style.left = `${optionDiv.offsetLeft + delta}px`;

        // more-arrow shit
        let optionDivRect = optionDiv.getBoundingClientRect();

        let leftArrow = document.getElementById('more-left');
        let rightArrow = document.getElementById('more-right');

        if (optionDivRect.left < uiRect.left)
            leftArrow.style.opacity = "100%";
        else
            leftArrow.style.opacity = "0%";

        if (optionDivRect.right > uiRect.right)
            rightArrow.style.opacity = "100%";
        else
            rightArrow.style.opacity = "0%";
    });
}

let selectedOption = 0;
let selectedSuboption = 0;
let selectedSuboptions = {};
function selectUIOption(id) {
    let optionDiv = document.getElementById('ui-options');
    let options = optionDiv.querySelectorAll('a');
    let contents = document.getElementById('ui-contents').querySelectorAll('div');

    document.getElementById('more-left').style.opacity = "0%";
    document.getElementById('more-right').style.opacity = "0%";
    requestAnimationFrame(() => {
        options.forEach(option => option.classList.remove('selected'));
        contents.forEach(content => content.classList.remove('selected'));

        if (id === 0)
            document.getElementById('more-left').style.opacity = "0%";
        if (id === options.length - 1)
            document.getElementById('more-right').style.opacity = "0%";

        document.getElementById(`ui-content${id}`).style.display = 'revert';
        requestAnimationFrame(() => {
            document.getElementById(`ui-content${id}`).classList.add('selected');
        });
        document.getElementById(`ui-option${id}`).classList.add('selected');
        if (isNaN(selectedSuboptions[id]) || !selectedSuboptions[id]) {
            selectedSuboptions[id] = 0;
        }
        focusUIOption(id);
        if (prismflakesStarted) {
        }
    });

    selectedOption = id;
    selectUISuboption(selectedSuboptions[id]);
}
function selectUISuboption(id) {
    requestAnimationFrame(() => {
        selectedSuboption = id;
        let suboptions = document.getElementById(`ui-content${selectedOption}`).querySelectorAll('.ui-suboption');
        selectedSuboptions[selectedOption] = id;
        suboptions.forEach((suboption, i) => {
            suboption.style.top = `${20 + (-31 * (id - 3))}px`;
            let icon = suboption.querySelector('.ui-suboption-icon');
            if (i === id) {
                suboption.classList.add('selected');
                suboption.querySelector('.ui-suboption-text').style.display = '';
            } else {
                suboption.classList.remove('selected');
                suboption.querySelector('.ui-suboption-text').style.display = 'none';
                if (isDefined(icon))
                    icon.classList.remove('selected');
            }
            traverseDOM(suboption, (el) => {
                if (suboption.classList.contains('selected'))
                    el.classList.add('selected');
                else
                    el.classList.remove('selected');
            });
        });
    });
}
function executeUISuboption() {
    let suboption = document.getElementById(`ui-content${selectedOption}`).querySelector(`#ui-suboption${selectedSuboption}`);
    if (isDefined(suboption.dataset.execute)) {
        new Function(suboption.dataset.execute)();
        if (isDefined(suboption.dataset.sound))
            new Audio(`./sounds/${suboption.dataset.sound}.flac`).play();
        else
            new Audio('./sounds/confirm.flac').play();
    }
}


// mommy pls fix
function createOption(name) {
    let uiOptions = document.getElementById('ui-options');
    let uiSuboptions = document.getElementById('ui-contents');
    let tab = document.createElement('a');
    tab.id = 'ui-option' + uiOptions.children.length;
    tab.className = 'ui-option';
    tab.innerText = name;
    uiOptions.appendChild(tab);
    let suboptions = document.createElement('div');
    suboptions.id = 'ui-content' + uiSuboptions.children.length;
    suboptions.className = 'ui-content';
    uiSuboptions.appendChild(suboptions);
    if (localStorage.noTransitions === 'true') {
        tab.style.transition = 'none';
        suboptions.style.transition = 'none';
    }
    return uiOptions.children.length - 1;
}
function createSuboption(optionId, title, desc = '', exec = null, icon, sound = "confirm") {
    if ((!optionId && optionId !== 0) || !title) throw new Error('Please specify a valid option ID and title.');
    let suboptions = document.getElementById(`ui-content${optionId}`);
    let suboption = document.createElement('div');
    suboption.id = 'ui-suboption' + suboptions.children.length;
    suboption.className = 'ui-suboption';
    if (isDefined(exec)) suboption.dataset.execute = exec;
    if (isDefined(sound)) suboption.dataset.sound = sound;
    suboption.style.top = `${20 + (-31 * (selectedSuboptions[optionId] - 3))}px`;

    let suboptionTitle = document.createElement('a');
    suboptionTitle.className = 'ui-suboption-title';
    suboptionTitle.innerText = title;
    suboption.append(suboptionTitle);
    suboption.appendChild(document.createElement('br'));
    let suboptionDesc = document.createElement('a');
    suboptionDesc.className = 'ui-suboption-text';
    suboptionDesc.innerText = desc;
    suboptionDesc.style.display = 'none';
    suboption.append(suboptionDesc);
    if (isDefined(icon)) {
        let urltester = new RegExp("([a-zA-Z0-9]+:)//([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+");
        let suboptionIcon = document.createElement('img');
        if (urltester.test(icon)) {
            suboptionIcon.src = icon;
        } else {
            suboptionIcon.src = `./icons/${icon}.png`;
        }
        suboptionIcon.className = 'ui-suboption-icon';
        suboption.prepend(suboptionIcon);
    }
    if (localStorage.noTransitions === 'true') {
        suboption.style.transition = 'none';
    }
    
    suboptions.appendChild(suboption);
    return suboptions.children.length - 1;
}

function removeOption(optionId) {
    document.getElementById(`ui-option${optionId}`).remove();
    document.getElementById(`ui-content${optionId}`).remove();
    document.getElementById('ui-options').querySelectorAll('.ui-option').forEach((el, id)=>{
        el.id = `ui-option${id}`;
    });
    document.getElementById('ui-contents').querySelectorAll('.ui-content').forEach((el, id)=>{
        el.id = `ui-content${id}`;
    });
}
function removeSuboption(optionId, suboptionId) {
    document.getElementById(`ui-content${optionId}`).querySelector(`#ui-suboption${suboptionId}`).remove();
    
    document.getElementById(`ui-content${optionId}`).querySelectorAll('.ui-suboption').forEach((el, id)=>{
        el.id = `ui-suboption${id}`;
    });
}

function setOption(optionId, text) {
    document.getElementById(`ui-option${optionId}`).innerText = text;
}
function setSuboption(optionId, suboptionId, title, desc, icon, exec, sound) {
    let suboption = document.getElementById(`ui-content${optionId}`).querySelector(`#ui-suboption${suboptionId}`);
    if (isDefined(title)) suboption.querySelector('.ui-suboption-title').innerText = title;
    if (isDefined(desc)) suboption.querySelector('.ui-suboption-text').innerText = desc;
    if (isDefined(icon)) suboption.querySelector('.ui-suboption-icon').src = `./icons/${icon}.png`;
    if (isDefined(exec)) suboption.dataset.execute = exec;
    if (isDefined(sound)) suboption.dataset.sound = sound;
}

function getOption(optionId) {
    return {
        label: document.getElementById(`ui-option${optionId}`).textContent,
        element: document.getElementById(`ui-option${optionId}`)
    };
}
function getSuboption(optionId, suboptionId) {
    let suboption = document.getElementById(`ui-content${optionId}`).querySelector(`#ui-suboption${suboptionId}`);
    return {
        title: suboption.querySelector('.ui-suboption-title').textContent,
        description: suboption.querySelector('.ui-suboption-text')?.textContent,
        icon: suboption.querySelector('.ui-suboption-icon').src.trimEnd('.png'),
        element: suboption
    };
}

function bandDialog(title, subtitle = '', setupFunc, confirmFunc, usesEnterKey = true) {
    document.getElementById('custom-title').textContent = title;
    document.getElementById('custom-items').innerHTML = '';
    document.getElementById('custom-items').style.cssText = '';

    if (!isDefined(setupFunc)) {
        document.getElementById('custom-items').style.display = 'none';
    } else {
        document.getElementById('custom-items').style.display = 'revert';
        setupFunc(document.getElementById('custom-items'));
    }
    if (!isDefined(confirmFunc)) confirmFunc = ()=>{};
    document.getElementById('custom-subtitle').style.display = 'none';

    if (isDefined(subtitle)) {
        if (subtitle.replace(/\s/g, '').length > 0) {
            document.getElementById('custom-subtitle').style.display = 'revert';
            document.getElementById('custom-subtitle-text').textContent = subtitle;
        }
    }
    let hasInput = false;
    traverseDOM(document.getElementById('custom-dialog'), (el) => {
        if (el.tagName === 'INPUT') {
            if (
                el.type === 'text' ||
                el.type === 'email' ||
                el.type === 'password' ||
                el.type === 'search' ||
                el.type === 'tel' ||
                el.type === 'url'
            ) {
                hasInput = true;
            } else if (el.type === 'checkbox') {
                usesEnterKey = false;
            }
        } else if (el.tagName === 'TEXTAREA') {
            hasInput = true;
        }
    });
    if (lastInput === 'gamepad') {
        if (usesEnterKey) {
            document.getElementById('custom-controls').textContent = "Press ✕/Ⓐ to confirm, and ⭘/Ⓑ to cancel.";
        } else {
            document.getElementById('custom-controls').textContent = "Press ⭘/Ⓑ to exit.";
        }
    } else {
        if (usesEnterKey) {
            if (hasInput) {
                document.getElementById('custom-controls').textContent = "Press Enter to confirm, and Escape to cancel.";
            } else {
                document.getElementById('custom-controls').textContent = "Press Enter or Space to confirm, and Escape to cancel.";
            }
        } else {
            document.getElementById('custom-controls').textContent = "Press Escape to exit.";
        }
    }

    let handler = (event) => {
        const key = event.key.toLowerCase();
        function blur() {
            traverseDOM(document.getElementById('custom-dialog'), (el)=>{
                if (document.activeElement === el) {
                    el.onblur = null;
                    requestAnimationFrame(()=>{
                        el.blur();
                    });
                }
            });
        }
        if ((key === 'enter' || (key === ' ' && !hasInput))&& usesEnterKey) {
            if (usesEnterKey) {
                confirmFunc();
                new Audio('./sounds/confirm.flac').play();
            }
            blur();
            document.getElementById('custom-dialog').style.opacity = '0';
            document.removeEventListener('keyup', handler);
        } else if (key === 'escape') {
            new Audio('./sounds/back.flac').play();
            blur();
            document.getElementById('custom-dialog').style.opacity = '0';
            document.removeEventListener('keyup', handler);
        }
    };
    document.getElementById('custom-dialog').style.opacity = '100%';
    document.addEventListener('keyup', handler);
}
function inputDialog(title = 'Select a value...', subtitle, startingValue, min, max, step = 1, formatStr, updFunc = ()=>{}) {
    if (!formatStr && typeof formatStr !== 'string') console.warn('formatStr (7th argument): Every instance of the substring "{value}" will be replaced with the slider\'s current value.\nSet this parameter to an empty string to avoid this warning.');
    bandDialog(title, subtitle, (dialog) => {
        let slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min.toString();
        slider.max = max.toString();
        slider.step = step.toString();
        slider.value = startingValue.toString();
        dialog.appendChild(slider);
        let slidertext = document.createElement('a');
        slidertext.textContent = ` ${formatStr.replaceAll("{value}", slider.value.toString())}`;
        slidertext.style.color = '#fff';
        slidertext.style.fontFamily = "'Manrope', monospace";
        dialog.appendChild(slidertext);
        let handler = () => {
            updFunc(slider.value);
            slidertext.textContent = ` ${formatStr.replaceAll("{value}", slider.value.toString())}`;
        };
        slider.addEventListener('input', handler);
        slider.onblur = () => slider.removeEventListener('input', handler);

        dialog.appendChild(document.createElement('br'));
        slider.focus();
        slider.onblur = slider.focus;
        slider.style.outline = '0';
    }, null, false);
}
function confirmDialog(func = () => {}, title = 'Are you sure?', subtitle = '') {
    bandDialog(title, subtitle, null, func, true);
}
function promptDialog(func = (() => { }), title = 'Enter some text...', placeholder = '') {
    bandDialog(title, '', (dialog)=>{
        let input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholder;
        input.id = 'custom-input';
        input.onblur = ()=>input.focus();

        dialog.appendChild(input);
        input.focus();
        input.style.outline = `solid 1px ${accentColor}`;
        input.style.boxShadow = `0px 0px 7px ${accentColor}`;
        input.style.borderRadius = `10px`;
    }, ()=>{
        func(document.getElementById('custom-input').value);
    }, true);
}
function checkboxDialog(title, subtitle, label, toggleFunc = ()=>{}) {
    bandDialog(title, subtitle, (dialog) => {
        let text = document.createElement('a');
        text.textContent = `${label} `;
        text.style.cssText = "color: #fff; font-family: 'Manrope', monospace";

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.onblur = () => checkbox.focus();
        checkbox.addEventListener('input', () => {
            toggleFunc(checkbox.checked);
        });

        dialog.appendChild(text);
        dialog.appendChild(checkbox);
        dialog.appendChild(document.createElement('br'));
        dialog.appendChild(document.createElement('br'));

        checkbox.focus();
    }, null, true);
}
let __notifElements = {};
let __queuedNotifs = [];
function notify(title, text, icon) {
    let notifDiv = document.createElement('span');
    notifDiv.className = 'notif';
    notifDiv.id = `notif-${Math.random()}`;
    function notifHandler() {
        if (localStorage.noShaders === 'true') notifDiv.style.backdropFilter = 'none';
        if (localStorage.noTransitions === 'true') notifDiv.style.transition = 'none';
        document.getElementById('notif-div').appendChild(notifDiv);
        
        let notifContent = document.createElement('span');
        notifContent.style.padding = '5px';
        notifDiv.appendChild(notifContent);

        let notifTitle = document.createElement('a');
        notifTitle.textContent = title;
        notifTitle.className = 'notif-title';
        notifContent.appendChild(notifTitle);

        if (isDefined(text)) {
            notifContent.appendChild(document.createElement('br'));
            let notifText = document.createElement('a');
            notifText.textContent = text;
            notifText.className = "notif-text";
            notifContent.appendChild(notifText);
        }

        if (isDefined(icon)) {
            let notifIcon = document.createElement('img');
            notifIcon.src = `./icons/${icon}.png`;
            notifIcon.className = "notif-icon";
            notifDiv.appendChild(notifIcon);
        }

        let snd = new Audio('./sounds/notif.flac');
        snd.volume = 0.5;
        snd.preservesPitch = false;
        snd.playbackRate = 1 + Object.keys(__notifElements).length / 25;
        snd.play();

        __notifElements[notifDiv.id] = notifDiv;
        requestAnimationFrame(()=>{
            notifDiv.style.transform = 'translateX(1px)';
            notifDiv.style.opacity = '100%';
        });
        setTimeout(()=>{
            notifDiv.style.transform = 'translateX(100%)';
            notifDiv.style.opacity = '0';
            delete __notifElements[notifDiv.id];
            setTimeout(()=>{notifDiv.remove();}, .25e3);
        },10e3);
    }
    if ((Object.keys(__notifElements).length >= 6) || !started || !document.hasFocus()) {
        if (__queuedNotifs.length < 24) {
            __queuedNotifs.push(notifDiv.id);
            setInterval(() => {
                if ((Object.keys(__notifElements).length < 6) && started && document.hasFocus()) {
                    if (__queuedNotifs[0] === notifDiv.id) {
                        __queuedNotifs.shift();
                        notifHandler();
                    }
                }
            }, 100);
        } else {
            console.error("Too many notifications are queued up!");
            return;
        }
    } else {
        notifHandler();
    }
    
}

let keyPressed = null;
let pressedTime = null;
let lastActivity = Date.now();
function handleInput(event, keyup) {
    if (!started) return;
    if (event.repeat) {
        if (Date.now() - lastActivity < 75) {
            return;
        }
    } else {
        if (Date.now() - lastActivity < 50) {
            return;
        }
    }
    lastActivity = Date.now();
    function left() {
        if (document.getElementById(`ui-options`).querySelectorAll('.ui-option').length < 2) return;
        if (keyup) return;
        if (selectedOption <= 0) {
            if (event.repeat) return;
            selectedOption = document.getElementById('ui-options').querySelectorAll('a').length - 1;
        }
        else
            selectedOption--;
        selectUIOption(selectedOption);
        new Audio('./sounds/select.flac').play();
    }
    function right() {
        if (document.getElementById(`ui-options`).querySelectorAll('.ui-option').length < 2) return;
        if (keyup) return;
        if (selectedOption >= document.getElementById('ui-options').querySelectorAll('a').length - 1) {
            if (event.repeat) return;
            selectedOption = 0;
        }
        else
            selectedOption++;
        selectUIOption(selectedOption);
        new Audio('./sounds/select.flac').play();
    }
    function up() {
        if (document.getElementById(`ui-content${selectedOption}`).querySelectorAll('.ui-suboption').length < 2) return;
        if (keyup) return;
        if (selectedSuboption <= 0) {
            if (event.repeat) return;
            else
                selectUISuboption(document.getElementById(`ui-content${selectedOption}`).querySelectorAll('.ui-suboption').length - 1);
    
            new Audio('./sounds/select.flac').play();
            return;
        }

        selectedSuboption--;
        selectUISuboption(selectedSuboption);
        new Audio('./sounds/select.flac').play();
    }
    function down() {
        if (document.getElementById(`ui-content${selectedOption}`).querySelectorAll('.ui-suboption').length < 2) return;
        if (keyup) return;
        if (selectedSuboption >= document.getElementById(`ui-content${selectedOption}`).querySelectorAll('.ui-suboption').length - 1) {
            if (event.repeat) return;
            else
                selectUISuboption(0);

            new Audio('./sounds/select.flac').play();
            return;
        }

        selectedSuboption++;
        selectUISuboption(selectedSuboption);
        new Audio('./sounds/select.flac').play();
    }
    function back() {
        if (!keyup) return;
        let playSound = false;
        document.activeElement.blur();
        document.body.querySelectorAll('.band-dialog').forEach(dialog => {
            if (window.getComputedStyle(dialog).opacity !== '0') {
                dialog.style.opacity = "0%";
                playSound = true;
            }
        });
        if (playSound) new Audio('./sounds/back.flac').play();
        return;
    }


    if (event.isTrusted) {
        lastInput = 'keyboard';
    }
    let key = event.key.toLowerCase();
    // console.log('key press:', key)

    // input handler, make it JSON later
    /*if (key === 'escape') {
        if (!event.repeat)
            back()
    }*/
    let outOfMenu = false;
    document.body.querySelectorAll('.band-dialog').forEach(dialog => {
        if (window.getComputedStyle(dialog).opacity !== '0')
            outOfMenu = true;
    });
    if (outOfMenu) {
        if ((key === 'a' || key === 'arrowleft') && !keyup) {
            if (document.activeElement.tagName === 'INPUT' && document.activeElement?.type === 'range') {
                event.preventDefault();
                if (parseFloat(document.activeElement.value) > parseFloat(document.activeElement.min)) {
                    document.activeElement.value = parseFloat(document.activeElement.value) - parseFloat(document.activeElement.step || '1') * (event.shiftKey ? 10 : 1);

                    const evtn = new Event('input', { bubbles: true });
                    document.activeElement.dispatchEvent(evtn);
                    const evtn2 = new Event('change', { bubbles: true });
                    document.activeElement.dispatchEvent(evtn2);
                }
            }
        }
        if ((key === 'd' || key === 'arrowright') && !keyup) {
            if (document.activeElement.tagName === 'INPUT' && document.activeElement?.type === 'range') {
                event.preventDefault();
                if (parseFloat(document.activeElement.value) < parseFloat(document.activeElement.max)) {
                    document.activeElement.value = parseFloat(document.activeElement.value) + parseFloat(document.activeElement.step || '1') * (event.shiftKey ? 10 : 1);

                    const evtn = new Event('input', { bubbles: true });
                    document.activeElement.dispatchEvent(evtn);
                    const evtn2 = new Event('change', { bubbles: true });
                    document.activeElement.dispatchEvent(evtn2);
                }
            }
        }
        if ((key === 'enter' || key === ' ') && !keyup) {
            if (document.activeElement.tagName === 'INPUT' && document.activeElement?.type === 'checkbox') {
                event.preventDefault();
                document.activeElement.checked = !document.activeElement.checked;

                const evtn = new Event('input', { bubbles: true });
                document.activeElement.dispatchEvent(evtn);
                const evtn2 = new Event('change', { bubbles: true });
                document.activeElement.dispatchEvent(evtn2);
            }
        }
    } else {
        if (key === 'a' || key === 'arrowleft') {
            left();
        }
        if (key === 'd' || key === 'arrowright') {
            right();
        }
        if (key === 'w' || key === 'arrowup') {
            up();
        }
        if (key === 's' || key === 'arrowdown') {
            down();
        }
        if (key === 'enter' || key === ' ') {
            if (!event.repeat && keyup)
                executeUISuboption();
        }
        if (key === 'control') {
            if (!keyup && selectedOption !== 0) {
                selectUIOption(0);
                new Audio('./sounds/select.flac').play();
            }
        }
        if (key === 'alt') {
            if (!keyup && selectedOption !== document.getElementById('ui-options').children.length - 1) {
                selectUIOption(document.getElementById('ui-options').children.length - 1);
                new Audio('./sounds/select.flac').play();
            }
        }
    }
}