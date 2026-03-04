const sounds =
    [
        'back.flac',
        'confirm.flac',
        'error.flac',
        'notif.flac',
        'power.flac',
        'select.flac',
        '../fatal-error.flac', // this path is valid btw
        '../coldboot.flac',
        '../menu_music.flac'
    ];
const soundIndexByName = {};
for (let i = 0; i < sounds.length; i++) {
    const soundNameRegex = /(.{0,2}\/)*([\w-]+)\.(\w+)/g;
    const soundNameGroup = 2;
    soundIndexByName[soundNameRegex.exec(sounds[i])[soundNameGroup]] = i;
}

let masterVolume = 1;
function setMasterVolume(volume = 1) {
    const parsedVolume = parseFloat(volume);
    if (isNaN(parsedVolume)) {
        throw new TypeError('Master volume must be a valid number.');
    }

    masterVolume = parsedVolume.clamp(0, 1);
    localStorage.masterVolume = masterVolume.toString();

    if (isDefined(bgMusic)) {
        bgMusic.volume = parseFloat(localStorage.musicVolume).clamp(0, 1) * masterVolume;
    }

    return masterVolume;
}
setMasterVolume(localStorage.masterVolume);
function playSound(sound, volume, properties = {}) {
    const targetSoundIndex = soundIndexByName[sound];
    if (typeof targetSoundIndex === 'number') {
        const snd = new Audio(`/assets/sounds/menu/${sounds[targetSoundIndex]}`);
        if (!isDefined(volume))
            volume = parseFloat(localStorage.uiSoundVolume) * masterVolume.clamp(0, 1);

        snd.volume = volume.clamp(0, 1);
        for (const [property, value] of Object.entries(properties)) {
            snd[property] = value;
        }
        snd.play();
    } else {
        throw new ReferenceError(`The sound "${sound}" doesn't exist/isn't registered.`);
    }
}

// keep sounds in memory to keep them "warm"
const warmupSounds = [];
async function soundWarmup(cb = ()=>{}) {
    warmupSounds.length = 0; // clear warmup array
    let done = 0;
    for (const sound of sounds) {
        const audio = new Audio(`/assets/sounds/menu/${sound}`);
        audio.volume = 0;
        let failed = false;
        const result = await audio.play().catch(()=>{
            failed = true
        });
        if (!failed) warmupSounds.push(audio);

        done++;
        cb(done, sounds.length, audio, result);
    }
    return soundWarmup;
}
