// SIX SEVEN! SIX SEVEN! SIX SEVEN! SIX SEVEN! SIX SEVEN! SIX SEVEN! SIX SEVEN! SIX SEVEN!
// 6767676767676767676767676767676767676767676767
const isNode = typeof process !== 'undefined' && process.versions?.node;
if (isNode) {
    console.log("Node.js is not supported. Please use a browser.")
    process.exit(1)
}

// localstorage definitions go here because this is the best place i could find
// don't even try asking why
if (localStorage.getItem('startup') === null) localStorage.startup = 'true'
if (localStorage.getItem('pauseMusic') === null) localStorage.pauseMusic = 'true'
if (localStorage.getItem('musicVolume') === null) localStorage.musicVolume = '0.18'
if (localStorage.getItem('noShaders') === null && navigator.deviceMemory < 4) localStorage.noShaders = 'true'
if (localStorage.getItem('noTransitions') === null && navigator.deviceMemory < 2) localStorage.noTransitions = 'true'



let pageStart = performance.now(),
    dependStart = null;

console.log('Loading page...')
let bgMusic
document.addEventListener('DOMContentLoaded', () => {
    dependStart = performance.now()
    console.log(`Page loaded in ${performance.now() - pageStart}ms.`)
    console.log('Loading resources...')
    bgMusic = new Audio('./menu_music.flac')
    bgMusic.preload = true
    document.getElementById('clicktostart').textContent = 'loading page resources, please wait'
})
window.addEventListener('load', async () => {
    console.log(`Resources loaded in ${performance.now() - dependStart}ms.`)
    console.log('Loading scripts...')
    const scriptStart = performance.now()
    await loadScripts()
    console.log(`Scripts loaded in ${performance.now() - scriptStart}ms.`)
    document.getElementById('clicktostart').textContent = 'loading scripts, please wait'
    console.log(`Finished loading in ${performance.now() - pageStart}ms!`)
    document.getElementById('clicktostart').textContent = 'finished loading'
    if (typeof test !== 'undefined') { 
        console.log(`Testing system...`)
        document.getElementById('clicktostart').innerHTML = 'testing system...'
        test()
    }

    const isMobile = navigator.userAgentData?.mobile === true || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) 
    const supportChecks = [
        {
            trigger: isMobile,
            warning: "Mobile is not supported. Please use a Desktop or Laptop computer."
        },
        {
            trigger: document.documentMode,
            warning: "Internet Explorer is not supported. Please use another browser like Chrome or Firefox."
        }
    ]
    for (let i = 0; i < supportChecks.length; i++) {
        const check = supportChecks[i]

        if (check.trigger) {
            document.getElementById('clicktostart').innerHTML = check.warning
            return
        }
    }

    if (localStorage.fromreboot === 'true') {
        if (localStorage.startup === 'true') {
            document.getElementById('clicktostart').innerHTML = 'starting...'
            if (typeof startup !== 'undefined')
                startup()
            else
                init()
        } else {
            document.getElementById('clicktostart').innerHTML = 'going to menu...'
            document.getElementById('clicktostart').style.opacity = '0%'
            init()
        }
    } else {
        if (localStorage.startup === 'true')
            document.getElementById('clicktostart').innerHTML = 'click or press enter to start'
        else
            document.getElementById('clicktostart').innerHTML = 'click or press enter to go to menu'

        let start = () => {
            // UI sound warmup
            const sounds = [
                'back.flac',
                'confirm.flac',
                'error.flac',
                'fatal-error.flac',
                'notif.flac',
                'power.flac',
                'select.flac'
            ];
            
            const warmup = []; // keep references so warmup stays in memory

            sounds.forEach(src => {
                const audio = new Audio(`./sounds/${src}`);
                audio.volume = 0;
                audio.play().catch(() => {});
                warmup.push(audio);
            });


            document.onclick = document.onkeydown = null

            drawSpaghetti()

            if (localStorage.startup === 'true')
                if (typeof startup !== 'undefined') {
                    startup()
                } else {
                    init()
                }

            else {
                document.getElementById('clicktostart').style.opacity = '0%'
                setTimeout(() => {
                    init()
                }, 1e3)
            }
        }
        document.onclick = start
        document.onkeydown = (event) => {
            if (event.key.toLowerCase() === "enter") {
                start()
            }
        }
    }
})