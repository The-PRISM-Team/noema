function parseSemver(value, fallback = '0.0.0') {
    const source = String(isDefined(value) ? value : fallback).trim();
    const match = source.match(/(\d+)\.(\d+)\.(\d+)/);

    if (!match) {
        const fallbackMatch = String(fallback).match(/(\d+)\.(\d+)\.(\d+)/);
        if (!fallbackMatch) {
            return { major: 0, minor: 0, patch: 0 };
        }
        return {
            major: Number(fallbackMatch[1]) || 0,
            minor: Number(fallbackMatch[2]) || 0,
            patch: Number(fallbackMatch[3]) || 0
        };
    }

    return {
        major: Number(match[1]) || 0,
        minor: Number(match[2]) || 0,
        patch: Number(match[3]) || 0
    };
}

function compareSemver(a, b) {
    const left = parseSemver(a);
    const right = parseSemver(b);
    const keys = ['major', 'minor', 'patch'];

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (left[key] > right[key]) return 1;
        if (left[key] < right[key]) return -1;
    }

    return 0;
}
