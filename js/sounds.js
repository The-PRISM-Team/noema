const sounds =
    'back,confirm,error,fatal-error,notif,power,select' // CSV, may add something like this to util.js
    .split(',')
    .map(snd => snd = `${snd.trim()}.flac`);

function playSound(sound, volume = parseFloat(localStorage.uiSoundVolume), properties = {}) {
    let targetSoundIndex;
    if (sounds.filter((snd, i) => {
        const isTargetSound = snd.split('.').slice(0,-1).join('.') === 'power';
        if (isTargetSound) {
            targetSoundIndex = i;
        }

        return isTargetSound;
    }).length === 1) {
        const snd = new Audio(sounds[targetSoundIndex]);
        snd.volume = volume.clamp(0, 1);
        for (let [property, value] of Object.entries(properties)) {
            snd[property] = value;
        }
        snd.play();
    } else {
        throw new ReferenceError(`The sound "${sound}" doesn't exist/isn't registered.`);
    }
}