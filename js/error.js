let errors = 0;
let errorList = [];
window.addEventListener("error", (event) => {
    if (event.target && event.target.tagName === "SCRIPT") {
        errorList.push(`Failed to load script: ${event.target.src}`);
    } else {
        errorList.push(`${event.message}`);
    }
    const source = event.filename || '';
    document.body.querySelectorAll('.preloaded').forEach(script => {
        if (script.src === source) {
            notify('An internal core error occured.', `Error message: ${event.message}\nPlease report this to PRISM as soon as possible.\nYou can export the runtime log by going to the "Help" tab and selecting "Export Log".`, 'warning');
        }
    });
    document.body.querySelectorAll('.mod').forEach(script => {
        if (script.src === source) {
            notify(`Platform error caused by mod (${source}).`, `Error message: ${event.message}\nIf possible, report this to the mod creator.`, 'warning');
        }
    });
    document.body.querySelectorAll('.game').forEach(script => {
        if (script.src === source) {
            notify(`An error occured while running the game (${source}).`, `Error message: ${event.message}\nIf possible, report this to the game developer(s).`, 'warning');
        }
    });
    if (!started) {
        let errorSound = new Audio('./sounds/fatal-error.flac');
        let errorSound2 = new Audio('./sounds/fatal-error.flac');
        errorSound.preload = true;
        errorSound2.preload = true;
        let bgint1 =
        setInterval(()=>{
            document.body.style.background = "#f00";
            errorSound.play();
        },1e3);
        let bgint2;
        setTimeout(()=>{
            bgint2 = setInterval(() => {
                errorSound2.play();
                document.body.style.background = "#f00";
            }, 1e3);
        },.5e3);
        let bgint3;
        setTimeout(()=>{
            bgint3 = setInterval(() => {
                document.body.style.background = "#000";
            }, .5e3);
        }, .25e3);
        setTimeout(()=>{
            clearInterval(bgint1);
            clearInterval(bgint2);
            clearInterval(bgint3);
            setTimeout(() => {
                document.body.style.background = "#800";
                let warning = document.createElement('a');
                warning.textContent = "STARTUP FAILED";
                warning.style.zIndex = "calc(infinity)";
                warning.style.opacity = "0%";
                warning.style.display = "flex";
                warning.style.justifyContent = "center";
                warning.style.alignContent = "center";
                warning.style.width = "100vw";
                warning.style.height = "100vh";
                warning.style.backgroundColor = "#0008";
                warning.style.backdropFilter = "blur(50px) darken(75%) opacity(90%)";
                warning.style.fontFamily = "'Manrope', monospace";
                warning.style.fontSize = '4vw';
                warning.style.fontWeight = 'light';
                warning.style.color = '#fff';
                warning.style.position = "fixed";
                warning.style.top = "0";
                warning.style.left = "0";
                warning.style.transition = "opacity .5s ease-out";
                document.body.appendChild(warning);
                warning.style.opacity = "100%";
                setTimeout(()=>{
                    if (errorList.length > 0) {
                        warning.textContent = `Error(s):\n${errorList.join('\n')}`;
                    } else {
                        warning.textContent = `Error(s): Unknown`;
                    }
                }, 1.5e3);
                setTimeout(()=>{
                    let time = 5;
                    setInterval(() => {
                        warning.textContent = `Restarting in ${time}${('.').repeat(time)}`;
                        if (time <= 0)
                            window.location.reload();
                        time--;
                    }, 1e3);
                }, 5e3);
            },1e3);
        },2e3);
    } else {
        new Audio('./sounds/error.flac').play();
    }
    if (started) errors++;
    document.getElementById('errors').style.transition = '';
    document.getElementById('errors').style.color = '#f66';
    setTimeout(() => {
        document.getElementById('errors').style.transition = 'color 1s linear';
        document.getElementById('errors').style.color = '#fff';
    });
    document.getElementById('errors').innerText = `Errors: ${errors}`;
}, true);