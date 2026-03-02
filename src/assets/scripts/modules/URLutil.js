function isURL(url) {
    try {
        new URL(url, location.href);
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
        // not sure about this, debug later i guess 
        throw new SyntaxError("URL doesn't appear to have a valid filename!");
    }
}