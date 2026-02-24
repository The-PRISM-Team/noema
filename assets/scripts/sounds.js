const sounds =
    [
        'back.flac',
        'confirm.flac',
        'error.flac',
        'fatal-error.flac',
        'notif.flac',
        'power.flac',
        'select.flac',
        '../coldboot.flac', // this path is valid btw
        '../menu_music.flac'
    ];

function playSound(sound, volume, properties = {}) {
    let targetSoundIndex;
    if (sounds.filter((snd, i) => {
        const isTargetSound = snd.split('.').slice(0,-1).join('.') === sound;
        if (isTargetSound) {
            targetSoundIndex = i;
        }

        return isTargetSound;
    }).length === 1) {
        const snd = new Audio(`/assets/sounds/menu/${sounds[targetSoundIndex]}`);
        if (!isDefined(volume)) volume = parseFloat(localStorage.uiSoundVolume);
        snd.volume = volume.clamp(0, 1);
        for (let [property, value] of Object.entries(properties)) {
            snd[property] = value;
        }
        snd.play();
    } else {
        throw new ReferenceError(`The sound "${sound}" doesn't exist/isn't registered.`);
    }
}

// keep sounds in memory to keep "warm"
const warmup = [];
function soundWarmup() {
    sounds.forEach(src => {
        const audio = new Audio(`/assets/sounds/menu/${src}`);
        audio.volume = 0;
        audio.play().catch(() => {});
        warmup.push(audio);
    });
}