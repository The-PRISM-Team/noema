// SIX SEVEN! SIX SEVEN! SIX SEVEN! SIX SEVEN! SIX SEVEN! SIX SEVEN! SIX SEVEN! SIX SEVEN!
// 6767676767676767676767676767676767676767676767
function isDefined(value) {
    return value != null;
}

const isNode = typeof process !== 'undefined' && process.versions?.node;
if (isNode) {
    console.log("Node.js is not supported. Please use a browser.");
    process.exit(1);
}

// localstorage definitions go here because this is the best place i could find
// don't even try asking why
if (!isDefined(localStorage.startup)) localStorage.startup = 'true';
if (!isDefined(localStorage.pauseMusic)) localStorage.pauseMusic = 'true';
if (!isDefined(localStorage.skipChargingTests)) localStorage.skipChargingTests = 'true';
if (!isDefined(localStorage.musicVolume)) localStorage.musicVolume = '0.10';
if (!isDefined(localStorage.uiSoundVolume)) localStorage.uiSoundVolume = '0.5';
if (!isDefined(localStorage.noShaders) && navigator.deviceMemory < 4) localStorage.noShaders = 'true';
if (!isDefined(localStorage.noTransitions) && navigator.deviceMemory < 2) localStorage.noTransitions = 'true';



let pageStart = performance.now(),
    dependStart = null,
    soundStart = null;

// load page
document.body.style.cursor = 'wait';
console.log('Loading page...');
let bgMusic;
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('loading-progress').style.width = '1%';
    console.log(`Page loaded in ${(performance.now() - pageStart).toFixed(2)}ms.`);

    // load scripts
    console.log('Loading scripts...');
    document.getElementById('clicktostart').textContent = 'loading scripts, please wait';
    const scriptStart = performance.now();
    await loadScripts((done, total)=>{
        document.getElementById('loading-progress').style.width = `${Math.max(1, 1 + Math.round((done / total * 100) / 2) - 2)}%`;
    });

    console.log(`Scripts loaded in ${(performance.now() - scriptStart).toFixed(2)}ms.`);

    // load resources
    dependStart = performance.now();
    console.log('Loading resources...');
    document.getElementById('clicktostart').textContent = 'loading page resources, please wait';
    bgMusic = new Audio('/assets/sounds/menu_music.flac');
    bgMusic.preload = true;
});
window.addEventListener('load', async () => {
    document.getElementById('loading-progress').style.width = '100%';

    console.log(`Resources loaded in ${(performance.now() - dependStart).toFixed(2)}ms.`);
    document.getElementById('loading-progress').style.width = '50%';

    // load sounds
    console.log('Loading sounds...')
    document.getElementById('clicktostart').innerHTML = 'loading sounds, please wait';

    soundStart = performance.now();
    await soundWarmup((done, total) => {
        document.getElementById('loading-progress').style.width = `${50 + (Math.round(done / total * 100) / 2)}%`;
    });
    console.log(`Initialized sounds in ${(performance.now() - soundStart).toFixed(2)}ms.`);

    // done
    setCursor('default');
    document.getElementById('clicktostart').textContent = 'finished loading!';
    console.log(`Finished loading in ${(performance.now() - pageStart).toFixed(2)}ms!`);
    await delay(750);
    document.getElementById('loading-bar').style.opacity = '0%';
    document.getElementById('loading-progress').style.width = '0%';

    // test system
    setCursor('wait');
    if (typeof test !== 'undefined') {
        console.log('Testing system...');
        document.getElementById('clicktostart').innerHTML = 'testing system...';
        try {
            test();
        } catch {
            console.log('%cSystem test failed!!', 'background-color: #b00; border-radius: 5px 5px 5px 0px; padding: 2px; font-size: 15px;');
            document.getElementById('clicktostart').innerHTML = 'system test failed!! the page will refresh very soon.';
            delay(500);
            location.reload();
            return;
        }
        console.log('System test succeeded!');
    }
    // test battery
    if (localStorage.skipChargingTests !== 'true' && !(await navigator.getBattery())?.charging) {
        console.log('Testing battery...');
        document.getElementById('clicktostart').innerHTML = 'testing battery...';

        const dischargingRate = await dischargingTest(5);
        if (dischargingRate > 0) {
            console.log('%cBattery test failed!!', 'background-color: #b00; border-radius: 5px 5px 5px 0px; padding: 2px; font-size: 15px;');
            document.getElementById('clicktostart').innerHTML = 'battery test failed!!\ncheck up on your battery health before using Noema.';
            return;
        };
        console.log('Battery test succeeded!');
    }

    // get commit ID
    Object.defineProperty(globalThis, "commitId", {
        value: (
            await fetchJson('https://api.github.com/repos/sophb-ccjt/noema/commits?per_page=1&sha=main')
        )[0].sha,
        writable: false,
        configurable: false,
    });

    // platform checks
    setCursor('default');
    const isMobile = navigator.userAgentData?.mobile === true || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent); 
    const supportChecks = [
        {
            trigger: isMobile,
            warning: "Mobile is not supported. Please use a Desktop or Laptop computer."
        },
        {
            trigger: document.documentMode,
            warning: "Internet Explorer is not supported. Please use another browser like Chrome or Firefox."
        }
    ];
    for (let i = 0; i < supportChecks.length; i++) {
        const check = supportChecks[i];

        if (check.trigger) {
            document.getElementById('clicktostart').innerHTML = check.warning;
            return;
        }
    }
    
    // boot logic
    if (localStorage.fromreboot === 'true') {
        drawSpaghetti();
        if (localStorage.startup === 'true') {
            document.getElementById('clicktostart').innerHTML = 'starting...';
            if (typeof startup !== 'undefined')
                startup();
            else
                init();
        } else {
            document.getElementById('clicktostart').innerHTML = 'going to menu...';
            document.getElementById('clicktostart').style.opacity = '0%';
            init();
        }
    } else {
        setCursor('pointer');
        if (localStorage.startup === 'true')
            document.getElementById('clicktostart').innerHTML = 'click or press enter to start';
        else
            document.getElementById('clicktostart').innerHTML = 'click or press enter to go to menu';

        let start = async () => {
            setCursor('none');
            document.onclick = document.onkeydown = null;
    
            drawSpaghetti();

            if (localStorage.startup === 'true') {
                if (typeof startup !== 'undefined') {
                    startup();
                } else {
                    init();
                }
            }

            else {
                document.getElementById('clicktostart').style.opacity = '0%';
                setTimeout(() => {
                    init();
                }, 1e3);
            }
        };
        document.onclick = start;
        document.onkeydown = (event) => {
            if (event.key.toLowerCase() === "enter") {
                start();
            }
        };
    }
});
