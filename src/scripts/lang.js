// BCP utils
function shortenBCP(bcpCode) {
    const convRegex = /^[\t ]*([a-z]+)(?:(?:-[^-\n\r\f]+)*(?:-([A-Z]{2}|\d+))(?:-[^-\n\r\f]+)*)?[\t ]*$/;
    const match = convRegex.exec(bcpCode);
    if (match != null) {
        match[1] = match[1].toLowerCase();
        if (match[2]) match[2] = match[2].toUpperCase();
        return match.slice(1).join('');
    } else return null;
}
function getBCPType(bcpCode) {
    const shortBCPRegex = /^[\t ]*[a-z]+(?:[A-Z]{2}|\d+)?[\t ]*$/;
    const BCP47Regex = /^[\t ]*[a-z]+(?:-[^-\n\r\f]+)*(?:-(?:[A-Z]{2}|\d+))?(?:-[^-\n\r\f]+)*[\t ]*$/;
    const looseBCP47Regex = /^[\t ]*[a-z]+(?:-[^-\n\r\f]+)*(?:-(?:[A-Za-z]{2}|\d+))?(?:-[^-\n\r\f]+)*[\t ]*$/;

    if (shortBCPRegex.test(bcpCode)) {
        return 'shortbcp';
    } else if (BCP47Regex.test(bcpCode)) {
        return 'bcp47';
    } else if (looseBCP47Regex.test(bcpCode)) {
        return 'loosebcp47';
    } else {
        return 'unknown';
    }
}

// locale utils
const locales = Object.fromEntries(globalThis.localesArray.map(v => [v.lang, v]));
const getLocaleStr = (key, fallbackLocale = 'enUS', fallbackStr) => locale[key] ?? locales[fallbackLocale]?.[key] ?? (fallbackStr || `Missing locale entry (k:${key};l:${localStorage.locale};f:${fallbackLocale})! This is a bug, please report it!`);
const getLocaleTempStr = (key, fallbackLocale = 'enUS', vars = {}, fallbackStr) => {
	let str = getLocaleStr(key, fallbackLocale, fallbackStr);
	Object.entries(vars).forEach(([name, value]) => {
		str = str.replaceAll(`{${name}}`, value);
	});
	return str;
};
function getLocaleTimeStr(type) {
    const localeStr = `time.format.${type}`
    if (Object.keys(locale).includes(localeStr)) {
        const date = new AdvDate();
        return getLocaleTempStr(localeStr, 'enUS', {
            // date
            yy: date.year().toString().slice(-2),
            yyyy: date.year(),
            MM: date.month()
                .toString().padStart(2, '0'),
            dd: date.day()
                .toString().padStart(2, '0'),

            // time
            hh: date.hours()
                .toString().padStart(2, '0'),
            mm: date.minutes()
                .toString().padStart(2, '0'),
            ss: date.seconds()
                .toString().padStart(2, '0'),
            ms: date.milliseconds()
                .toString().padStart(2, '0')
        });
    } else {
        throw new Error(`Unknown locale time string "${type}"`);
    }
}

// locale defs
if (!isDefined(localStorage.locale))
    localStorage.locale =
        Object.keys(locales).includes(shortenBCP(navigator.locale))
        ? shortenBCP(navigator.locale)
        : 'enUS';

let locale = locales[localStorage.locale] ?? locales['enUS'] ?? {};
