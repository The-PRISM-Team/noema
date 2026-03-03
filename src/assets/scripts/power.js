function test(mode = 0) {
    if (mode === 0) {
        let errored = false;
        try {
            $;
        } catch {
            errors++;
            errorList.push("Essential Resource (jQuery) missing.");
            errored = true;
        }
        try {
            Color;
        } catch {
            errors++;
            errorList.push("Essential Resource (Color.js) missing.");
            errored = true;
        }
        try {
            init;
        } catch {
            errors++;
            errorList.push("Essential Resource (Initiator) missing.");
            errored = true;
        }
        try {
            changeBGColor;
        } catch {
            errors++;
            errorList.push("Essential Resource (Background handler) missing.");
            errored = true;
        }
        try {
            handleInput;
        } catch {
            errors++;
            errorList.push("Essential Resource (Input handler) missing.");
            errored = true;
        }
        try {
            handleInput;
        } catch {
            errors++;
            errorList.push("Essential Resource (Input handler) missing.");
            errored = true;
        }

        if (errored) throw new Error('Test failed');
        return 'Success!';
    }
}

let started = false;
let starting = false;
function startup() {
    const fastBoot = localStorage.fromreboot === 'true' || localStorage.fromRefresh === 'true';
    delete localStorage.fromreboot;
    delete localStorage.fromRefresh;
    delete localStorage.fastBoot;

    let startTime = Date.now();
    if (started || starting) return;
    starting = true;
    test();
    document.getElementById('clicktostart').style.opacity = '0%';
    let t = 0;
    function fadeSpaghettiIn() {
        if (t >= .5) return;
        spaghettiColor = `rgba(255, 255, 255, ${t})`;
        t += 0.01;
        requestAnimationFrame(fadeSpaghettiIn);
    }
    setTimeout(() => {
        changeBGColor({
            colorName: null,
            easing: 1,
            topColor: "#000",
            bottomColor: "#000"
        });
        let snd = new Audio('/assets/sounds/coldboot.flac');
        snd.volume = .65;

        const showStartupAudioFallback = () => {
            starting = false;
            setCursor('pointer');
            const clickToStart = document.getElementById('clicktostart');
            clickToStart.style.display = 'revert';
            clickToStart.style.opacity = '100%';
            clickToStart.innerHTML = localStorage.startup === 'true' ? 'click or press enter to start' : 'click or press enter to go to menu';

            const retryStartup = () => {
                document.onclick = document.onkeydown = null;
                startup();
            };
            document.onclick = retryStartup;
            document.onkeydown = (event) => {
                if (event.key.toLowerCase() === 'enter') retryStartup();
            };
        };

        const failStartupAudio = (error) => {
            console.warn('Coldboot sound failed to play.', error);
            showStartupAudioFallback();
        };

        const runStartupSequence = () => {
            changeBGColor({
                colorName: null,
                easing: .1,
                topColor: "#aaa",
                bottomColor: "#aaa"
            });
            setTimeout(() => {
                document.getElementById('startup-logo').style.opacity = '100%';
                setTimeout(() => {
                    changeBGColor({ colorName: null, easing: .1, topColor: "#00f", bottomColor: "#000"});
                    fadeSpaghettiIn();
                    document.getElementById('startup-logo').style.transform = "translate(-50%, -50%)";
                    document.getElementById('startup-logo').style.transition = 'opacity 1s ease, height 1s ease, transform 1s ease';
                    document.getElementById('startup-logo').style.height = "25vh";
                    favicon.href = '/assets/logos/noema/black.png';
                    setTimeout(() => {
                        changeBGColor({ colorName: null, easing: .1, topColor: "#000", bottomColor: "#f0f"});
                        document.getElementById('startup-text').style.textShadow = "0px 0px 15px #000";
                        document.getElementById('startup-text').style.opacity = "100%";
                        favicon.href = '/assets/logos/noema/white.png';
                        setTimeout(() => {
                            document.getElementById('startup-text').style.top = "65vh";
                            document.getElementById('startup-text').style.textShadow = "0px 0px 50px #fff";
                            changeBGColor({ colorName: null, easing: .1, topColor: "#00f", bottomColor: "#f0f"});
                            favicon.href = '/assets/logos/noema/color.png';
                            setTimeout(() => {
                                document.getElementById('startup-logo').style.opacity = "0%";
                                document.getElementById('startup-text').style.opacity = "0%";
                                starting = false;
                                init();
                                console.log(`Boot animation finished in ${Date.now() - startTime}ms.`);
                            }, 3.25e3);
                        }, 1.75e3);
                    }, 1.75e3);
                }, .5e3);
            }, .25e3);
        };

        snd.addEventListener('error', () => failStartupAudio(new Error('Coldboot sound failed to load.')), { once: true });
        snd.play().then(runStartupSequence).catch(failStartupAudio);
    }, fastBoot ? .5e3 : 2e3);
}

function reboot() {
    localStorage.fromreboot = 'true';
    localStorage.fromRefresh = 'true';
    for (let element of document.body.children) {
        element.style.display = 'none';
    }
    document.body.style.background = '#000';
    started = false;
    bgMusic.pause();
    setTimeout(()=>{
        window.location.reload();
    }, 1e3 / 25);
}
function fastReboot() {
    localStorage.fastBoot = 'true';
    reboot();
}

function shutdown() {
    for (let element of document.body.children) {
        element.style.display = 'none';
    }
    document.body.style.background = '#000';
    started = false;
    bgMusic.pause();
    setTimeout(()=>{
        window.close();
    }, 1e3 / 25);
}
