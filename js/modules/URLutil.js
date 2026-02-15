function isURL(url) {
    try {
        new URL(url, window.location.href);
        return true;
    } catch {
        return false;
    }
}
function getFilenameFromURL(url) {
    if (!isURL(url)) return;
    url = decodeURIComponent(url);
    url = url.split('/');
    url = url.last();
    let filenameRegex = /^[\\w\\s\\p{L}-]+\\.[A-Za-z0-9]{2,5}$/iu;
    let isValid = filenameRegex.test(url);
    if (isValid) {
        return url;
    } else {
        // don't rely on this, probably, idk, debug later i guess, it's only fair]
        throw new SyntaxError("URL doesn't appear to have a valid filename!");
    }
}