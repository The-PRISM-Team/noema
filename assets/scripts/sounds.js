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

let masterVolume = 1;
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
        if (!isDefined(volume))
            volume = parseFloat(localStorage.uiSoundVolume) * masterVolume.clamp(0, 1);

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
async function soundWarmup(cb) {
    let done = 0;
    for (const sound of sounds) {
        const audio = new Audio(`/assets/sounds/menu/${sound}`);
        audio.volume = 0;
        await audio.play().catch(()=>{});
        warmup.push(audio);

        done++;
        cb(done, sounds.length);
    }
}