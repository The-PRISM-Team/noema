function test(mode) {
    if (mode === 0) {
        try {
            $;
        } catch {
            errors++;
            errorList.push("Essential Resource (jQuery) missing.");
        }
        try {
            Color;
        } catch {
            errors++;
            errorList.push("Essential Resource (Color.js) missing.");
        }
        try {
            init;
        } catch {
            errors++;
            errorList.push("Essential Resource (Initiator) missing.");
        }
        try {
            changeBGColor;
        } catch {
            errors++;
            errorList.push("Essential Resource (Background handler) missing.");
        }
    }
}

let started = false;
let starting = false;
function startup() {
    delete localStorage.fromreboot;

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
        changeBGColor(null, 1, "#000", "#000");
        let snd = new Audio('./coldboot.flac');
        snd.addEventListener('canplaythrough', function () {
            snd.play();

            changeBGColor(null, .1, "#aaa", "#888");
            setTimeout(() => {
                document.getElementById('startup-logo').style.opacity = '100%';
                setTimeout(() => {
                    changeBGColor(null, .05, "#00f", "#000");
                    fadeSpaghettiIn();
                    document.getElementById('startup-logo').style.transform = "translate(-50%, -50%)";
                    document.getElementById('startup-logo').style.transition = 'opacity 1s ease, height 1s ease, transform 1s ease';
                    document.getElementById('startup-logo').style.height = "25vh";
                    favicon.href = './noema_logo_black.png';
                    setTimeout(() => {
                        changeBGColor(null, .05, "#000", "#f0f");
                        document.getElementById('startup-text').style.textShadow = "0px 0px 15px #000";
                        document.getElementById('startup-text').style.opacity = "100%";
                        favicon.href = './noema_logo_white.png';
                        setTimeout(() => {
                            document.getElementById('startup-text').style.top = "65vh";
                            document.getElementById('startup-text').style.textShadow = "0px 0px 50px #fff";
                            changeBGColor(null, .05, "#00f", "#f0f");
                            favicon.href = './noema_logo_color.png';
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
        }, false);
    }, localStorage.fromreboot ? .5e3 : 2e3);
}

function reboot() {
    localStorage.fromreboot = 'true';
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